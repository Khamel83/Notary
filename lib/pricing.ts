import { addDays, isWeekend, format, parse, isAfter, isBefore } from 'date-fns';

export interface PricingConfig {
  // Base fees
  baseNotaryFee: number;
  baseTravelFee: number;

  // Distance-based
  freeDistanceMiles: number;
  perMileFee: number;
  maxDistanceMiles: number;

  // Time-based surcharges
  afterHoursSurcharge: number;
  weekendSurcharge: number;
  holidaySurcharge: number;

  // Urgency surcharges
  sameDaySurcharge: number;
  twoHourSurcharge: number;
  emergencySurcharge: number;
}

export const DEFAULT_PRICING: PricingConfig = {
  baseNotaryFee: 15.00,
  baseTravelFee: 75.00,
  freeDistanceMiles: 10.00,
  perMileFee: 0.50,
  maxDistanceMiles: 50.00,
  afterHoursSurcharge: 50.00,
  weekendSurcharge: 25.00,
  holidaySurcharge: 100.00,
  sameDaySurcharge: 50.00,
  twoHourSurcharge: 100.00,
  emergencySurcharge: 150.00,
};

export interface PricingInput {
  numberOfSignatures: number;
  distanceInMiles: number;
  appointmentDate: Date;
  urgency: 'standard' | 'same-day' | 'two-hour' | 'emergency';
}

export interface PricingBreakdown {
  baseFee: number;
  travelFee: number;
  distanceSurcharge: number;
  afterHoursSurcharge: number;
  weekendSurcharge: number;
  holidaySurcharge: number;
  urgencySurcharge: number;
  subtotal: number;
  total: number;
  breakdown: string[];
}

const HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK Day
  '2025-02-17', // Presidents Day
  '2025-05-26', // Memorial Day
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas
];

function isHoliday(date: Date): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  return HOLIDAYS_2025.includes(dateStr);
}

function isAfterHours(date: Date): boolean {
  const hour = date.getHours();
  return hour < 9 || hour >= 18; // Before 9 AM or after 6 PM
}

export function calculatePricing(
  input: PricingInput,
  config: PricingConfig = DEFAULT_PRICING
): PricingBreakdown {
  const breakdown: string[] = [];

  // Base notary fee (per signature)
  const baseFee = config.baseNotaryFee * input.numberOfSignatures;
  breakdown.push(`Base fee: ${input.numberOfSignatures} signature${input.numberOfSignatures > 1 ? 's' : ''} × $${config.baseNotaryFee} = $${baseFee.toFixed(2)}`);

  // Travel fee
  const travelFee = config.baseTravelFee;
  breakdown.push(`Travel fee: $${travelFee.toFixed(2)}`);

  // Distance surcharge
  let distanceSurcharge = 0;
  if (input.distanceInMiles > config.freeDistanceMiles) {
    const extraMiles = Math.min(
      input.distanceInMiles - config.freeDistanceMiles,
      config.maxDistanceMiles - config.freeDistanceMiles
    );
    distanceSurcharge = extraMiles * config.perMileFee;
    breakdown.push(`Distance surcharge: ${extraMiles.toFixed(1)} extra miles × $${config.perMileFee} = $${distanceSurcharge.toFixed(2)}`);
  }

  // Time-based surcharges
  let afterHoursSurcharge = 0;
  if (isAfterHours(input.appointmentDate)) {
    afterHoursSurcharge = config.afterHoursSurcharge;
    breakdown.push(`After-hours surcharge: $${afterHoursSurcharge.toFixed(2)}`);
  }

  let weekendSurcharge = 0;
  if (isWeekend(input.appointmentDate)) {
    weekendSurcharge = config.weekendSurcharge;
    breakdown.push(`Weekend surcharge: $${weekendSurcharge.toFixed(2)}`);
  }

  let holidaySurcharge = 0;
  if (isHoliday(input.appointmentDate)) {
    holidaySurcharge = config.holidaySurcharge;
    breakdown.push(`Holiday surcharge: $${holidaySurcharge.toFixed(2)}`);
  }

  // Urgency surcharge
  let urgencySurcharge = 0;
  switch (input.urgency) {
    case 'same-day':
      urgencySurcharge = config.sameDaySurcharge;
      breakdown.push(`Same-day service: $${urgencySurcharge.toFixed(2)}`);
      break;
    case 'two-hour':
      urgencySurcharge = config.twoHourSurcharge;
      breakdown.push(`Rush service (within 2 hours): $${urgencySurcharge.toFixed(2)}`);
      break;
    case 'emergency':
      urgencySurcharge = config.emergencySurcharge;
      breakdown.push(`Emergency service: $${urgencySurcharge.toFixed(2)}`);
      break;
  }

  const subtotal = baseFee + travelFee + distanceSurcharge;
  const totalSurcharges = afterHoursSurcharge + weekendSurcharge + holidaySurcharge + urgencySurcharge;
  const total = subtotal + totalSurcharges;

  return {
    baseFee,
    travelFee,
    distanceSurcharge,
    afterHoursSurcharge,
    weekendSurcharge,
    holidaySurcharge,
    urgencySurcharge,
    subtotal,
    total,
    breakdown,
  };
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Thai Town base location
export const BASE_LOCATION = {
  lat: 34.0978,
  lng: -118.2930,
  zip: '90027',
  name: 'Thai Town, Los Angeles',
};
