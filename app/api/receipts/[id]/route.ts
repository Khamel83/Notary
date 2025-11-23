import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    // Format receipt data
    const receipt = {
      id: appointment.id,
      appointmentDate: appointment.appointmentDate.toISOString(),
      customerName: appointment.user.name || 'Guest',
      customerEmail: appointment.user.email,
      address: `${appointment.serviceAddress}, ${appointment.serviceCity}, ${appointment.serviceZip}`,
      numberOfSignatures: appointment.numberOfSignatures,
      baseFee: appointment.baseFee,
      travelFee: appointment.travelFee,
      surcharges: appointment.totalAmount - appointment.baseFee - appointment.travelFee,
      totalAmount: appointment.totalAmount,
      paymentMethod: appointment.paymentMethod || 'card',
      paymentStatus: appointment.paymentStatus,
      createdAt: appointment.createdAt.toISOString(),
    };

    return NextResponse.json(receipt);
  } catch (error: any) {
    console.error('Receipt fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  }
}
