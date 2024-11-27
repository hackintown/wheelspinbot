"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { FaSpinner, FaGift } from "react-icons/fa";
import { GAME_CONFIG } from '@/config/constants';

interface SpinWheelProps {
  onSpinComplete: (amount: number) => void;
  disabled: boolean;
  spinsLeft: number;
}

const prizes = GAME_CONFIG.REWARDS;
const colors = GAME_CONFIG.COLORS;

const confetti = dynamic(() => import('canvas-confetti'), {
  ssr: false
}) as any;

export default function SpinWheel({ onSpinComplete, disabled, spinsLeft }: SpinWheelProps) {
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
      const triggerConfetti = () => {
        if (typeof window !== 'undefined') {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500']
          });
        }
      };
      triggerConfetti();
      onSpinComplete(randomPrize);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Spin & Win!</h2>
        <p className="text-white/80">Spins remaining: {spinsLeft}</p>
      </div>
      
      <div className="relative w-80 h-80">
        <div
          className="absolute w-full h-full rounded-full shadow-lg overflow-hidden transform transition-transform"
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
              <div className="rotate-90">₹{prize}</div>
            </div>
          ))}
        </div>
        
        <button
          onClick={spin}
          disabled={spinning || disabled}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-6 rounded-full
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                   transition-all duration-300 hover:scale-105 w-20 h-20"
        >
          {spinning ? (
            <FaSpinner className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <FaGift className="w-6 h-6 mx-auto" />
          )}
        </button>
      </div>
    </div>
  );
}
