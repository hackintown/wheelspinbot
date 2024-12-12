import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface WebAppInfo {
  url: string;
}

interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: WebAppInfo;
}

interface ReplyMarkup {
  inline_keyboard?: InlineKeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  remove_keyboard?: boolean;
}

export async function sendMessage(chat_id: number, text: string, reply_markup?: ReplyMarkup) {
  return axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id,
    text,
    parse_mode: 'HTML',
    reply_markup,
  });
}

export async function editMessageText(chat_id: number, message_id: number, text: string, reply_markup?: ReplyMarkup) {
  return axios.post(`${TELEGRAM_API_URL}/editMessageText`, {
    chat_id,
    message_id,
    text,
    parse_mode: 'HTML',
    reply_markup,
  });
}

export async function getChatMember(userId: number, channelUsername: string) {
  const res = await axios.get(`${TELEGRAM_API_URL}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
  return res.data;
}
