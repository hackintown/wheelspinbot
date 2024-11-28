import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { userId, initData } = await request.json();
    
    console.log('Received verification request:', {
      userId,
      initData
    });

    // Ensure userId is provided in the request
    if (!userId) {
      return NextResponse.json({ 
        isMember: false, 
        error: "User ID is required" 
      }, { status: 400 });
    }

    // Make a GET request to the Telegram API to check the user's membership
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${process.env.TELEGRAM_CHANNEL_ID}&user_id=${userId}`
    );

    const data = await response.json();
    console.log('Telegram API response:', data);

    if (!response.ok) {
      throw new Error(`Telegram API error: ${data.description || response.statusText}`);
    }
    
    if (data.ok === false) {
      throw new Error(`Telegram API error: ${data.description}`);
    }

    const isMember = ["member", "administrator", "creator"].includes(data.result?.status);
    console.log('Membership status:', {
      status: data.result?.status,
      isMember
    });

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

    return NextResponse.json({ 
      isMember,
      status: data.result?.status 
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      isMember: false, 
      error: error instanceof Error ? error.message : "Verification failed" 
    }, { status: 500 });
  }
} 