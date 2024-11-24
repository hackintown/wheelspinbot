import { NextRequest, NextResponse } from "next/server";

type SpinResult = { success: boolean; reward: number | null; message: string };

const userSpins: Record<string, number> = {}; // Replace with a database in production

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { userId } = await req.json();

  if (!userSpins[userId]) userSpins[userId] = 3;

  if (userSpins[userId] > 0) {
    userSpins[userId]--;
    const reward = Math.floor(Math.random() * 51); // Random reward up to ₹50
    return NextResponse.json<SpinResult>({
      success: true,
      reward,
      message: "Spin successful!",
    });
  }

  return NextResponse.json<SpinResult>({
    success: false,
    reward: null,
    message: "No spins left.",
  });
}
