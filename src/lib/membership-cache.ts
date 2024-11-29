import { LRUCache } from 'lru-cache';

const membershipCache = new LRUCache<string, boolean>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function verifyMembership(userId: string, botToken: string, channelId: string) {
  const cached = membershipCache.get(userId);
  if (cached !== undefined) return cached;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelId}&user_id=${userId}`
  );
  const data = await response.json();
  
  const isMember = ["member", "administrator", "creator"].includes(data.result?.status);
  membershipCache.set(userId, isMember);
  
  return isMember;
} 