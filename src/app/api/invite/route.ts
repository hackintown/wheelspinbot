import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId, invitedBy } = await req.json();
    await connectToDatabase();

    // Update inviter's record
    await User.findOneAndUpdate(
      { telegramId: invitedBy },
      { 
        $addToSet: { invitedUsers: userId },
        $inc: { spinsLeft: 2 } // Reward 2 extra spins for inviting
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 