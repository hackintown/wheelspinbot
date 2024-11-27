export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SpinResponse {
  reward: number;
  spinsLeft: number;
  totalEarnings: number;
}

export interface VerifyMembershipResponse {
  isMember: boolean;
  error?: string;
}
