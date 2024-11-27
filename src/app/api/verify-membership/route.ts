import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
     // Ensure userId is provided in the request
    if (!userId) {
      return NextResponse.json({ isMember: false, error: "User ID is required" }, { status: 400 });
    }
 // Make a GET request to the Telegram API to check the user's membership
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${process.env.TELEGRAM_CHANNEL_ID}&user_id=${userId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to check membership: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.ok === false) {
      throw new Error(`Telegram API error: ${data.description}`);
    }

    const isMember = ["member", "administrator", "creator"].includes(data.result?.status);

    if (isMember) {
      await connectToDatabase();
      await User.findOneAndUpdate(
        { telegramId: userId },
        { 
          hasJoinedChannel: true,
          spinsLeft: 3,
          totalEarnings: 0
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ isMember });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ isMember: false, error: "Verification failed" }, { status: 500 });
  }
} 