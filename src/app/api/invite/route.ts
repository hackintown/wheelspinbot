import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyMembership } from "@/lib/membership-cache";

export async function POST(req: NextRequest) {
  try {
    const { userId, invitedUserId } = await req.json();

    if (!userId || !invitedUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify channel membership for invited user
    const hasJoined = await verifyMembership(
      invitedUserId,
      process.env.TELEGRAM_BOT_TOKEN!,
      process.env.TELEGRAM_CHANNEL_ID!
    );

    if (!hasJoined) {
      return NextResponse.json(
        {
          success: false,
          error: "Invited user hasn't joined the channel",
        },
        { status: 400 }
      );
    }

    // Update inviter's balance and record
    await User.findOneAndUpdate(
      { telegramId: userId },
      {
        $addToSet: { invitedUsers: invitedUserId },
        $inc: { totalEarnings: 10 },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
