import { User } from '@/models/User';

export async function processWithdrawal(userId: string, amount: number) {
  if (amount < 100) {
    throw new Error('Minimum withdrawal amount is ₹100');
  }

  const user = await User.findOne({ telegramId: userId });
  
  if (!user || user.totalEarnings < amount) {
    throw new Error('Insufficient balance');
  }

  await User.findOneAndUpdate(
    { telegramId: userId },
    { 
      $inc: { totalEarnings: -amount },
      $push: { 
        withdrawals: {
          amount,
          timestamp: new Date(),
          status: 'pending'
        }
      }
    }
  );

  // Here you would integrate with your payment processing system
  return { success: true, amount };
} 