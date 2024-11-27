"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  openTelegramLink: (url: string) => Promise<void>;
  initDataUnsafe?: {
    user?: {
      id: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default function JoinChannelPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoinedChannel, setHasJoinedChannel] = useState<boolean | null>(null);
  const [isTelegramAvailable, setIsTelegramAvailable] = useState(false);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      setIsTelegramAvailable(true);
      // Check initial membership status
      checkMembership();
    }
  }, []);

  const checkMembership = async () => {
    const userId = window.Telegram?.WebApp.initDataUnsafe?.user?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setHasJoinedChannel(data.isMember);
      return data.isMember;
    } catch (error) {
      console.error('Error verifying membership:', error);
      return false;
    }
  };

  const handleJoinChannel = async () => {
    if (!window.Telegram?.WebApp) {
      router.push('/join-channel');
      return;
    }

    setIsLoading(true);
    try {
      // Open Telegram channel link
      await window.Telegram.WebApp.openTelegramLink('https://t.me/hackintown');
      // Wait for user to potentially join
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Check if user has joined
      const isMember = await checkMembership();
      if (isMember) {
        router.push('/wheel-spin');
      }
    } catch (error) {
      console.error("Error joining channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={hasJoinedChannel ? () => router.push('/wheel-spin') : handleJoinChannel}
          disabled={isLoading || !isTelegramAvailable}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full
                   transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : hasJoinedChannel ? 'Continue' : 'Join Channel'}
        </button>

        {hasJoinedChannel === false && (
          <p className="mt-4 text-sm text-red-500">
            Please join the channel to continue
          </p>
        )}
      </div>
    </div>
  );
}
