import { NextRequest } from 'next/server';
import { getHealthStatus, createHealthResponse } from '@/lib/health';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = await getHealthStatus();
    return createHealthResponse(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);

    return createHealthResponse({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'error',
        external_apis: 'error',
      },
    });
  }
}

// HEAD method for simple uptime checks
export async function HEAD() {
  try {
    const healthStatus = await getHealthStatus();
    const statusCode = healthStatus.status === 'error' ? 503 : 200;

    return new Response(null, { status: statusCode });
  } catch (error) {
    return new Response(null, { status: 503 });
  }
}