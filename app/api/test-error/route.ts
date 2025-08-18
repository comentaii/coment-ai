import { NextRequest, NextResponse } from 'next/server';
import { redirectToNotFound, redirectToUnauthorized, redirectToForbidden } from '@/lib/utils/navigation-errors';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const errorType = searchParams.get('type');

  switch (errorType) {
    case '404':
      redirectToNotFound();
      break;
    case '401':
      redirectToUnauthorized();
      break;
    case '403':
      redirectToForbidden();
      break;
    case '500':
      throw new Error('Internal Server Error - Test');
    default:
      return NextResponse.json({ 
        message: 'Error test endpoint',
        available: ['404', '401', '403', '500'],
        usage: '/api/test-error?type=404'
      });
  }
}

export async function POST(request: NextRequest) {
  // Simulate server error
  throw new Error('POST method not allowed');
}
