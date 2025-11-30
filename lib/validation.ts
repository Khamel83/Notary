import React from 'react';

// Real-time validation utilities

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  suggestion?: string;
}

// LA-themed ZIP code history lookup - what was it like in 2007
const getZipCodeJoke = (zip: string): string | null => {
  const zipJokes: Record<string, string> = {
    // Hollywood & Central LA
    '90028': 'Hollywood! Were you clubbing at Les Deux in 2007?',
    '90027': 'Los Feliz! You were drinking at The Derby before it was cool in 2007!',
    '90026': 'Silver Lake! You were definitely at Spaceland in 2007!',
    '90036': 'Mid-Wilshire! Running to The Grove like everyone else in 2007!',
    '90048': 'Mid-City! You were stuck in traffic on Olympic in 2007!',
    '90019': 'Mid-Wilshire! The Grove was your mall in 2007!',
    '90020': 'Downtown! Night out at The Standard Rooftop in 2007?',

    // West Side
    '90024': 'Westwood! UCLA student or Brat Pack fan in 2007?',
    '90025': 'Santa Monica! 3rd Street Promenade was your scene in 2007!',
    '90049': 'Pacific Palisades! PCH traffic in 2007, brutal!',
    '90265': 'Malibu! Paradise Cove in 2007 - very exclusive!',
    '90272': 'Palos Verdes! Beautiful views and zero fun in 2007!',

    // Beverly Hills & surrounding
    '90210': 'Beverly Hills! Shopping at Rodeo Drive in 2007?',
    '90211': 'Beverly Hills! Partying at Greystone Manor in 2007?',
    '90212': 'Beverly Hills! Probably saw celebs at The Ivy in 2007?',

    // The Valley
    '91423': 'Calabasas! You were ahead of the Kardashians in 2007!',
    '91316': 'Granada Hills! Valley Girl/Boy in 2007 - totally!',
    '91325': 'Northridge! Were you at CSUN in 2007?',
    '91326': 'Porter Ranch! The outskirts even in 2007!',
    '91362': 'Valencia! Magic Mountain was your neighbor in 2007!',
    '91355': 'Saugus! Also Six Flags, but further out in 2007!',

    // Eastside & Northeast LA
    '90065': 'Highland Park! York Blvd before it was gentrified in 2007!',
    '90041': 'Eagle Rock! The Eagles were your high school in 2007!',
    '90042': 'Highland Park! You were at Figueroa before Gold Line in 2007!',
    '90031': 'Lincoln Heights! Chinatown New Year in 2007?',
    '90032': 'El Sereno! Seriously out there in 2007!',
    '90033': 'Boyle Heights! Mariachi Plaza in 2007!',
    '90063': 'East LA! Whittier Blvd was life in 2007!',

    // South LA
    '90037': 'Exposition Park! Natural History Museum in 2007?',
    '90044': 'Watts! Jordan Downs in 2007 - keeping it real!',
    '90047': 'Willowbrook! Crystal Spencer should ring a bell in 2007!',
    '90043': 'Leimert Park! The World Stage in 2007!',
    '90062': 'Vermont Square! Crenshaw District in 2007!',

    // Beach Cities
    '90744': 'Wilmington! Port of LA industrial chic in 2007!',
    '90802': 'Long Beach! Pine Avenue or Belmont Shore in 2007?',
    '90804': 'Long Beach! Retro Row vintage shopping in 2007!',
    '90703': 'Cerritos! Mall of all malls in 2007!',
    '90805': 'Long Beach! Cambodia Town in 2007!',

    // Hollywood Hills
    '90046': 'Los Angeles! Franklin Village in 2007!',
    '90068': 'Hollywood! Lake Hollywood Park in 2007!',
    '90038': 'Hollywood! Thai Town was your spot in 2007!',

    // West Hollywood
    '90048': 'West Hollywood! Sunset Strip every weekend in 2007!',
    '90069': 'West Hollywood! WeHo Pride was amazing in 2007!',
    '90046': 'West Hollywood! Melrose Avenue shopping in 2007!',

    // Burbank & Glendale
    '91501': 'Burbank! Media District in 2007 - NBC Universal?',
    '91502': 'Burbank! Burbank Mall was your spot in 2007!',
    '91504': 'Burbank! Airport area - planes 24/7 in 2007!',
    '91201': 'Glendale! Americana at Brand opened just after 2007!',
    '91202': 'Glendale! Galleria was your mall in 2007!',
    '91203': 'Glendale! The Brand Blvd life in 2007!',
    '91204': 'Glendale! Montrose Shopping Park in 2007!',
    '91205': 'Glendale! Atwater Village border in 2007!',
    '91206': 'Glendale! Verdugo Views in 2007!',
    '91207': 'Glendale! Oakmont Views in 2007!',
    '91208': 'Glendale! Mountain View in 2007!',
    '91210': 'Glendale! Scholl Canyon in 2007!',
    '91214': 'Glendale! Adams Hill in 2007!',
    '91221': 'Glendale! Mountain View in 2007!',
    '91222': 'Glendale! Sparr Heights in 2007!',
    '91224': 'Glendale! Pelanconi Estates in 2007!',
    '91225': 'Glendale! Oakmont in 2007!',
    '91226': 'Glendale! Somewhere in Glendale in 2007!',
  };

  return zipJokes[zip] || null;
};

// Email validation with LA-themed real-time feedback
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required - even in LA we need to reach you!' };
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'LA emails need proper formatting, dude',
      suggestion: 'Example: movie@star.com'
    };
  }

  const domain = email.split('@')[1]?.toLowerCase();

  // Domain-based personality
  if (domain) {
    // Gmail users - most common
    if (domain === 'gmail.com') {
      return {
        isValid: true,
        message: 'Classic Gmail! You and half of LA, but it works!'
      };
    }

    // Yahoo users - old school
    if (domain === 'yahoo.com') {
      return {
        isValid: true,
        message: 'Yahoo! Still rocking it! You\'re consistent like LA traffic'
      };
    }

    // Hotmail users - vintage
    if (domain === 'hotmail.com' || domain === 'msn.com') {
      return {
        isValid: true,
        message: 'Hotmail! You\'ve been digital since dial-up! LA OG!'
      };
    }

    // AOL users - retro cool
    if (domain === 'aol.com') {
      return {
        isValid: true,
        message: 'AOL! "You\'ve got mail!" - straight out of 2007, we love it!'
      };
    }

    // Outlook users - business folks
    if (domain === 'outlook.com') {
      return {
        isValid: true,
        message: 'Outlook! You\'re all business - probably closing deals in Century City!'
      };
    }

    // .edu domains - students or overpaid administrators
    if (domain.endsWith('.edu')) {
      return {
        isValid: true,
        message: '.edu! Student or overpaid administrator? UCLA, USC, or Cal State?'
      };
    }

    // .gov domains - serious business
    if (domain.endsWith('.gov')) {
      return {
        isValid: true,
        message: '.gov! Working for the city? LA County needs notaries!'
      };
    }

    // .org domains - non-profit heroes
    if (domain.endsWith('.org')) {
      return {
        isValid: true,
        message: '.org! Making LA better one document at a time!'
      };
    }

    // Non .com domains - fancy people
    if (!domain.endsWith('.com')) {
      const tld = domain.split('.').pop();
      return {
        isValid: true,
        message: `${tld?.toUpperCase()}! Fancy! You\'re too cool for .com - very LA!`
      };
    }

    // Custom domain owners - classy folks
    if (domain !== 'gmail.com' &&
        domain !== 'yahoo.com' &&
        domain !== 'hotmail.com' &&
        domain !== 'outlook.com' &&
        domain !== 'aol.com' &&
        domain !== 'icloud.com') {
      return {
        isValid: true,
        message: 'Custom domain! You\'re classy like Beverly Hills! Nice!'
      };
    }
  }

  // More comprehensive checks
  const localPart = email.split('@')[0];
  const fullDomain = email.split('@')[1];

  // Local part validation
  if (localPart.length < 1) {
    return { isValid: false, message: 'Email must have characters before @' };
  }

  if (localPart.length > 64) {
    return { isValid: false, message: 'Email part before @ is too long' };
  }

  // Domain validation
  if (fullDomain && fullDomain.length < 4) {
    return { isValid: false, message: 'Domain seems too short' };
  }

  if (fullDomain && !fullDomain.includes('.')) {
    return { isValid: false, message: 'Domain must include a dot (.)' };
  }

  return { isValid: true };
}

// Phone validation with real-time feedback
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Length validation
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      message: 'Phone number must have at least 10 digits',
      suggestion: 'Include area code: (555) 123-4567'
    };
  }

  if (digitsOnly.length > 11) {
    return { isValid: false, message: 'Phone number has too many digits' };
  }

  // US phone number validation
  if (digitsOnly.length === 11) {
    if (!digitsOnly.startsWith('1')) {
      return {
        isValid: false,
        message: 'US phone numbers should start with 1 or use 10 digits',
        suggestion: 'Remove country code or use format: (555) 123-4567'
      };
    }
  }

  // Check for obviously invalid numbers
  if (digitsOnly.length === 10) {
    const areaCode = digitsOnly.substring(0, 3);
    const exchange = digitsOnly.substring(3, 6);

    // Invalid area codes (not exhaustive, but catches common issues)
    const invalidAreaCodes = ['000', '555'];
    if (invalidAreaCodes.includes(areaCode)) {
      return { isValid: false, message: 'Invalid area code' };
    }

    // Invalid exchange codes
    const invalidExchanges = ['000', '555'];
    if (invalidExchanges.includes(exchange)) {
      return { isValid: false, message: 'Invalid phone number prefix' };
    }

    // All same digits
    if (/^(\d)\1{9}$/.test(digitsOnly)) {
      return { isValid: false, message: 'Phone number cannot be all same digit' };
    }
  }

  return { isValid: true };
}

// ZIP code validation with 2007 jokes
export function validateZip(zip: string): ValidationResult {
  if (!zip.trim()) {
    return { isValid: false, message: 'ZIP code is required - even in 2007 we needed it!' };
  }

  const digitsOnly = zip.replace(/\D/g, '');

  if (digitsOnly.length !== 5) {
    return {
      isValid: false,
      message: 'ZIP code must be 5 digits',
      suggestion: 'Example: 90027 - your 2007 ZIP!'
    };
  }

  // Basic validation for common invalid ZIP patterns
  if (/^00000$/.test(digitsOnly)) {
    return { isValid: false, message: 'Invalid ZIP code - even in 2007 this wouldn\'t work!' };
  }

  // 2007-themed ZIP code jokes
  const zipJoke = getZipCodeJoke(digitsOnly);
  if (zipJoke) {
    return {
      isValid: true,
      message: zipJoke
    };
  }

  // Check if it's in California (optional, for LA-based service)
  const caZipPrefixes = ['9', '90', '91', '92', '93', '94', '95', '96'];
  const firstTwoDigits = digitsOnly.substring(0, 2);

  if (!caZipPrefixes.some(prefix => digitsOnly.startsWith(prefix))) {
    return {
      isValid: true, // Still valid, but maybe warn
      message: 'This ZIP code is outside California - were you living somewhere else in 2007?',
      suggestion: 'We primarily serve Los Angeles County'
    };
  }

  return { isValid: true };
}

// Create personality profile based on user info
export function createPersonalityProfile(email?: string, zip?: string, phone?: string): {
  level: 'basic' | 'enhanced' | 'premium';
  jokes: string[];
  score: number;
  description: string;
} {
  const jokes: string[] = [];
  let score = 0;
  let level: 'basic' | 'enhanced' | 'premium' = 'basic';

  // Email domain analysis
  if (email) {
    const domain = email.split('@')[1]?.toLowerCase();

    if (domain === 'gmail.com') {
      jokes.push('Gmail user - you and half of LA, but it works!');
      score += 1;
    } else if (domain === 'yahoo.com') {
      jokes.push('Yahoo! You\'ve been consistent since 2007!');
      score += 2;
    } else if (domain === 'hotmail.com') {
      jokes.push('Hotmail OG! You\'ve been digital since dial-up!');
      score += 3;
    } else if (domain === 'aol.com') {
      jokes.push('AOL! "You\'ve got mail!" - straight out of 2007, we love it!');
      score += 4;
    } else if (domain.endsWith('.edu')) {
      jokes.push('.edu! Student or overpaid administrator?');
      score += 3;
    } else if (domain.endsWith('.gov')) {
      jokes.push('.gov! Working for the city? LA County needs notaries!');
      score += 2;
    } else if (domain.endsWith('.org')) {
      jokes.push('.org! Making LA better one document at a time!');
      score += 3;
    } else if (domain && !domain.endsWith('.com') && !['gmail', 'yahoo', 'hotmail', 'outlook', 'aol'].some(d => domain.includes(d))) {
      jokes.push(`${domain.split('.').pop()?.toUpperCase()}! Fancy! You\'re too cool for .com!`);
      score += 4;
    } else if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'].includes(domain)) {
      jokes.push('Custom domain! You\'re classy like Beverly Hills!');
      score += 5;
    }
  }

  // ZIP code analysis
  if (zip && /^\d{5}$/.test(zip)) {
    const zipJoke = getZipCodeJoke(zip);
    if (zipJoke) {
      jokes.push(zipJoke);
      score += 3;
    }
  }

  // Phone area code analysis
  if (phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    const areaCode = digitsOnly.substring(0, 3);

    const areaCodeJokes: Record<string, string> = {
      '310': '310! Westside in 2007 - Venice Beach calls!',
      '323': '323! Central LA in 2007 - Echo Park hipster!',
      '213': '213! Downtown LA in 2007 - Skid Row gentrification starting!',
      '818': '818! Valley in 2007 - Sherman Oaks was happening!',
      '747': '747! The new overlay - you\'re future-proof!',
      '424': '424! Even newer - cutting edge LA numbers!',
      '661': '661! Santa Clarita in 2007 - Magic Mountain neighbor!',
      '805': '805! Central Coast in 2007 - SLO life!',
      '562': '562! Long Beach in 2007 - Queen Mary and PCH!',
      '626': '626! San Gabriel Valley in 2007 - 626 pride!',
      '909': '909! Inland Empire in 2007 - Ontario Mills outlet runs!',
      '714': '714! Orange County in 2007 - Disneyland Local 8 days a week!',
      '949': '949! South OC in 2007 - Newport Beach life!',
      '951': '951! Riverside in 2007 - IE was place to be!',
      '619': '619! San Diego in 2007 - SoCal border life!'
    };

    if (areaCodeJokes[areaCode]) {
      jokes.push(areaCodeJokes[areaCode]);
      score += 2;
    }
  }

  // Determine level based on score
  if (score >= 8) {
    level = 'premium';
  } else if (score >= 4) {
    level = 'enhanced';
  }

  // Generate description
  let description = '';
  if (level === 'premium') {
    description = 'Wow! You\'re maximum LA - you\'ve got the email, ZIP, and area code! Total authenticity!';
  } else if (level === 'enhanced') {
    description = 'Nice! You\'re showing some serious LA credibility - we see you!';
  } else {
    description = 'Getting there! Add more LA flavor to your profile!';
  }

  return {
    level,
    jokes,
    score,
    description
  };
}

// Real-time validation hook for React
export function useRealTimeValidation<T>(
  value: T,
  validator: (value: T) => ValidationResult,
  debounceMs: number = 300
): ValidationResult {
  const [result, setResult] = React.useState<ValidationResult>({ isValid: true });
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const validationResult = validator(value);
      setResult(validationResult);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, validator, debounceMs]);

  return result;
}