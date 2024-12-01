import NodeCache from "node-cache";

const membershipCache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

export async function verifyMembership(
  userId: string,
  botToken: string,
  channelId: string
) {
  // Check cache first
  const cachedStatus = membershipCache.get<boolean>(userId);
  if (cachedStatus !== undefined) {
    return cachedStatus;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelId}&user_id=${userId}`
    );
    const data = await response.json();

    const isMember =
      data.ok &&
      ["member", "administrator", "creator"].includes(data.result.status);

    // Cache the result
    membershipCache.set(userId, isMember);

    return isMember;
  } catch (error) {
    console.error("Membership verification error:", error);
    return false;
  }
}
