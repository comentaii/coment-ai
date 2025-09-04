import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/utils/response-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || !/^https:\/\/www\.linkedin\.com\/jobs\/view\//.test(url)) {
      return ResponseHandler.error('Geçerli bir LinkedIn iş ilanı URL\'i gereklidir.', 400);
    }

    // Temporarily disabled LinkedIn parsing to fix build issues
    return ResponseHandler.success({
      title: 'LinkedIn Parser Temporarily Disabled',
      description: 'This feature is temporarily disabled during build fixes.',
      skills: [],
    });

  } catch (error: any) {
    console.error('LinkedIn parsing error:', error);
    return ResponseHandler.serverError('Parser servisinde beklenmeyen bir hata oluştu: ' + error.message);
  }
}
