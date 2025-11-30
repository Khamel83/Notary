import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './api-wrapper';

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/appointments': { requests: 10, windowMs: 60000 }, // 10 requests per minute
  '/api/checkout': { requests: 5, windowMs: 60000 }, // 5 requests per minute
  '/api/webhooks': { requests: 100, windowMs: 60000 }, // 100 requests per minute (for webhooks)
  '/api/cron': { requests: 1, windowMs: 60000 }, // 1 request per minute (for cron jobs)
  default: { requests: 100, windowMs: 60000 }, // 100 requests per minute for other APIs
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only rate limit API routes
  if (pathname.startsWith('/api/')) {
    // Find the most specific rate limit rule
    let rateLimitRule = RATE_LIMITS.default;
    for (const [path, rule] of Object.entries(RATE_LIMITS)) {
      if (path !== 'default' && pathname.startsWith(path)) {
        rateLimitRule = rule;
        break;
      }
    }

    const clientIp = getClientIp(request);
    const key = `${clientIp}:${pathname}`;

    if (!checkRateLimit(key, rateLimitRule.requests, rateLimitRule.windowMs)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
          },
        },
        { status: 429 }
      );
    }
  }

  // Security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Add environment-specific headers
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};