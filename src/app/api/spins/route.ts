import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { rateLimit } from "@/lib/rate-limit";

type SpinResult = { success: boolean; reward: number | null; message: string; spinsLeft?: number };

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await limiter.check(req, 10);
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        reward: null, 
        message: "User ID is required" 
      }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ telegramId: userId });
    if (!user || user.spinsLeft <= 0) {
      return NextResponse.json({
        success: false,
        reward: null,
        message: "No spins left",
      });
    }

    // Calculate reward between 10 and 80
    const reward = Math.floor(Math.random() * (80 - 10 + 1)) + 10;
    
    const updatedUser = await User.findOneAndUpdate(
      { telegramId: userId },
      { 
        $inc: { 
          spinsLeft: -1,
          totalEarnings: reward 
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        reward: null,
        message: "Failed to update user data",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reward,
      spinsLeft: updatedUser.spinsLeft,
      message: "Spin successful!",
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json({
        success: false,
        reward: null,
        message: "Too many requests. Please try again later.",
      }, { status: 429 });
    }
    return NextResponse.json({
      success: false,
      reward: null,
      message: "Server error",
    }, { status: 500 });
  }
}
