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
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");
    try {
      const userId = tgWebApp.initDataUnsafe?.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const isMember = await verifyChannelMembership(userId);
      if (!isMember) {
        setErrorMessage('Please join the channel to continue.');
        return;
      }

      await tgWebApp.openTelegramLink('https://t.me/hackintown');
      router.push('/wheel-spin');
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Channel</h2>
        <p className="mb-4">Join the channel and get 3 spins for free!</p>
        
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          onClick={handleJoinClick}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Joining...' : 'Join Channel'}
        </button>
      </div>
    </div>
  );
};

export default JoinChannel;
