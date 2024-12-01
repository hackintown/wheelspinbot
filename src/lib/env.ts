export function validateEnv() {
  const required = [
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHANNEL_ID",
    "MONGODB_URI",
    "NEXT_PUBLIC_BASE_URL",
  ];

  for (const var_ of required) {
    if (!process.env[var_]) {
      throw new Error(`Missing required environment variable: ${var_}`);
    }
  }
}
