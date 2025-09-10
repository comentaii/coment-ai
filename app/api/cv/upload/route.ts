import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import { geminiService } from '@/services/ai/gemini.service';
import { UserService } from '@/services/db/user.service';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { connectToDatabase } from '@/lib/db';
import { fileTypeFromFile } from 'file-type';
import { responseHandler } from '@/utils/response-handler';
import { revalidateTag } from 'next/cache';

const userService = new UserService();

// Ensure directory exists, creating it if necessary
const ensureDirExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch (e) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.companyId) {
      return responseHandler.error('Unauthorized', 401);
    }

    const companyId = session.user.companyId;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', companyId);
    await ensureDirExists(uploadDir);

    // Convert NextRequest to a Node.js compatible request for formidable
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const taskIds = formData.getAll('taskIds') as string[];

    if (files.length === 0) {
      return responseHandler.error('No files uploaded.', 400);
    }

    // Process files sequentially to ensure proper error handling and cache invalidation
    const results = [];
    
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const taskId = taskIds[index];
      
      if (!file) continue;
      
      try {
        // Create a temporary file path
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '') || 'cv';
        const fileName = `${path.parse(sanitizedName).name}_${Date.now()}${path.parse(sanitizedName).ext}`;
        const filePath = path.join(uploadDir, fileName);

        // Convert File to Buffer and save
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        const publicPath = `/uploads/${companyId}/${fileName}`;

        // Server-side file type validation
        const fileTypeResult = await fileTypeFromFile(filePath);
        if (!fileTypeResult || fileTypeResult.ext !== 'pdf') {
          // Clean up the invalid file
          await fs.unlink(filePath);
          
          const errorMessage = `Invalid file type: ${file.name}. Only PDFs are allowed.`;
          console.error(errorMessage);
          
          results.push({
            taskId,
            status: 'error',
            error: errorMessage,
            errorType: 'validation'
          });
          continue;
        }
        
        // 1. Analyze CV with Gemini
        const analysisResult = await geminiService.analyzeCV(filePath);

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

        results.push({
          taskId,
          status: 'success',
          analysis: analysisResult
        });

      } catch (error: any) {
        console.error(`Error processing file ${file.name}:`, error);

        let errorMessage = 'Failed to process CV.';
        let errorType: 'validation' | 'server' = 'server';

        if (error.message && error.message.includes('User validation failed: email: Email is required')) {
          errorMessage = 'Processing failed: Could not identify an email in the document. Please upload a valid CV.';
          errorType = 'validation';
        }

        results.push({
          taskId,
          status: 'error',
          error: errorMessage,
          errorType
        });
      }
    }

    // Invalidate candidates cache to refresh the UI
    revalidateTag('Candidates');

    return responseHandler.success(
      { 
        message: 'Upload completed.',
        results: results
      },
      'Files processed successfully',
      200
    );

  } catch (error) {
    console.error('Upload error:', error);
    return responseHandler.error('Error processing upload');
  }
}