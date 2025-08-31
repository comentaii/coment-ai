import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/utils/response-handler';
import { geminiService } from '@/services/ai/gemini.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.length < 50) {
      return ResponseHandler.error('Analiz için en az 50 karakterlik bir metin gereklidir.', 400);
    }

    const parsedData = await geminiService.analyzeJobPostingText(text);

    return ResponseHandler.success(parsedData);

  } catch (error: any) {
    console.error('AI Parser API error:', error);
    return ResponseHandler.serverError('Yapay zeka analiz servisinde bir hata oluştu: ' + error.message);
  }
}
