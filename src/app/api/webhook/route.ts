import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!process.env.BOT_TOKEN || !process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('Missing required environment variables');
    }
    // Check for /start command in incoming message
    if (body.message?.text === "/start") {
      const webAppUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
      // Prepare data to send to Telegram API
      const telegramMessage = {
        chat_id: body.message.chat.id,
        text: "🎮 Welcome to Spin & Win!\n\nClick the button below to play and win exciting rewards!",
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
      // Send message to the user via the Telegram API
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telegramMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send Telegram message: ${errorData.description || 'Unknown error'}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
