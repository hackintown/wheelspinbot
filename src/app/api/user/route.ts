import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

// For a real WebApp, parse the Telegram WebApp init data from request headers or search params.
// Here we hardcode a user for demonstration.
const TEST_USER_ID = 12345;

export async function GET() {
  await connectDB();
  let user = await User.findOne({ telegramId: TEST_USER_ID });
  if (!user) {
    user = new User({ telegramId: TEST_USER_ID, username: 'Player' });
    await user.save();
  }
  return NextResponse.json({
    username: user.username,
    totalEarnings: user.totalEarnings,
    spinsLeft: user.spinsLeft
  });
}
