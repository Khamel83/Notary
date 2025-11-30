import { PrismaClient } from '@prisma/client';

// Enhanced Prisma client for Vercel + Homelab setup
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  // Configure for serverless environments with connection pooling
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Optimize for serverless
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection timeout settings for serverless
    __internal: {
      engine: {
        // Prevent connection timeouts in serverless
        binaryTargets: ['native'],
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Only assign to global in development to prevent memory leaks in serverless
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown helper for serverless
export async function disconnectPrisma(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
