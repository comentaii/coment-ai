import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { UserService } from '@/services/db/user.service';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

const userService = new UserService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.companyId || !['hr_manager', 'super_admin'].includes(session.user.role)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid profile ID.' });
    }

    await connectToDatabase();

    // Find the profile to get the associated userId
    const profile = await candidateProfileService.findById(id);
    if (!profile) {
        return res.status(404).json({ error: 'Candidate profile not found.' });
    }
    
    // Security check: ensure the profile belongs to the user's company
    if (profile.companyId.toString() !== session.user.companyId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the profile and the associated user
    await candidateProfileService.delete(id);
    if (profile.userId) {
        await userService.delete(profile.userId.toString());
    }

    return res.status(200).json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
