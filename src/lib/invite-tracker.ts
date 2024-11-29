import { User } from '@/models/User';
import { verifyMembership } from './membership-cache';

export async function trackInvite(inviterId: string, inviteeId: string) {
  const hasJoined = await verifyMembership(
    inviteeId,
    process.env.BOT_TOKEN!,
    process.env.TELEGRAM_CHANNEL_ID!
  );

  if (!hasJoined) {
    throw new Error('Invited user has not joined the channel');
  }

  const inviter = await User.findOneAndUpdate(
    { 
      telegramId: inviterId,
      'invitedUsers': { $ne: inviteeId }
    },
    { 
      $push: { invitedUsers: inviteeId },
      $inc: { totalEarnings: 10 }
    },
    { new: true }
  );

  return inviter;
} 