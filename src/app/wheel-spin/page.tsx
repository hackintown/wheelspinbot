"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpinWheel from '@/components/SpinWheel';
import LoadingSpinner from '@/components/LoadingSpinner';
import InviteFriends from '@/components/InviteFriends';
import { GAME_CONFIG } from '@/config/constants';
import { trackEvent } from '@/lib/analytics';

export default function WheelSpinPage() {
  const router = useRouter();
  const [spinsLeft, setSpinsLeft] = useState(GAME_CONFIG.MAX_SPINS);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showInvite, setShowInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user?.id) {
      router.push('/');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleSpinComplete = async (amount: number) => {
    setTotalEarnings(prev => prev + amount);
    setSpinsLeft(prev => prev - 1);
    
    if (spinsLeft <= 0) {
      setShowInvite(true);
    }
    
    trackEvent('spin_complete', { amount, spinsLeft: spinsLeft - 1 });
  };

  const handleShare = async () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        await tg.openTelegramLink(`https://t.me/share/url?url=${process.env.NEXT_PUBLIC_BASE_URL}&text=I just won ₹${totalEarnings} playing Spin & Win! Try your luck too! 🎰`);
      } catch (error) {
        console.error('Share error:', error);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600 p-4">
      <div className="max-w-md mx-auto">
        <SpinWheel 
          onSpinComplete={handleSpinComplete}
          disabled={spinsLeft === 0}
          spinsLeft={spinsLeft}
        />
        {showInvite && (
          <InviteFriends 
            onShare={handleShare}
            totalEarnings={totalEarnings}
          />
        )}
      </div>
    </div>
  );
} 