export interface User {
  id: number;
  telegramId: string;
  spinsLeft: number;
  totalEarnings: number;
  hasJoinedChannel: boolean;
  invitedUsers: string[];
}

export interface SpinResult {
  amount: number;
  message: string;
}
