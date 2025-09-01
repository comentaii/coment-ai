import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/utils/response-handler';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || !/^https:\/\/www\.linkedin\.com\/jobs\/view\//.test(url)) {
      return ResponseHandler.error('Geçerli bir LinkedIn iş ilanı URL\'i gereklidir.', 400);
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    if (!response.ok) {
      return ResponseHandler.error(`LinkedIn sayfasına ulaşılamadı. Durum Kodu: ${response.status}`, 502);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // More robust selectors with fallbacks, as suggested
    const title =
      $('.top-card-layout__title').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('.job-details-jobs-unified-top-card__job-title').first().text().trim();

    // The user correctly pointed out that the main content is in #job-details.
    // This is much more reliable than relying on changing class names.
    const jobDetailsText = $('#job-details').text().trim();

    // The description will now be the raw text from the job details section.
    // We let the user manually extract skills from this text.
    const description = jobDetailsText;
    const skills: string[] = []; // Skills will be manually entered by the user from the description.

    if (!title || !description) {
      return ResponseHandler.error('İlan başlığı veya açıklaması #job-details içinden alınamadı. URL\'i kontrol edin veya LinkedIn sayfa yapısı değişmiş olabilir.', 422);
    }

    return ResponseHandler.success({
      title,
      description,
      skills,
    });

  } catch (error: any) {
    console.error('LinkedIn parsing error:', error);
    return ResponseHandler.serverError('Parser servisinde beklenmeyen bir hata oluştu: ' + error.message);
  }
}
