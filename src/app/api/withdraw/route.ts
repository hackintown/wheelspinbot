import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();
    
    if (amount < 100) {
      return NextResponse.json({ 
        success: false, 
        message: "Minimum withdrawal amount is ₹100" 
      }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ telegramId: userId });

    if (!user || user.totalEarnings < amount) {
      return NextResponse.json({ 
        success: false, 
        message: "Insufficient balance" 
      }, { status: 400 });
    }

    // Process withdrawal logic here
    // Update user balance
    await User.findOneAndUpdate(
      { telegramId: userId },
      { $inc: { totalEarnings: -amount } }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Withdrawal processed successfully" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Withdrawal failed" 
    }, { status: 500 });
  }
} 