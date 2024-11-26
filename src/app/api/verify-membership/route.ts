import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHANNEL_ID,
          user_id: userId,
        }),
      }
    );

    const data = await response.json();
    const isMember = ["member", "administrator", "creator"].includes(data.result?.status);

    if (isMember) {
      await connectToDatabase();
      await User.findOneAndUpdate(
        { telegramId: userId },
        { hasJoinedChannel: true },
        { upsert: true }
      );
    }

    return NextResponse.json({ isMember });
  } catch (error) {
    return NextResponse.json({ isMember: false }, { status: 500 });
  }
} 