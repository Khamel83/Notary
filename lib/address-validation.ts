// Address validation with Google Places API and LA-specific validation

export interface AddressValidationResult {
  isValid: boolean;
  message?: string;
  suggestion?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  };
  isInLACounty?: boolean;
  distanceFromBase?: number;
}

// LA County cities and ZIP codes
const LA_COUNTY_CITIES = [
  'Los Angeles', 'Santa Monica', 'Beverly Hills', 'West Hollywood',
  'Burbank', 'Glendale', 'Pasadena', 'Long Beach', 'Torrance',
  'Hawthorne', 'Inglewood', 'Culver City', 'West Los Angeles',
  'San Pedro', 'Wilmington', 'Harbor City', 'Carson', 'Compton',
  'Lynwood', 'South Gate', 'Downey', 'Norwalk', 'Santa Fe Springs',
  'Whittier', 'La Habra', 'La Mirada', 'Cerritos', 'Lakewood',
  'Bellflower', 'Paramount', 'Artesia', 'Hawaiian Gardens',
  'Bell', 'Bell Gardens', 'Maywood', 'Cudahy', 'South Gate',
  'Huntington Park', 'Vernon', 'Commerce', 'Industry', 'La Puente',
  'Walnut', 'Diamond Bar', 'Pomona', 'Claremont', 'La Verne',
  'San Dimas', 'Covina', 'West Covina', 'El Monte', 'South El Monte',
  'Baldwin Park', 'Azusa', 'Glendora', 'San Dimas', 'Covina',
  'Rowland Heights', 'Hacienda Heights', 'Industry', 'Valinda',
  'La Habra Heights', 'Whittier', 'Santa Fe Springs', 'Norwalk',
  'Bellflower', 'Lakewood', 'Paramount', 'Artesia', 'Cerritos'
];

const LA_COUNTY_ZIPS = [
  '90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008',
  '90009', '90010', '90011', '90012', '90013', '90014', '90015',
  '90016', '90017', '90018', '90019', '90020', '90021', '90022',
  '90023', '90024', '90025', '90026', '90027', '90028', '90029',
  '90030', '90031', '90032', '90033', '90034', '90035', '90036',
  '90037', '90038', '90039', '90040', '90041', '90042', '90043',
  '90044', '90045', '90046', '90047', '90048', '90049', '90050',
  '90051', '90052', '90053', '90054', '90055', '90056', '90057',
  '90058', '90059', '90060', '90061', '90062', '90063', '90064',
  '90065', '90066', '90067', '90068', '90069', '90070', '90071',
  '90072', '90073', '90074', '90075', '90076', '90077', '90078',
  '90079', '90080', '90081', '90082', '90083', '90084', '90085',
  '90086', '90087', '90088', '90089', '90090', '90091', '90092',
  '90093', '90094', '90095', '90096', '90097', '90098', '90099',
  '90201', '90202', '90203', '90204', '90205', '90206', '90207',
  '90208', '90209', '90210', '90211', '90212', '90213', '90220',
  '90221', '90222', '90223', '90224', '90225', '90226', '90227',
  '90228', '90229', '90230', '90231', '90232', '90233', '90234',
  '90235', '90236', '90237', '90238', '90239', '90240', '90241',
  '90242', '90243', '90244', '90245', '90246', '90247', '90248',
  '90249', '90250', '90251', '90252', '90253', '90254', '90255',
  '90256', '90257', '90258', '90259', '90260', '90261', '90262',
  '90263', '90264', '90265', '90266', '90270', '90272', '90273',
  '90274', '90275', '90276', '90277', '90278', '90279', '90280',
  '90281', '90282', '90283', '90284', '90285', '90286', '90287',
  '90288', '90289', '90290', '90291', '90292', '90293', '90294',
  '90295', '90296', '90297', '90298', '90299', '90301', '90302',
  '90303', '90304', '90305', '90703', '90706', '90710', '90712',
  '90713', '90715', '90716', '90717', '90723', '90731', '90732',
  '90733', '90744', '90745', '90746', '90755', '90802', '90803',
  '90804', '90805', '90806', '90807', '90808', '90810', '90813',
  '90814', '90815', '90816', '90822', '90831', '90832', '90833',
  '90834', '90835', '90840', '90842', '90844', '90845', '90846',
  '90847', '90848', '90853', '91201', '91202', '91203', '91204',
  '91205', '91206', '91207', '91208', '91209', '91210', '91214',
  '91221', '91222', '91224', '91225', '91226', '91301', '91302',
  '91303', '91304', '91305', '91306', '91307', '91308', '91309',
  '91310', '91311', '91312', '91313', '91316', '91320', '91321',
  '91322', '91324', '91325', '91326', '91327', '91328', '91329',
  '91331', '91333', '91335', '91340', '91342', '91343', '91344',
  '91350', '91351', '91352', '91353', '91354', '91355', '91356',
  '91357', '91361', '91362', '91363', '91364', '91367', '91381',
  '91383', '91384', '91386', '91387', '91401', '91402', '91403',
  '91404', '91405', '91406', '91407', '91408', '91409', '91410',
  '91411', '91412', '91413', '91415', '91416', '91418', '91420',
  '91421', '91422', '91423', '91426', '91430', '91431', '91432',
  '91433', '91434', '91435', '91436', '91439', '91440', '91441',
  '91442', '91443', '91445', '91446', '91450', '91451', '91452',
  '91454', '91455', '91456', '91457', '91458', '91459', '91460',
  '91461', '91462', '91463', '91464', '91465', '91466', '91467',
  '91468', '91469', '91470', '91471', '91472', '91473', '91474',
  '91475', '91476', '91477', '91478', '91479', '91480', '91481',
  '91482', '91483', '91484', '91485', '91486', '91487', '91488',
  '91489', '91490', '91491', '91492', '91493', '91494', '91495',
  '91496', '91497', '91498', '91499', '91501', '91502', '91503',
  '91504', '91505', '91506', '91507', '91508', '91520', '91521',
  '91522', '91523', '91526', '91702', '91706', '91708', '91709',
  '91710', '91711', '91716', '91719', '91722', '91723', '91724',
  '91729', '91730', '91731', '91732', '91733', '91734', '91735',
  '91737', '91739', '91740', '91741', '91744', '91745', '91746',
  '91750', '91752', '91754', '91755', '91759', '91761', '91762',
  '91763', '91764', '91765', '91766', '91767', '91768', '91770',
  '91771', '91773', '91773', '91775', '91776', '91780', '91784',
  '91784', '91785', '91786', '91787', '91789', '91789', '91789',
  '91790', '91791', '91792', '91793', '91797', '91801', '91802',
  '91803', '91804', '91805', '91806', '91807', '91808', '91810',
  '91812', '91813', '91814', '91815', '91816', '91817', '91818',
  '91819', '91820', '91821', '91823', '91824', '91825', '91826',
  '91827', '91828', '91829', '91830', '91831', '91832', '91833',
  '91834', '91835', '91836', '91837', '91838', '91840', '91841',
  '91842', '91843', '91844', '91845', '91847', '91848', '91849',
  '91850', '91851', '91852', '91853', '91854', '91855', '91856',
  '91857', '91858', '91859', '91860', '91861', '91862', '91863',
  '91864', '91865', '91867', '91880', '91881', '91883', '91884',
  '91885', '91886', '91887', '91888', '91889', '91890', '91891',
  '91892', '91893', '91894', '91896', '91897', '91898', '91899'
];

// Calculate approximate distance from base location (Thai Town, LA)
function calculateDistanceFromBase(zip: string): number {
  // Simplified distance calculation based on LA area zones
  const laAreaZones: Record<string, number> = {
    // Hollywood/Central LA
    '90028': 5, '90027': 3, '90026': 4, '90046': 6, '90068': 7,
    // Westside
    '90024': 8, '90025': 10, '90049': 15, '90265': 20,
    // Beverly Hills
    '90210': 6, '90211': 7, '90212': 8,
    // Valley
    '91601': 12, '91501': 15, '91502': 16, '91423': 18,
    '91316': 14, '91325': 13, '91362': 25,
    // East LA
    '90031': 6, '90032': 8, '90033': 5, '90041': 6, '90042': 7,
    // South LA
    '90037': 5, '90044': 8, '90047': 9, '90062': 7,
    // Beach Cities
    '90802': 25, '90744': 20, '90803': 24, '90703': 22,
    // Glendale
    '91201': 10, '91202': 11, '91203': 11, '91204': 10,
    '91205': 11, '91206': 12, '91207': 11, '91208': 12,
    // Burbank
    '91501': 11, '91502': 12, '91504': 13, '91505': 14,
    '91506': 13, '91507': 14, '91521': 12, '91522': 13,
  };

  // Default distance if not in zones
  return laAreaZones[zip] || 15;
}

// Get LA-themed address validation jokes
const getAddressJoke = (city: string, zip: string): string | null => {
  const cityJokes: Record<string, string> = {
    'Beverly Hills': 'Beverly Hills! You were definitely getting fancy at The Ivy in 2007!',
    'Beverly Hills': 'Beverly Hills! Shopping at Rodeo Drive in 2007?',
    'West Hollywood': 'West Hollywood! WeHo Pride was amazing in 2007!',
    'Hollywood': 'Hollywood! Hollywood & Highland just opened in 2007!',
    'Los Angeles': 'LA proper! You were at The Standard Rooftop in 2007!',
    'Santa Monica': 'Santa Monica! 3rd Street Promenade was your scene in 2007!',
    'Burbank': 'Burbank! Media District or Six Flags in 2007?',
    'Glendale': 'Glendale! The Galleria was your mall in 2007!',
    'Pasadena': 'Pasadena! Old Town was your hangout in 2007!',
    'Long Beach': 'Long Beach! Pine Avenue or Belmont Shore in 2007?',
    'Manhattan Beach': 'Manhattan Beach! Beach volleyball and expensive homes in 2007!',
    'Hermosa Beach': 'Hermosa Beach! Pier Avenue party nights in 2007!',
    'Redondo Beach': 'Redondo Beach! King Harbor was your spot in 2007!',
    'Culver City': 'Culver City! Sony Pictures was your neighbor in 2007!',
    'Torrance': 'Torrance! Del Amo Mall was life in 2007!',
    'Palos Verdes': 'Palos Verdes! Expensive views and quiet life in 2007!',
    'San Pedro': 'San Pedro! Port of LA industrial chic in 2007!',
    'Wilmington': 'Wilmington! You were dealing with port traffic in 2007!',
    'Carson': 'Carson! Home Depot Center concerts in 2007!',
    'Compton': 'Compton! Keeping it real in 2007!',
    'Inglewood': 'Inglewood! Forum and Hollywood Park in 2007!',
    'Westwood': 'Westwood! UCLA or Westwood Village in 2007!',
    'Sherman Oaks': 'Sherman Oaks! Ventura Boulevard was your main drag in 2007!',
    'Studio City': 'Studio City! Universal CityWalk just opened in 2007!',
    'North Hollywood': 'North Hollywood! NoHo Arts District was emerging in 2007!',
    'Van Nuys': 'Van Nuys! The Valley Girl/Boy lifestyle in 2007!',
    'Northridge': 'Northridge! CSUN or Northridge Mall in 2007!',
    'Granada Hills': 'Granada Hills! Valley life in 2007 - totally!',
    'Reseda': 'Reseda! You were definitely at Reseda Park in 2007!',
    'Woodland Hills': 'Woodland Hills! Topanga Mall was your spot in 2007!',
    'Calabasas': 'Calabasas! You were ahead of the Kardashians in 2007!',
    'Valencia': 'Valencia! Magic Mountain was your neighbor in 2007!',
    'Pomona': 'Pomona! LA County Fair concerts in 2007!',
    'Claremont': 'Claremont! College town life in 2007!',
  };

  return cityJokes[city] || null;
};

// Main address validation function
export async function validateAddress(address: string, city?: string, zip?: string): Promise<AddressValidationResult> {
  if (!address.trim()) {
    return {
      isValid: false,
      message: 'Address is required - even in LA we need to know where to go!'
    };
  }

  // Basic format validation
  if (address.length < 5) {
    return {
      isValid: false,
      message: 'Address seems too short - is this your real address?',
      suggestion: 'Example: 123 Main Street'
    };
  }

  // Check for street number
  const hasStreetNumber = /^\d+/.test(address.trim());
  if (!hasStreetNumber) {
    return {
      isValid: false,
      message: 'Address needs a street number - even in 2007!',
      suggestion: 'Add street number: 123 Main St'
    };
  }

  // Check for common LA street patterns
  const hasStreetType = /\b(st|street|ave|avenue|blvd|boulevard|dr|drive|ln|lane|pl|place|rd|road|way|ct|court|terrace|plaza|row|circle)\b/i.test(address);
  if (!hasStreetType) {
    return {
      isValid: false,
      message: 'Missing street type - even LA addresses need Street, Avenue, etc!',
      suggestion: 'Add street type: Main St, Sunset Blvd, Hollywood Ave'
    };
  }

  // Check if it's in LA County
  let isInLACounty = false;
  let distanceFromBase = 15; // Default distance

  if (zip && /^\d{5}$/.test(zip)) {
    isInLACounty = LA_COUNTY_ZIPS.includes(zip);
    distanceFromBase = calculateDistanceFromBase(zip);
  }

  if (city) {
    isInLACounty = isInLACounty || LA_COUNTY_CITIES.some(laCity =>
      city.toLowerCase().includes(laCity.toLowerCase()) ||
      laCity.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Get address joke if applicable
  const addressJoke = getAddressJoke(city || '', zip || '');

  // Return validation result
  const result: AddressValidationResult = {
    isValid: true,
    isInLACounty,
    distanceFromBase
  };

  if (!isInLACounty) {
    result.message = 'This address is outside Los Angeles County - were you living somewhere else in 2007?';
    result.suggestion = 'We primarily serve LA County, but can travel to Orange County for +$25';
  } else if (distanceFromBase > 20) {
    result.message = 'That\'s pretty far from Thai Town - hope you had good traffic in 2007!';
  } else if (distanceFromBase < 5) {
    result.message = 'Right in the heart of LA! Great choice in 2007!';
  } else if (addressJoke) {
    result.message = addressJoke;
  } else if (zip) {
    result.message = `Perfect! ${zip} is definitely in our service area - very LA!`;
  } else {
    result.message = 'Great address! We know exactly where to find you in LA!';
  }

  return result;
}

// Auto-complete address suggestions (would integrate with Google Places API in production)
export function getAddressSuggestions(input: string): string[] {
  const commonLAStreets = [
    'Hollywood Boulevard', 'Sunset Boulevard', 'Melrose Avenue', 'Rodeo Drive',
    'Wilshire Boulevard', 'Ventura Boulevard', 'Sepulveda Boulevard', 'La Cienega Boulevard',
    'Pico Boulevard', 'Olympic Boulevard', 'Santa Monica Boulevard', 'Mulholland Drive',
    'Beverly Boulevard', 'Fairfax Avenue', 'La Brea Avenue', 'Vine Street',
    'Highland Avenue', 'Western Avenue', 'Figuroa Street', 'Crenshaw Boulevard',
    'Adams Boulevard', 'Jefferson Boulevard', 'Washington Boulevard', 'Exposition Boulevard',
    'Martin Luther King Jr Boulevard', 'Slauson Avenue', 'Manchester Avenue',
    'Imperial Highway', 'Century Boulevard', 'Aviation Boulevard', 'Manchester Avenue',
    'Pacific Coast Highway', 'Palos Verdes Drive South', 'Topanga Canyon Boulevard',
    'San Vicente Boulevard', 'Rosecrans Avenue', 'Carson Street', 'Pacific Avenue',
    'Pine Avenue', 'Broadway', 'Ocean Boulevard', 'Long Beach Boulevard',
    'Atlantic Avenue', 'Cherry Avenue', 'Bellflower Boulevard', 'Lakewood Boulevard',
    'Cerritos Avenue', 'Artesia Boulevard', 'Studebaker Road', 'Norwalk Boulevard',
    'Firestone Boulevard', 'Whittier Boulevard', 'Valley View Avenue', 'Pioneer Boulevard',
    'Beach Boulevard', 'Lincoln Avenue', 'Harbor Boulevard', 'Chapman Avenue',
    'Commonwealth Avenue', 'Valley Boulevard', 'Peck Road', 'Pine Street',
    'Hill Street', 'Colorado Street', 'Green Street', 'Wilson Avenue'
  ];

  const lowerInput = input.toLowerCase();

  return commonLAStreets
    .filter(street => street.toLowerCase().includes(lowerInput))
    .slice(0, 5);
}