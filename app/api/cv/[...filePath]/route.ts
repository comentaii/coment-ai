import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { responseHandler } from '@/utils/response-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: { filePath: string[] } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return responseHandler.error('Unauthorized', 401);
    }

    const { filePath } = params;

    if (!filePath || !Array.isArray(filePath)) {
      return responseHandler.error('File path is required.', 400);
    }

    // Join the array segments into a single path string
    const requestedPath = filePath.join('/');

    // Security: Prevent directory traversal attacks.
    // The base directory where files are stored.
    const baseDir = path.resolve(process.cwd(), 'public', 'uploads');
    // The final, absolute path of the requested file.
    const absoluteFilePath = path.resolve(baseDir, requestedPath);

    // Check if the resolved path is still within the intended base directory.
    if (!absoluteFilePath.startsWith(baseDir)) {
      return responseHandler.error('Forbidden', 403);
    }

    try {
      // Check if the file exists
      await fs.access(absoluteFilePath);
      
      // Read the file
      const fileBuffer = await fs.readFile(absoluteFilePath);
      
      // Return the file as a response
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${path.basename(absoluteFilePath)}"`,
        },
      });
    } catch (error) {
      return responseHandler.error('File not found.', 404);
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return responseHandler.error('Internal server error.');
  }
}
