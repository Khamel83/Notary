import { NextResponse } from 'next/server';
import { checkDatabaseHealth, prisma } from './prisma';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  services: {
    database: 'connected' | 'error';
    external_apis: 'connected' | 'error' | 'not_configured';
  };
  metrics?: {
    total_appointments: number;
    pending_appointments: number;
    database_latency_ms?: number;
  };
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  const version = process.env.npm_package_version || '1.0.0';

  // Check database health
  const dbHealthy = await checkDatabaseHealth();

  // Check external APIs (if configured)
  let externalApisStatus: 'connected' | 'error' | 'not_configured' = 'not_configured';

  // Check Stripe if configured
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      // Simple health check - just validate the key format
      if (process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        externalApisStatus = 'connected';
      } else {
        externalApisStatus = 'error';
      }
    } catch (error) {
      externalApisStatus = 'error';
    }
  }

  // Get metrics if database is healthy
  let metrics: HealthStatus['metrics'];
  if (dbHealthy) {
    try {
      const startTime = Date.now();

      const [totalAppointments, pendingAppointments] = await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: 'PENDING' } })
      ]);

      const dbLatency = Date.now() - startTime;

      metrics = {
        total_appointments: totalAppointments,
        pending_appointments: pendingAppointments,
        database_latency_ms: dbLatency,
      };
    } catch (error) {
      console.error('Failed to get metrics:', error);
    }
  }

  // Determine overall status
  let status: HealthStatus['status'] = 'ok';
  if (!dbHealthy) {
    status = 'error';
  } else if (externalApisStatus === 'error') {
    status = 'degraded';
  }

  return {
    status,
    timestamp,
    version,
    services: {
      database: dbHealthy ? 'connected' : 'error',
      external_apis: externalApisStatus,
    },
    metrics,
  };
}

// Health endpoint response
export function createHealthResponse(status: HealthStatus): NextResponse {
  const statusCode = status.status === 'error' ? 503 :
                    status.status === 'degraded' ? 200 : 200;

  return NextResponse.json(status, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}