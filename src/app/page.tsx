"use client";

import { useState, useEffect } from "react";
import SpinWheel from "@/components/SpinWheel";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  openTelegramLink: (url: string) => Promise<void>;
}

interface WindowWithTelegram extends Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

const getTelegramWebApp = () => {
  if (typeof window !== "undefined") {
    return (window as unknown as WindowWithTelegram).Telegram?.WebApp;
  }
  return null;
};

const verifyChannelMembership = async (userId: string) => {
  try {
    const response = await fetch(`/api/verify-membership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data.isMember;
  } catch (error) {
    console.error("Error verifying membership:", error);
    return false;
  }
};

export default function Home() {
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const tgWebApp = getTelegramWebApp();
    if (tgWebApp) {
      tgWebApp.ready();
      tgWebApp.expand();
    }
  }, []);

  const handleJoinChannel = async () => {
    const tgWebApp = getTelegramWebApp();
    if (!tgWebApp) {
      console.warn("Telegram WebApp is not available");
      // Fallback behavior for testing outside Telegram
      setHasJoinedChannel(true);
      return;
    }

    try {
      await tgWebApp.openTelegramLink("https://t.me/yourchannel");
      setHasJoinedChannel(true);
    } catch (error) {
      console.error("Error joining channel:", error);
      // Handle error appropriately
    }
  };

  const handleSpinComplete = (amount: number) => {
    setTotalEarnings((prev) => prev + amount);
    setSpinsLeft((prev) => prev - 1);
  };

  if (!hasJoinedChannel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-600 to-blue-600">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <h1 className="text-2xl font-bold mb-4">🎉 Welcome to Spin & Win!</h1>
          <p className="mb-6">Join our channel and get 3 FREE spins!</p>
          <button
            onClick={handleJoinChannel}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full
                     transition-all duration-300 transform hover:scale-105"
          >
            Join Channel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-600 to-blue-600">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Your Earnings: ₹{totalEarnings}
        </h2>
        <p className="mb-4">Spins Left: {spinsLeft}</p>
        <SpinWheel
          onSpinComplete={handleSpinComplete}
          disabled={spinsLeft === 0}
        />
      </div>
    </div>
  );
}
