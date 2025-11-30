import { NextRequest, NextResponse } from 'next/server';
import { disconnectPrisma } from './prisma';

// Error types for consistent API responses
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// Standard API response wrapper
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function createErrorResponse(
  error: Error | ApiError,
  request?: NextRequest
): NextResponse {
  // Log error for debugging
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: request?.url,
    method: request?.method,
  });

  // Determine status code and response
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An internal error occurred';

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    errorCode = error.code || 'API_ERROR';
    message = error.message;
  } else if (error instanceof ValidationError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = error.message;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An internal error occurred';
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

// API wrapper function for consistent error handling
export async function withApiHandler<T>(
  handler: () => Promise<T>,
  request?: NextRequest
): Promise<NextResponse> {
  try {
    const result = await handler();
    return createSuccessResponse(result);
  } catch (error) {
    return createErrorResponse(error as Error, request);
  } finally {
    // Ensure database connection is closed in serverless
    await disconnectPrisma();
  }
}

// CORS helper for API routes
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Rate limiting helper (basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Get client IP for rate limiting
export function getClientIp(request: NextRequest): string {
  return request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
}