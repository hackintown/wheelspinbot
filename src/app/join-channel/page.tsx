"use client";

import React, { useState } from "react";
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

interface WindowWithTelegram extends Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

const JoinChannel: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getTelegramWebApp = () => {
    if (typeof window !== "undefined") {
      return (window as unknown as WindowWithTelegram).Telegram?.WebApp;
    }
    return null;
  };

  const verifyChannelMembership = async (userId: string) => {
    try {
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return data.isMember;
    } catch (error) {
      console.error('Error verifying membership:', error);
      return false;
    }
  };

  const handleJoinClick = async () => {
    const tgWebApp = getTelegramWebApp();
    if (!tgWebApp) {
      console.error('Telegram WebApp is not available');
      return;
    }

    setIsLoading(true);
    try {
      // Open the channel link
      await tgWebApp.openTelegramLink('https://t.me/hackintown');
      
      // Get user ID from Telegram WebApp
      const userId = tgWebApp.initDataUnsafe?.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Verify channel membership
      const isMember = await verifyChannelMembership(userId);
      if (isMember) {
        router.push('/wheel-spin');
      } else {
        alert('Please join the channel to continue');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Channel</h2>
        <p className="mb-4">Join the channel and get 3 spins for free!</p>
        <button
          onClick={handleJoinClick}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Verifying...' : 'Join Channel'}
        </button>
      </div>
    </div>
  );
};

export default JoinChannel;
