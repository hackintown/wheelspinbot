import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import { sendMessage, editMessageText } from '@/lib/telegram';
import { isUserChannelMember } from '@/lib/verifyMembership';

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramCallbackQuery {
  message: {
    chat: {
      id: number;
    };
    message_id: number;
  };
  data: string;
  from: TelegramUser;
}

const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME!;
const BASE_URL = process.env.BASE_URL!;

export async function POST(request: NextRequest) {
  await connectDB();
  const update = await request.json();

  const message = update.message;
  const callbackQuery = update.callback_query;

  if (message?.text === '/start') {
    await handleStartCommand(message.chat.id, message.from);
  } else if (callbackQuery) {
    await handleCallbackQuery(callbackQuery);
  }

  return NextResponse.json({ status: 'ok' });
}

async function handleStartCommand(chatId: number, from: TelegramUser) {
  await User.findOneAndUpdate(
    { telegramId: from.id },
    { username: from.username || '', joinedChannel: false },
    { upsert: true, new: true }
  );

  // Provide a WebApp button to open the spin page
  await sendMessage(chatId, "Welcome to Spin and Win! Click below to start playing.", {
    inline_keyboard: [
      [{
        text: "Open Spin Game",
        web_app: {
          url: `${BASE_URL}/spin`
        }
      }],
      // Optional: If you still want to keep the channel join flow via bot (not webapp)
      [{ text: "Start Playing (Bot Flow)", callback_data: "start_playing" }]
    ]
  });
}

async function handleCallbackQuery(query: TelegramCallbackQuery) {
  const { message, data, from } = query;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  let user = await User.findOne({ telegramId: from.id });
  if (!user) {
    user = new User({ telegramId: from.id, username: from.username || '' });
    await user.save();
  }

  switch (data) {
    case 'start_playing':
      await showJoinChannelUI(chatId, messageId);
      break;
    case 'join_channel':
      await editMessageText(chatId, messageId, 
        "Join the channel @hackintown and then click continue.", {
          inline_keyboard: [
            [{ text: "I have Joined. Continue", callback_data: "continue_after_join" }]
          ]
      });
      break;
    case 'continue_after_join':
      if (await isUserChannelMember(from.id, CHANNEL_USERNAME)) {
        await User.updateOne({ telegramId: from.id }, { joinedChannel: true });
        await showSpinReminder(chatId, messageId);
      } else {
        await editMessageText(chatId, messageId, "Please join the channel first!", {
          inline_keyboard: [
            [{ text: "Join channel", url: `https://t.me/${CHANNEL_USERNAME.replace('@', '')}` }],
            [{ text: "I have Joined. Continue", callback_data: "continue_after_join" }]
          ]
        });
      }
      break;
    default:
      break;
  }
}

async function showJoinChannelUI(chatId: number, messageId: number) {
  await editMessageText(chatId, messageId, 
    "Join our Telegram Channel @hackintown to get 3 free spins!", {
    inline_keyboard: [
      [{ text: "Join Channel", url: "https://t.me/hackintown", callback_data: "join_channel" }],
      [{ text: "I have Joined. Continue", callback_data: "continue_after_join" }]
    ]
  });
}

async function showSpinReminder(chatId: number, messageId: number) {
  await editMessageText(chatId, messageId, 
    "You are verified! Please open the spin game using the WebApp button below.", {
    inline_keyboard: [
      [{
        text: "Open Spin Game",
        web_app: {
          url: `${BASE_URL}/spin`
        }
      }]
    ]
  });
}
