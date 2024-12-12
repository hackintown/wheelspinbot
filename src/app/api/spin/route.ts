import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import { getSpinAmount } from '@/lib/spinLogic';

const TEST_USER_ID = 12345;

export async function POST() {
  await connectDB();
  const user = await User.findOne({ telegramId: TEST_USER_ID });
  if (!user || user.spinsLeft <= 0) {
    return NextResponse.json({ error: 'No spins left' }, { status: 400 });
  }

  const spinAmount = getSpinAmount();
  user.spinsLeft -= 1;
  user.totalEarnings += spinAmount;
  await user.save();

  return NextResponse.json({
    amountWon: spinAmount,
    totalEarnings: user.totalEarnings,
    spinsLeft: user.spinsLeft
  });
}
