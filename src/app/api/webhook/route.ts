import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle different bot commands here
    if (body.message?.text === "/start") {
      // Send mini web app keyboard
      const webAppUrl = `https://wheelspinbot.vercel.app`;

      await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: body.message.chat.id,
            text: "🎮 Welcome to Spin & Win! Click the button below to start playing!",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🎲 Start Playing",
                    web_app: { url: webAppUrl },
                  },
                ],
              ],
            },
          }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
