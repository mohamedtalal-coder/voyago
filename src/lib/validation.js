// Form validation utilities

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (trimmedEmail.length < 5) {
    return { isValid: false, error: 'Email is too short' };
  }
  
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  // Must contain exactly one @
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { isValid: false, error: 'Email must contain exactly one @ symbol' };
  }

  const [localPart, domain] = trimmedEmail.split('@');

  // Validate local part (before @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Email username is required before @' };
  }

  if (localPart.length > 64) {
    return { isValid: false, error: 'Email username is too long' };
  }

  // Local part cannot start or end with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email cannot start or end with a dot' };
  }

  // No consecutive dots in local part
  if (localPart.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots' };
  }

  // Validate domain (after @)
  if (!domain || domain.length === 0) {
    return { isValid: false, error: 'Email domain is required after @' };
  }

  if (domain.length < 3) {
    return { isValid: false, error: 'Email domain is too short' };
  }

  // Domain must contain at least one dot
  if (!domain.includes('.')) {
    return { isValid: false, error: 'Email domain must include a dot (e.g., .com)' };
  }

  // Domain cannot start or end with a dot or hyphen
  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, error: 'Invalid email domain format' };
  }

  // Get TLD (last part after dot)
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { isValid: false, error: 'Email must have a valid domain extension (e.g., .com, .org)' };
  }

  // TLD must be letters only
  if (!/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'Email domain extension must contain only letters' };
  }
  
  // Comprehensive email regex validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for invalid characters in local part
  const validLocalChars = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!validLocalChars.test(localPart)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  // Check for spaces
  if (trimmedEmail.includes(' ')) {
    return { isValid: false, error: 'Email cannot contain spaces' };
  }
  
  // Check for common typos in domains
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.vom': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'outlook.con': 'outlook.com',
  };
  
  if (commonTypos[domain]) {
    return { 
      isValid: false, 
      error: `Did you mean ${localPart}@${commonTypos[domain]}?` 
    };
  }

  // Check for disposable/temporary email domains
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
    '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'tempail.com', 'dispostable.com', 'maildrop.cc', 'yopmail.com'
  ];
  
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Please use a permanent email address' };
  }
  
  return { isValid: true, error: null };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true,
  } = options;

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required', strength: 0 };
  }

  const errors = [];
  let strength = 0;

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  } else {
    strength += 1;
  }

  if (password.length > maxLength) {
    errors.push(`Password must be less than ${maxLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    strength += 1;
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    strength += 1;
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    strength += 1;
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  } else if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password)) {
    strength += 1;
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 'letmein',
    'welcome', 'admin123', 'abc12345', 'password1', '123456789'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger one');
    strength = 0;
  }

  // Additional length bonus
  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;

  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
    errors,
    strength: Math.min(strength, 5), // 0-5 scale
  };
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (trimmedName.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }

  // Check for suspicious patterns
  if (/(.)\1{3,}/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid repeated characters` };
  }

  return { isValid: true, error: null };
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();
  
  if (trimmedPhone.length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all formatting characters for validation
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  
  if (digitsOnly.length === 0) {
    return { isValid: false, error: 'Phone number must contain digits' };
  }

  // Check minimum length (at least 7 digits for a valid phone)
  if (digitsOnly.length < 7) {
    return { isValid: false, error: 'Phone number must be at least 7 digits' };
  }

  // Check maximum length (ITU-T E.164 max is 15 digits)
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number cannot exceed 15 digits' };
  }

  // Check for invalid repeated digits (e.g., 0000000000, 1111111111)
  if (/^(\d)\1{6,}$/.test(digitsOnly)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  // Check for sequential digits (e.g., 1234567890)
  const sequential = '01234567890123456789';
  const reverseSequential = '98765432109876543210';
  if (sequential.includes(digitsOnly) || reverseSequential.includes(digitsOnly)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  // Check for obviously fake numbers
  const fakePatterns = [
    /^0{7,}$/,           // All zeros
    /^1{7,}$/,           // All ones  
    /^123456/,           // Starts with 123456
    /^111111/,           // Starts with 111111
    /^000000/,           // Starts with 000000
  ];
  
  for (const pattern of fakePatterns) {
    if (pattern.test(digitsOnly)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
  }

  // Validate format - allow common phone formats
  // International: +1 234 567 8900, +44 20 7123 4567
  // US/Canada: (555) 123-4567, 555-123-4567, 555.123.4567
  // Simple: 5551234567
  const validFormats = [
    /^\+?\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/, // International
    /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, // US format
    /^\d{7,15}$/, // Simple digits only
    /^\+\d{7,15}$/, // + followed by digits
  ];

  const isValidFormat = validFormats.some(regex => regex.test(trimmedPhone.replace(/\s+/g, ' ')));
  
  if (!isValidFormat) {
    // More lenient check - just ensure it has right number of digits and allowed chars
    const allowedChars = /^[\d\s\-().+]+$/;
    if (!allowedChars.test(trimmedPhone)) {
      return { isValid: false, error: 'Phone number contains invalid characters' };
    }
  }

  // Format the phone number for storage
  let formatted = digitsOnly;
  if (trimmedPhone.startsWith('+')) {
    formatted = '+' + digitsOnly;
  }

  return { isValid: true, error: null, formatted, digits: digitsOnly.length };
};

// Credit card validation
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return { isValid: false, error: 'Card number is required', cardType: null };
  }

  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');

  if (cleanNumber.length === 0) {
    return { isValid: false, error: 'Card number is required', cardType: null };
  }

  if (cleanNumber.length < 13) {
    return { isValid: false, error: 'Card number is too short', cardType: null };
  }

  if (cleanNumber.length > 19) {
    return { isValid: false, error: 'Card number is too long', cardType: null };
  }

  // Detect card type
  const cardType = detectCardType(cleanNumber);

  // Luhn algorithm validation
  if (!luhnCheck(cleanNumber)) {
    return { isValid: false, error: 'Invalid card number', cardType };
  }

  return { isValid: true, error: null, cardType, formatted: formatCardNumber(cleanNumber) };
};

// Luhn algorithm for card validation
const luhnCheck = (cardNumber) => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Detect card type from number
const detectCardType = (cardNumber) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]|^2[2-7]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35)/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }
  
  return 'unknown';
};

const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

// Expiry date validation
export const validateExpiryDate = (expiry) => {
  if (!expiry || typeof expiry !== 'string') {
    return { isValid: false, error: 'Expiry date is required' };
  }

  // Clean and parse
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length < 3 || cleaned.length > 4) {
    return { isValid: false, error: 'Enter expiry as MM/YY' };
  }

  let month, year;
  
  if (cleaned.length === 3) {
    month = parseInt(cleaned.substring(0, 1), 10);
    year = parseInt(cleaned.substring(1), 10);
  } else {
    month = parseInt(cleaned.substring(0, 2), 10);
    year = parseInt(cleaned.substring(2), 10);
  }

  // Validate month
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month (01-12)' };
  }

  // Convert 2-digit year to 4-digit
  const currentYear = new Date().getFullYear();
  const fullYear = year + (year < 100 ? 2000 : 0);
  const currentMonth = new Date().getMonth() + 1;

  // Check if expired
  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Card has expired' };
  }

  // Check if too far in the future (10 years max)
  if (fullYear > currentYear + 10) {
    return { isValid: false, error: 'Invalid expiry year' };
  }

  return { 
    isValid: true, 
    error: null, 
    formatted: `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}` 
  };
};

// CVV validation
export const validateCVV = (cvv, cardType = 'unknown') => {
  if (!cvv || typeof cvv !== 'string') {
    return { isValid: false, error: 'CVV is required' };
  }

  const cleaned = cvv.replace(/\D/g, '');

  if (cleaned.length === 0) {
    return { isValid: false, error: 'CVV is required' };
  }

  // AMEX uses 4-digit CVV, others use 3-digit
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  if (cleaned.length < 3) {
    return { isValid: false, error: 'CVV is too short' };
  }

  if (cleaned.length > 4) {
    return { isValid: false, error: 'CVV is too long' };
  }

  if (cardType !== 'unknown' && cleaned.length !== expectedLength) {
    return { isValid: false, error: `CVV should be ${expectedLength} digits for this card` };
  }

  return { isValid: true, error: null };
};

// Card holder name validation
export const validateCardHolderName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Card holder name is required' };
  }

  const trimmedName = name.trim().toUpperCase();

  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Card holder name is required' };
  }

  if (trimmedName.length < 3) {
    return { isValid: false, error: 'Card holder name is too short' };
  }

  if (trimmedName.length > 26) {
    return { isValid: false, error: 'Card holder name is too long (max 26 characters)' };
  }

  // Only allow letters, spaces, hyphens, and periods
  const nameRegex = /^[A-Z\s\-.']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Card holder name contains invalid characters' };
  }

  // Must have at least two words (first and last name)
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    return { isValid: false, error: 'Please enter first and last name' };
  }

  return { isValid: true, error: null };
};

export const validateTravelerForm = (formData) => {
  const errors = {};

  const nameResult = validateName(formData.name, 'First name');
  if (!nameResult.isValid) errors.name = nameResult.error;

  const surnameResult = validateName(formData.surname, 'Last name');
  if (!surnameResult.isValid) errors.surname = surnameResult.error;

  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.error;

  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) errors.email = emailResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate entire payment form
export const validatePaymentForm = (formData) => {
  const errors = {};

  const cardResult = validateCardNumber(formData.cardNumber);
  if (!cardResult.isValid) errors.cardNumber = cardResult.error;

  const holderResult = validateCardHolderName(formData.cardHolder);
  if (!holderResult.isValid) errors.cardHolder = holderResult.error;

  const expiryResult = validateExpiryDate(formData.expiryDate);
  if (!expiryResult.isValid) errors.expiryDate = expiryResult.error;

  const cvvResult = validateCVV(formData.cvv, cardResult.cardType);
  if (!cvvResult.isValid) errors.cvv = cvvResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cardType: cardResult.cardType,
  };
};

// Validate login form
export const validateLoginForm = (email, password) => {
  const errors = {};

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) errors.email = emailResult.error;

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate registration form
export const validateRegisterForm = (name, email, password) => {
  const errors = {};

  const nameResult = validateName(name, 'Name');
  if (!nameResult.isValid) errors.name = nameResult.error;

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) errors.email = emailResult.error;

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) errors.password = passwordResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordStrength: passwordResult.strength,
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateCardHolderName,
  validateTravelerForm,
  validatePaymentForm,
  validateLoginForm,
  validateRegisterForm,
  sanitizeInput,
};
