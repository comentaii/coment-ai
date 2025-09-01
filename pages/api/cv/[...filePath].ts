import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { filePath } = req.query;

  if (!filePath || !Array.isArray(filePath)) {
    return res.status(400).json({ error: 'File path is required.' });
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
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Check if the file exists
    if (fs.existsSync(absoluteFilePath)) {
      // Read the file and stream it back.
      const fileStream = fs.createReadStream(absoluteFilePath);
      res.setHeader('Content-Type', 'application/pdf');
      // Optional: Set a filename for download
      // res.setHeader('Content-Disposition', `inline; filename="${path.basename(absoluteFilePath)}"`);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ error: 'File not found.' });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

