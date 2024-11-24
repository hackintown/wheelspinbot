"use client";

import React, { useState } from "react";

const WheelSpin: React.FC = () => {
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [reward, setReward] = useState<number | null>(null);

  const handleSpin = async () => {
    if (spinsLeft > 0) {
      const response = await fetch("/api/spins", {
        method: "POST",
        body: JSON.stringify({ userId: "example-user" }), // Replace with Telegram user ID
      });
      const data = await response.json();
      if (data.success) {
        setReward(data.reward);
        setSpinsLeft((prev) => prev - 1);
      } else {
        alert(data.message);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Spin the Wheel!</h2>
        {reward !== null && <p className="text-lg mb-4">You won ₹{reward}!</p>}
        <p className="mb-4">Spins left: {spinsLeft}</p>
        <button
          onClick={handleSpin}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Spin
        </button>
      </div>
    </div>
  );
};

export default WheelSpin;
