import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentReminder } from '@/lib/email';
import { sendAppointmentReminderSMS } from '@/lib/sms';

// This endpoint will be called by a cron job (Vercel Cron, Railway Cron, or GitHub Actions)
// To secure it, you can add an authorization header check

export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    let remindersSent = 0;
    let errors = 0;

    // Find appointments needing 24-hour reminders
    const appointments24h = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(in24Hours.getTime() - 30 * 60 * 1000), // 30 min window
          lte: new Date(in24Hours.getTime() + 30 * 60 * 1000),
        },
        status: 'CONFIRMED',
        reminder24hSent: false,
      },
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

    console.log(`Found ${appointments24h.length} appointments needing 24h reminders`);

    // Send 24-hour reminders
    for (const apt of appointments24h) {
      try {
        const formattedDate = new Date(apt.appointmentDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const formattedTime = new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // Send email reminder
        await sendAppointmentReminder({
          to: apt.user.email,
          name: apt.user.name || 'Customer',
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          address: apt.serviceAddress,
          confirmationCode: apt.id.slice(0, 8).toUpperCase(),
        });

        // Send SMS reminder if phone exists
        if (apt.user.phone) {
          await sendAppointmentReminderSMS({
            to: apt.user.phone,
            name: apt.user.name || 'Customer',
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            address: apt.serviceAddress,
            confirmationCode: apt.id.slice(0, 8).toUpperCase(),
          });
        }

        // Mark reminder as sent
        await prisma.appointment.update({
          where: { id: apt.id },
          data: {
            reminder24hSent: true,
            reminder24hSentAt: new Date(),
          },
        });

        remindersSent++;
        console.log(`✅ 24h reminder sent for appointment ${apt.id}`);
      } catch (error: any) {
        console.error(`❌ Failed to send reminder for ${apt.id}:`, error);
        errors++;
      }
    }

    // Find appointments needing 1-hour reminders
    const appointments1h = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(in1Hour.getTime() - 15 * 60 * 1000), // 15 min window
          lte: new Date(in1Hour.getTime() + 15 * 60 * 1000),
        },
        status: 'CONFIRMED',
        reminder1hSent: false,
      },
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

    console.log(`Found ${appointments1h.length} appointments needing 1h reminders`);

    // Send 1-hour reminders (SMS only for urgency)
    for (const apt of appointments1h) {
      try {
        const formattedTime = new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // Send SMS reminder only (more urgent)
        if (apt.user.phone) {
          await sendAppointmentReminderSMS({
            to: apt.user.phone,
            name: apt.user.name || 'Customer',
            appointmentDate: 'in 1 hour',
            appointmentTime: formattedTime,
            address: apt.serviceAddress,
            confirmationCode: apt.id.slice(0, 8).toUpperCase(),
          });
        }

        // Mark reminder as sent
        await prisma.appointment.update({
          where: { id: apt.id },
          data: {
            reminder1hSent: true,
            reminder1hSentAt: new Date(),
          },
        });

        remindersSent++;
        console.log(`✅ 1h reminder sent for appointment ${apt.id}`);
      } catch (error: any) {
        console.error(`❌ Failed to send 1h reminder for ${apt.id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      errors,
      message: `Sent ${remindersSent} reminders with ${errors} errors`,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}
