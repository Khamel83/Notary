import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentReminder } from '@/lib/email';
import { sendAppointmentReminderSMS } from '@/lib/sms';

interface RetentionData {
  completedAppointments: number;
  revenue: number;
  averageRevenue: number;
  churnRisk: 'low' | 'medium' | 'high';
}

export async function POST(request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce((sum, apt) => sum + apt.totalAmount, 0);
    const averageRevenue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

    // Churn analysis - identify at-risk customers
    const churnRisk = appointments.some(apt => {
      const daysSinceAppointment = (Date.now() - apt.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceAppointment > 20; // No rebooking in 20+ days
    }) ? 'high' : 'low';

    const retentionData: RetentionData = {
      completedAppointments: totalAppointments,
      revenue: totalRevenue,
      averageRevenue: averageRevenue,
      churnRisk: churnRisk,
    };

    return NextResponse.json({
      success: true,
      data: retentionData,
    });
  } catch (error) {
    console.error('Retention analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze retention data',
      status: 500,
    });
  }
}