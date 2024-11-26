import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FaGamepad } from "react-icons/fa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.message?.text === "/start") {
      const webAppUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: body.message.chat.id,
          text: "🎮 Welcome to Spin & Win! Click the button below to start playing!",
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
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
