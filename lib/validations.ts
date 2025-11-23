import { z } from 'zod';

// Booking form validation
export const bookingSchema = z.object({
  // Service Details
  numberOfSignatures: z
    .number()
    .min(1, 'At least 1 signature required')
    .max(50, 'Maximum 50 signatures allowed'),

  // Location
  address: z
    .string()
    .min(5, 'Please enter a valid address')
    .max(200, 'Address too long'),

  city: z
    .string()
    .min(2, 'Please enter a city')
    .max(100, 'City name too long'),

  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 90027)'),

  // Date & Time
  appointmentDate: z
    .string()
    .min(1, 'Please select a date'),

  appointmentTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time'),

  // Service Options
  urgency: z.enum(['standard', 'same-day', 'two-hour', 'emergency'], {
    errorMap: () => ({ message: 'Please select a service speed' }),
  }),

  // Contact Information
  fullName: z
    .string()
    .min(2, 'Please enter your full name')
    .max(100, 'Name too long')
    .optional(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),

  phone: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please enter a valid phone number')
    .optional(),

  // Optional
  specialInstructions: z
    .string()
    .max(500, 'Instructions too long (max 500 characters)')
    .optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// Contact form validation
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),

  email: z
    .string()
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please enter a valid phone number')
    .optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message too long (max 1000 characters)'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Payment validation
export const paymentSchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be at least $1')
    .max(10000, 'Amount exceeds maximum'),

  paymentMethod: z.enum(['card', 'afterpay_clearpay'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),

  appointmentDetails: z.object({
    date: z.string(),
    address: z.string(),
    numberOfSignatures: z.number(),
  }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Validation helper function
export function validateField<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => e.message),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}
