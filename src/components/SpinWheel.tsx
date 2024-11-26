"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { FaSpinner } from "react-icons/fa";

interface SpinWheelProps {
  onSpinComplete: (amount: number) => void;
  disabled: boolean;
}

const prizes = [10, 20, 30, 40, 50, 60, 70, 80];
const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5", "#9B59B6", "#3498DB"];

export default function SpinWheel({ onSpinComplete, disabled }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning || disabled) return;

    setSpinning(true);
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const extraSpins = Math.floor(Math.random() * 5) + 10;
    const targetRotation = rotation + (360 * extraSpins) + (360 / prizes.length) * prizes.indexOf(randomPrize);

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
    <div className="relative w-80 h-80 mx-auto">
      <div
        className="absolute w-full h-full rounded-full shadow-lg overflow-hidden"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        }}
      >
        {prizes.map((prize, index) => (
          <div
            key={index}
            className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center text-white font-bold"
            style={{
              transform: `rotate(${(index * 360) / prizes.length}deg)`,
              backgroundColor: colors[index],
            }}
          >
            ₹{prize}
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full
                 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                 transition-all duration-300 hover:scale-105"
      >
        {spinning ? <FaSpinner className="animate-spin" /> : "SPIN!"}
      </button>
    </div>
  );
}
