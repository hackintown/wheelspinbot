import crypto from 'crypto';

export function validateTelegramHash(initData: string, botToken: string): boolean {
  try {
    const data = new URLSearchParams(initData);
    const hash = data.get('hash');
    data.delete('hash');

    const dataCheckString = Array.from(data.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hash === calculatedHash;
  } catch (error) {
    console.error('Telegram hash validation error:', error);
    return false;
  }
} 