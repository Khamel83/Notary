import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingConfirmationEmail {
  to: string;
  name: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  numberOfSignatures: number;
  totalAmount: number;
  receiptUrl: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationEmail) {
  // Check if email is enabled
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email disabled (no RESEND_API_KEY). Would send to:', data.to);
    console.log('Appointment:', data.appointmentDate, 'at', data.appointmentTime);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a365d 0%, #2d5282 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                <span style="color: #D4AF37;">LA</span> Mobile Notary
              </h1>
              <p style="margin: 10px 0 0; color: #D4AF37; font-size: 14px; font-weight: 600;">Licensed & Bonded</p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #1a365d; font-size: 24px; font-weight: 700; text-align: center;">
                Booking Confirmed!
              </h2>
              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                Hi ${data.name}, your mobile notary appointment is confirmed.
              </p>

              <!-- Appointment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 10px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">📅 Date</td>
                        <td align="right" style="color: #1f2937; font-size: 14px; font-weight: 600; padding: 8px 0;">${data.appointmentDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">🕐 Time</td>
                        <td align="right" style="color: #1f2937; font-size: 14px; font-weight: 600; padding: 8px 0;">${data.appointmentTime}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">📍 Location</td>
                        <td align="right" style="color: #1f2937; font-size: 14px; font-weight: 600; padding: 8px 0;">${data.address}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">✍️ Signatures</td>
                        <td align="right" style="color: #1f2937; font-size: 14px; font-weight: 600; padding: 8px 0;">${data.numberOfSignatures}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 2px solid #e5e7eb; padding: 12px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #1a365d; font-size: 16px; font-weight: 700;">Total Paid</td>
                              <td align="right" style="color: #D4AF37; font-size: 20px; font-weight: 700;">$${data.totalAmount.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Confirmation Code -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #fef3c7; border-left: 4px solid #D4AF37; padding: 15px; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>Confirmation Code:</strong> ${data.appointmentId.slice(0, 8).toUpperCase()}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Actions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${data.receiptUrl}" style="display: inline-block; background-color: #D4AF37; color: #1a365d; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      View Receipt
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Reminder -->
              <p style="margin: 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                We'll send you a reminder 24 hours before your appointment.
              </p>

              <!-- What to Prepare -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; color: #1a365d; font-size: 16px; font-weight: 700;">What to Prepare:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                      <li>Valid government-issued photo ID</li>
                      <li>Original documents to be notarized</li>
                      <li>All parties must be present</li>
                      <li>Do not sign documents beforehand</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or call us.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} LA Mobile Notary. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'LA Mobile Notary <onboarding@resend.dev>',
      to: data.to,
      subject: `✅ Booking Confirmed - ${data.appointmentDate}`,
      html: emailHtml,
      replyTo: process.env.NOTARY_EMAIL || undefined,
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully:', emailData?.id);
    return { success: true, emailId: emailData?.id };
  } catch (error: any) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}

// Email reminder (send 24 hours before appointment)
export async function sendAppointmentReminder(data: {
  to: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  confirmationCode: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Reminder email disabled. Would send to:', data.to);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px 30px;">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="margin: 0; color: #1a365d; font-size: 24px;">
                <span style="color: #D4AF37;">LA</span> Mobile Notary
              </h1>
            </td>
          </tr>
          <tr>
            <td style="font-size: 48px; text-align: center; padding: 20px 0;">⏰</td>
          </tr>
          <tr>
            <td>
              <h2 style="margin: 0 0 20px; color: #1a365d; font-size: 22px; text-align: center;">Appointment Tomorrow!</h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hi ${data.name}, this is a friendly reminder that your mobile notary appointment is scheduled for tomorrow.
              </p>
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📅 Date: <strong style="color: #1f2937;">${data.appointmentDate}</strong></p>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">🕐 Time: <strong style="color: #1f2937;">${data.appointmentTime}</strong></p>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📍 Location: <strong style="color: #1f2937;">${data.address}</strong></p>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">🔑 Code: <strong style="color: #1f2937;">${data.confirmationCode}</strong></p>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
                See you tomorrow!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'LA Mobile Notary <onboarding@resend.dev>',
      to: data.to,
      subject: `⏰ Reminder: Appointment Tomorrow - ${data.appointmentDate}`,
      html: emailHtml,
      replyTo: process.env.NOTARY_EMAIL || undefined,
    });

    if (error) {
      console.error('❌ Reminder email error:', error);
      return { success: false, error };
    }

    console.log('✅ Reminder sent:', emailData?.id);
    return { success: true, emailId: emailData?.id };
  } catch (error: any) {
    console.error('❌ Reminder error:', error);
    return { success: false, error: error.message };
  }
}
