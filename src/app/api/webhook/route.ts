import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.message?.text === "/start") {
      const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;

      const message = {
        chat_id: body.message.chat.id,
        text: "🎮 Welcome to Spin & Win!\n\nGet ready to win exciting rewards! Click the button below to start playing.",
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
      };

      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send Telegram message");
      }
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
