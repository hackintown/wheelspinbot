import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!process.env.BOT_TOKEN || !process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('Missing required environment variables');
    }

    if (body.message?.text === "/start") {
      const webAppUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: body.message.chat.id,
          text: `🎮 Welcome to Spin & Win!\n\n🎲 Get ready to win exciting rewards!\n💰 Spin the wheel and win up to ₹80!\n\nClick the button below to start playing!`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🎲 Start Playing",
                web_app: { url: webAppUrl },
              },
            ]],
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram message');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
