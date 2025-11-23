import twilio from 'twilio';

// Initialize Twilio client (only if credentials are provided)
let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
}

interface BookingConfirmationSMS {
  to: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  confirmationCode: string;
}

export async function sendBookingConfirmationSMS(data: BookingConfirmationSMS) {
  const client = getTwilioClient();

  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('📱 SMS disabled (no Twilio config). Would send to:', data.to);
    console.log(`Message: Booking confirmed for ${data.appointmentDate} at ${data.appointmentTime}. Code: ${data.confirmationCode}`);
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    // Format phone number (ensure +1 prefix for US numbers)
    let toNumber = data.to.replace(/[^\d+]/g, ''); // Remove non-digits except +
    if (!toNumber.startsWith('+')) {
      toNumber = '+1' + toNumber;
    }

    const message = await client.messages.create({
      body: `LA Mobile Notary: Booking confirmed! ${data.appointmentDate} at ${data.appointmentTime}. Confirmation: ${data.confirmationCode}. Bring valid ID. Reply HELP for info.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    });

    console.log('✅ SMS sent successfully:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('❌ SMS error:', error);
    return { success: false, error: error.message };
  }
}

// SMS reminder (send 24 hours before appointment)
export async function sendAppointmentReminderSMS(data: {
  to: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  confirmationCode: string;
}) {
  const client = getTwilioClient();

  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('📱 SMS reminder disabled. Would send to:', data.to);
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    let toNumber = data.to.replace(/[^\d+]/g, '');
    if (!toNumber.startsWith('+')) {
      toNumber = '+1' + toNumber;
    }

    const message = await client.messages.create({
      body: `LA Mobile Notary REMINDER: Appointment tomorrow ${data.appointmentTime} at ${data.address}. Bring valid ID. Code: ${data.confirmationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    });

    console.log('✅ SMS reminder sent:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('❌ SMS reminder error:', error);
    return { success: false, error: error.message };
  }
}

// Helper to validate phone number format
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Should be 10 digits (US) or 11 with country code
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}
