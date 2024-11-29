export function validateEnvironment() {
  const required = [
    'BOT_TOKEN',
    'TELEGRAM_CHANNEL_ID',
    'MONGODB_URI',
    'NEXT_PUBLIC_BASE_URL',
    'WEBHOOK_SECRET',
    'NEXT_PUBLIC_MAX_SPINS',
    'NEXT_PUBLIC_MIN_REWARD',
    'NEXT_PUBLIC_MAX_REWARD'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate format of specific variables
  if (!process.env.TELEGRAM_CHANNEL_ID?.startsWith('@') && !process.env.TELEGRAM_CHANNEL_ID?.startsWith('-100')) {
    throw new Error('Invalid TELEGRAM_CHANNEL_ID format');
  }

  if (!process.env.MONGODB_URI?.startsWith('mongodb')) {
    throw new Error('Invalid MONGODB_URI format');
  }
} 