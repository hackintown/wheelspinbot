import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

type SpinResult = { success: boolean; reward: number | null; message: string };

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
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
  } catch (error) {
    return NextResponse.json<SpinResult>({
      success: false,
      reward: null,
      message: "Server error",
    }, { status: 500 });
  }
}
