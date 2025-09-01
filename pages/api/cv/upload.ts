import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Server } from 'socket.io';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import { geminiService } from '@/services/ai/gemini.service';
import { UserService } from '@/services/db/user.service';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { connectToDatabase } from '@/lib/db';
import { fileTypeFromFile } from 'file-type';

// Define a type for the response from the server's socket
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: any;
  };
}

// Disable the default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

const userService = new UserService();

// Ensure directory exists, creating it if necessary
const ensureDirExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch (e) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.companyId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const companyId = session.user.companyId;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', companyId);
  await ensureDirExists(uploadDir);

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      // Sanitize filename and add a timestamp for uniqueness
      const sanitizedName = part.originalFilename?.replace(/[^a-zA-Z0-9.\-_]/g, '') || 'cv';
      return `${path.parse(sanitizedName).name}_${Date.now()}${path.parse(sanitizedName).ext}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error processing upload.' });
    }

    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
    const taskIds = Array.isArray(fields.taskIds) ? fields.taskIds : [fields.taskIds];

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Process each file in the background
    uploadedFiles.forEach(async (file, index) => {
      if (!file) return;

      const taskId = taskIds[index];
      const io: Server | undefined = res.socket.server.io;
      const publicPath = `/uploads/${companyId}/${file.newFilename}`; // Create a public-facing URL path

      try {
        // Server-side file type validation
        const fileTypeResult = await fileTypeFromFile(file.filepath);
        if (!fileTypeResult || fileTypeResult.ext !== 'pdf') {
          // Clean up the invalid file
          await fs.unlink(file.filepath);
          
          const errorMessage = `Invalid file type: ${file.originalFilename}. Only PDFs are allowed.`;
          console.error(errorMessage);
          
          if (io) {
            io.to(session.user.id).emit('upload_status', {
              taskId,
              status: 'error',
              error: errorMessage,
              errorType: 'validation', // Add error type
            });
          }
          return; // Stop processing this file
        }

        if (io) io.to(session.user.id).emit('upload_status', { taskId, status: 'processing' });
        
        // 1. Analyze CV with Gemini
        const analysisResult = await geminiService.analyzeCV(file.filepath);

        await connectToDatabase();

        // 2. Check if a user with this email already exists for the company
        let candidate = await userService.findByEmail(analysisResult.contactInfo.email || '');
        
        if (!candidate) {
            // 3. If not, create a new user with the 'candidate' role
            candidate = await userService.createUser({
                name: analysisResult.fullName,
                email: analysisResult.contactInfo.email,
                role: 'candidate',
                companyId: companyId,
            });
        }
        
        // 4. Create or update the candidate's profile with the analysis result and the correct public path
        const profile = await candidateProfileService.createOrUpdateProfile(candidate._id, companyId, publicPath);
        await candidateProfileService.updateAnalysisResult(candidate._id, analysisResult);

        if (io) io.to(session.user.id).emit('upload_status', { taskId, status: 'success', analysis: analysisResult });

      } catch (error: any) {
        console.error(`Error processing file ${file.originalFilename}:`, error);

        let errorMessage = 'Failed to process CV.';
        let errorType: 'validation' | 'server' = 'server';

        if (error.message && error.message.includes('User validation failed: email: Email is required')) {
          errorMessage = 'Processing failed: Could not identify an email in the document. Please upload a valid CV.';
          errorType = 'validation';
        }

        if (io) {
          io.to(session.user.id).emit('upload_status', {
            taskId,
            status: 'error',
            error: errorMessage,
            errorType: errorType, // Add error type
          });
        }
      }
    });

    res.status(202).json({ message: 'Upload received and is being processed.' });
  });
};

export default handler;
