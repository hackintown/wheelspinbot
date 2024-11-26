"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isTelegramAvailable, setIsTelegramAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initTelegram = async () => {
      if (!mounted) return;

      try {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          
          if (mounted) {
            setIsTelegramAvailable(true);
            setIsLoading(false);
            await checkMembership();
          }
        } else {
          if (mounted) {
            setIsLoading(false);
            router.push('/join-channel');
          }
        }
      } catch (error) {
        console.error('Telegram initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    setTimeout(initTelegram, 100);

    return () => {
      mounted = false;
    };
  }, []);

  const checkMembership = async () => {
    if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      return;
    }

    try {
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: window.Telegram.WebApp.initDataUnsafe.user.id 
        }),
      });
      const data = await response.json();
      setHasJoinedChannel(data.isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleJoinChannel = async () => {
    if (!window.Telegram?.WebApp) {
      router.push('/join-channel');
      return;
    }

    setIsLoading(true);
    try {
      await window.Telegram.WebApp.openTelegramLink('https://t.me/hackintown');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await checkMembership();
      
      if (hasJoinedChannel) {
        router.push('/wheel-spin');
      } else {
        alert('Please join the channel to continue');
      }
    } catch (error) {
      console.error("Error joining channel:", error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = (amount: number) => {
    setTotalEarnings(prev => prev + amount);
    setSpinsLeft(prev => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-600">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasJoinedChannel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-600 to-blue-600">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <h1 className="text-2xl font-bold mb-4">🎉 Welcome to Spin & Win!</h1>
          <p className="mb-6">Join our channel and get 3 FREE spins!</p>
          {!isTelegramAvailable && (
            <p className="text-sm text-gray-500 mb-4">
              Loading Telegram WebApp...
            </p>
          )}
          <button
            onClick={handleJoinChannel}
            disabled={isLoading || !isTelegramAvailable}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full
                     transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Join Channel'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Your existing render logic here */}
    </div>
  );
}
