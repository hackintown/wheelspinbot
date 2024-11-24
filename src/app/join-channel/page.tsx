"use client";

import React, { useState } from "react";

const JoinChannel: React.FC = () => {
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinClick = () => {
    // Validate channel join (use Telegram Bot API)
    setHasJoined(true);
  };

  const handleContinue = () => {
    window.location.href = "/wheel-spin"; // Navigate to spin page
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      {!hasJoined ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Channel</h2>
          <p className="mb-4">Join the channel and get 3 spins for free!</p>
          <button
            onClick={handleJoinClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Join Channel
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">You&apos;re All Set!</h2>
          <p className="mb-4">
            Click below to start spinning and win cash rewards.
          </p>
          <button
            onClick={handleContinue}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinChannel;
