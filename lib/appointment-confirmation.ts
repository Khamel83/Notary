import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { z } from 'zod';

// Simple validation schema
const ConfirmationSchema = z.object({
  appointmentId: z.string(),
  confirmationCode: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, confirmationCode } = ConfirmationSchema.parse(body);

    // Validate appointment exists and matches code
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        cancellationToken: confirmationCode,
      },
    });

    if (!appointment) {
      return NextResponse.json({
        success: false,
        error: 'Appointment not found or confirmation code expired',
        status: 404,
      });
    }

    // Update appointment status to CONFIRMED
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: 'CONFIRMED',
      confirmationCode: null,
      confirmedAt: new Date(),
      reminder24hSentAt: appointment.reminder24hSentAt,
      reminder1hSentAt: appointment.reminder1hSentAt,
      updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        appointment: updatedAppointment,
        message: 'Appointment confirmed! We\'ll see you at the scheduled time.',
      },
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to confirm appointment',
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url).searchParams;
  const appointmentId = searchParams.get('id');
  const code = searchParams.get('code');

  if (!appointmentId || !code) {
    return NextResponse.json({
      success: false,
      error: 'Appointment ID and confirmation code are required',
      status: 400,
    });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        confirmationCode: code,
      },
    });

    if (!appointment) {
      return NextResponse.json({
        success: false,
        error: 'Appointment not found or confirmation code expired',
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        appointment,
        message: `✅ Appointment confirmed! We\'ll see you at ${appointment.serviceAddress} on ${appointment.appointmentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} at ${appointment.appointmentDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}.`,
      },
    });
  } catch (error) {
    console.error('Confirmation page error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load appointment',
      status: 500,
    });
  }
}