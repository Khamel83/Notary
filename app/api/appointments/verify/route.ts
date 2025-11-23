import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find appointment by cancellation token
    const appointment = await prisma.appointment.findUnique({
      where: { cancellationToken: token },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    // Check if appointment is already cancelled
    if (appointment.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This appointment has already been cancelled' },
        { status: 400 }
      );
    }

    // Check if appointment is in the past
    if (new Date(appointment.appointmentDate) < new Date()) {
      return NextResponse.json(
        { error: 'This appointment has already passed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      serviceAddress: appointment.serviceAddress,
      numberOfSignatures: appointment.numberOfSignatures,
      totalAmount: appointment.totalAmount,
      status: appointment.status,
      user: appointment.user,
    });
  } catch (error: any) {
    console.error('Verify appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to verify appointment' },
      { status: 500 }
    );
  }
}
