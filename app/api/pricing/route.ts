import { NextRequest, NextResponse } from 'next/server';
import { calculatePricing, calculateDistance, BASE_LOCATION } from '@/lib/pricing';
import { z } from 'zod';

const PricingRequestSchema = z.object({
  numberOfSignatures: z.number().min(1).max(100),
  zip: z.string().min(5).max(10),
  lat: z.number().optional(),
  lng: z.number().optional(),
  appointmentDate: z.string(),
  urgency: z.enum(['standard', 'same-day', 'two-hour', 'emergency']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = PricingRequestSchema.parse(body);

    // Calculate distance
    let distanceInMiles = 10; // Default estimate
    if (validated.lat && validated.lng) {
      distanceInMiles = calculateDistance(
        BASE_LOCATION.lat,
        BASE_LOCATION.lng,
        validated.lat,
        validated.lng
      );
    }

    const appointmentDate = new Date(validated.appointmentDate);

    const pricing = calculatePricing({
      numberOfSignatures: validated.numberOfSignatures,
      distanceInMiles,
      appointmentDate,
      urgency: validated.urgency,
    });

    return NextResponse.json({
      success: true,
      pricing,
      distanceInMiles,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
