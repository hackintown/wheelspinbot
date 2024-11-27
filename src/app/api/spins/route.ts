import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { rateLimit } from "@/lib/rate-limit";

type SpinResult = { success: boolean; reward: number | null; message: string };

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await limiter.check(req, 10); // 10 requests per minute
    const { userId } = await req.json();
    await connectToDatabase();
    
    const user = await User.findOne({ telegramId: userId });
    if (!user || user.spinsLeft <= 0) {
      return NextResponse.json<SpinResult>({
        success: false,
        reward: null,
        message: "No spins left.",
      });
    }

    const reward = Math.floor(Math.random() * 51);
    await User.findOneAndUpdate(
      { telegramId: userId },
      { 
        $inc: { 
          spinsLeft: -1,
          totalEarnings: reward 
        }
      }
    );

    return NextResponse.json<SpinResult>({
      success: true,
      reward,
      message: "Spin successful!",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json<SpinResult>({
        success: false,
        reward: null,
        message: "Too many requests. Please try again later.",
      }, { status: 429 });
    }
    return NextResponse.json<SpinResult>({
      success: false,
      reward: null,
      message: "Server error",
    }, { status: 500 });
  }
}
