// Vercel-specific utilities and configurations

export interface VercelEnvironment {
  isProduction: boolean;
  isPreview: boolean;
  isDevelopment: boolean;
  region: string;
  vercelEnv: string;
}

export function getVercelEnvironment(): VercelEnvironment {
  return {
    isProduction: process.env.VERCEL_ENV === 'production',
    isPreview: process.env.VERCEL_ENV === 'preview',
    isDevelopment: process.env.NODE_ENV === 'development' || !process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION || 'unknown',
    vercelEnv: process.env.VERCEL_ENV || 'development',
  };
}

// Edge runtime compatibility check
export function canRunAtEdge(): boolean {
  // Check if we're using any Node.js-only dependencies
  const nodeOnlyDeps = ['pg', 'mysql2', 'sqlite3', 'better-sqlite3'];
  const hasNodeOnlyDeps = nodeOnlyDeps.some(dep => {
    try {
      require.resolve(dep);
      return true;
    } catch {
      return false;
    }
  });

  return !hasNodeOnlyDeps;
}

// Database URL optimization for Vercel
export function optimizeDatabaseUrl(url: string): string {
  const optimized = new URL(url);

  // Add connection pooling parameters for PostgreSQL
  if (optimized.protocol === 'postgres:' || optimized.protocol === 'postgresql:') {
    const params = optimized.searchParams;

    // Enable connection pooling
    if (!params.has('pgbouncer') && !params.has('connection_limit')) {
      params.set('connection_limit', '10');
    }

    // Set SSL mode for production
    const env = getVercelEnvironment();
    if (env.isProduction && !params.has('sslmode')) {
      params.set('sslmode', 'require');
    }

    // Set timeout for serverless functions
    if (!params.has('connect_timeout')) {
      params.set('connect_timeout', '10');
    }
  }

  return optimized.toString();
}

// Cache headers for static data
export function getCacheHeaders(maxAge: number = 3600, staleWhileRevalidate: number = 86400) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    'CDN-Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

// Function timeout configuration for Vercel
export function getFunctionTimeout(route: string): number {
  // Longer timeouts for database operations
  const dbIntensiveRoutes = ['/api/appointments', '/api/receipts', '/api/cron'];
  if (dbIntensiveRoutes.some(r => route.startsWith(r))) {
    return 30; // 30 seconds
  }

  // Standard timeout for most operations
  return 10; // 10 seconds
}

// Environment-specific configuration
export function getConfig() {
  const env = getVercelEnvironment();

  return {
    databaseUrl: process.env.DATABASE_URL,
    isProduction: env.isProduction,
    isPreview: env.isPreview,
    region: env.region,
    canUseEdge: canRunAtEdge(),
    functionTimeouts: {
      '/api/appointments': 30,
      '/api/checkout': 15,
      '/api/webhooks': 10,
      '/api/cron': 30,
      '/api/health': 5,
      default: 10,
    },
  };
}