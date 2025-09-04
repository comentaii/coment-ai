import { NextResponse } from 'next/server';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export class ResponseHandler {
  static success<T>(data: T, message = 'Success', status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(
    message: string = 'An unexpected error occurred.',
    status: number = 500,
    errors?: Record<string, string[]>
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status }
    );
  }

  static unauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(message, 401);
  }

  static forbidden(message = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error(message, 403);
  }

  static notFound(message = 'Not found'): NextResponse<ApiResponse> {
    return this.error(message, 404);
  }

  static serverError(message = 'Internal server error'): NextResponse<ApiResponse> {
    return this.error(message, 500);
  }

  // Instance methods for backward compatibility
  success<T>(data: T, message = 'Success', status = 200): NextResponse<ApiResponse<T>> {
    return ResponseHandler.success(data, message, status);
  }

  error(
    message: string = 'An unexpected error occurred.',
    status: number = 500,
    errors?: Record<string, string[]>
  ): NextResponse<ApiResponse> {
    return ResponseHandler.error(message, status, errors);
  }

  unauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return ResponseHandler.unauthorized(message);
  }

  forbidden(message = 'Forbidden'): NextResponse<ApiResponse> {
    return ResponseHandler.forbidden(message);
  }

  notFound(message = 'Not found'): NextResponse<ApiResponse> {
    return ResponseHandler.notFound(message);
  }

  serverError(message = 'Internal server error'): NextResponse<ApiResponse> {
    return ResponseHandler.serverError(message);
  }
}

// Export instance for backward compatibility
export const responseHandler = new ResponseHandler(); 