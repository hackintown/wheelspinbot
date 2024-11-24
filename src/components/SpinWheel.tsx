"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface SpinWheelProps {
  onSpinComplete: (amount: number) => void;
  disabled: boolean;
}

export default function SpinWheel({
  onSpinComplete,
  disabled,
}: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const spin = () => {
    if (spinning || disabled) return;

    setSpinning(true);
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const extraSpins = Math.floor(Math.random() * 5) + 5;
    const targetRotation =
      rotation +
      360 * extraSpins +
      (360 / prizes.length) * prizes.indexOf(randomPrize);

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onSpinComplete(randomPrize);
    }, 5000);
  };

  return (
    <div className="relative w-80 h-80">
      <div
        className="absolute w-full h-full rounded-full border-4 border-gold bg-gradient-to-r from-purple-500 to-indigo-500"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        {/* Add wheel segments here */}
      </div>
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SPIN!
      </button>
    </div>
  );
}
