import { User } from "@/models/User";
import { connectToDatabase } from "./mongodb";

export class MembershipVerification {
  private static readonly MAX_VERIFICATION_ATTEMPTS = 3;
  private static readonly VERIFICATION_TIMEOUT = 1000 * 60 * 5; // 5 minutes

  static async verifyAndUpdateMembership(userId: string): Promise<{
    isMember: boolean;
    needsVerification: boolean;
    message?: string;
  }> {
    await connectToDatabase();

    // Get or create user
    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = await User.create({
        telegramId: userId,
        verificationAttempts: 0,
      });
    }

    // Check if user is already verified
    if (user.hasJoinedChannel) {
      // Periodic re-verification (every 24 hours)
      const lastVerification = user.lastVerificationTime?.getTime() || 0;
      const needsRecheck = Date.now() - lastVerification > 24 * 60 * 60 * 1000;

      if (!needsRecheck) {
        return { isMember: true, needsVerification: false };
      }
    }

    // Check if we should allow verification attempt
    if (user.verificationAttempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      const lastAttempt = user.lastVerificationTime?.getTime() || 0;
      if (Date.now() - lastAttempt < this.VERIFICATION_TIMEOUT) {
        return {
          isMember: false,
          needsVerification: false,
          message: "Too many verification attempts. Please try again later.",
        };
      }
      // Reset attempts after timeout
      await User.updateOne(
        { telegramId: userId },
        { $set: { verificationAttempts: 0 } }
      );
    }

    // Verify current membership status
    const isMember = await this.checkTelegramMembership(userId);

    // Update user record
    await User.updateOne(
      { telegramId: userId },
      {
        $set: {
          hasJoinedChannel: isMember,
          lastVerificationTime: new Date(),
          ...(isMember && { joinedAt: new Date() }),
        },
        $inc: { verificationAttempts: 1 },
      }
    );

    return {
      isMember,
      needsVerification: true,
      message: isMember
        ? "Membership verified"
        : "User is not a channel member",
    };
  }

  private static async checkTelegramMembership(
    userId: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${process.env.TELEGRAM_CHANNEL_ID}&user_id=${userId}`
      );
      const data = await response.json();
      return ["member", "administrator", "creator"].includes(
        data.result?.status
      );
    } catch (error) {
      console.error("Telegram API error:", error);
      return false;
    }
  }
}
