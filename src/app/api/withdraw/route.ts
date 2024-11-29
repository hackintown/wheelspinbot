import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();
    
    if (!userId || amount < 100) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid withdrawal request" 
      }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ telegramId: userId });

    if (!user || user.totalEarnings < amount) {
      return NextResponse.json({ 
        success: false, 
        error: "Insufficient balance" 
      }, { status: 400 });
    }

    // Record withdrawal request
    await User.findOneAndUpdate(
      { telegramId: userId },
      { 
        $inc: { totalEarnings: -amount },
        $push: { 
          withdrawals: {
            amount,
            timestamp: new Date(),
            status: 'pending'
          }
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 