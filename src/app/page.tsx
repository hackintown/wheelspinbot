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
    let mounted = true;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 10;

    const initializeTelegramWebApp = async () => {
      if (!mounted) return;
      
      console.log('Initialization attempt:', initAttempts + 1);
      console.log('Current WebApp state:', {
        telegram: !!window.Telegram,
        webApp: !!window.Telegram?.WebApp,
        initData: !!window.Telegram?.WebApp?.initDataUnsafe,
        user: window.Telegram?.WebApp?.initDataUnsafe?.user
      });

      if (window.Telegram?.WebApp) {
        try {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          setIsTelegramAvailable(true);

          // Wait a bit before checking membership
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            await checkMembership();
          } else if (initAttempts < MAX_ATTEMPTS) {
            initAttempts++;
            setTimeout(initializeTelegramWebApp, 500);
          } else {
            console.error('Failed to get user data after maximum attempts');
            setIsTelegramAvailable(false);
          }
        } catch (error) {
          console.error('Error during WebApp initialization:', error);
          setIsTelegramAvailable(false);
        }
      } else if (initAttempts < MAX_ATTEMPTS) {
        initAttempts++;
        setTimeout(initializeTelegramWebApp, 500);
      } else {
        console.error('Telegram WebApp not available after maximum attempts');
        setIsTelegramAvailable(false);
      }
    };

    initializeTelegramWebApp();

    return () => {
      mounted = false;
    };
  }, []);

  const checkMembership = async () => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const initData = window.Telegram?.WebApp?.initDataUnsafe;
    
    console.log('Checking membership with:', {
      userId,
      initData
    });
    
    if (!userId) {
      console.error('User ID not found - WebApp might not be properly initialized');
      setHasJoinedChannel(false);
      return false;
    }

    try {
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          initData 
        }),
      });
      
      const data = await response.json();
      console.log('Membership check response:', data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${data.error || 'Unknown error'}`);
      }
      
      setHasJoinedChannel(data.isMember);
      return data.isMember;
    } catch (error) {
      console.error('Error verifying membership:', error);
      setHasJoinedChannel(false);
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
      
      // Try verifying membership multiple times with delays
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        // Wait between attempts
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user has joined
        const isMember = await checkMembership();
        if (isMember) {
          router.push('/wheel-spin');
          return;
        }
        attempts++;
      }
      
      // If we get here, membership verification failed
      setHasJoinedChannel(false);
    } catch (error) {
      console.error("Error joining channel:", error);
      setHasJoinedChannel(false);
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
