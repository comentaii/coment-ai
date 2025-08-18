import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { connectToDatabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.companyId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();
    const companyId = session.user.companyId;
    const candidates = await candidateProfileService.findByCompany(companyId);
    
    return res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
