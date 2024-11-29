export function calculateReward(spinsLeft: number, totalEarnings: number) {
  const targetTotal = 85; // Target total around 80-90
  const remaining = targetTotal - totalEarnings;
  const maxThisSpin = Math.min(80, remaining);
  
  if (spinsLeft === 1) {
    return Math.max(10, Math.min(maxThisSpin, remaining));
  }
  
  const minThisSpin = Math.max(10, remaining / spinsLeft);
  return Math.floor(Math.random() * (maxThisSpin - minThisSpin + 1)) + minThisSpin;
} 