import { getChatMember } from './telegram';

export async function isUserChannelMember(userId: number, channelUsername: string): Promise<boolean> {
  try {
    const data = await getChatMember(userId, channelUsername);
    if (data.ok) {
      const status = data.result.status;
      return ['creator', 'administrator', 'member'].includes(status);
    }
    return false;
  } catch {
    return false;
  }
}
