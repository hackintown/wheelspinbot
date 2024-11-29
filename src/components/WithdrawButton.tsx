import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';

interface Props {
  balance: number;
  onWithdraw: () => Promise<void>;
}

export default function WithdrawButton({ balance, onWithdraw }: Props) {
  return balance >= 100 ? (
    <button
      onClick={onWithdraw}
      className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full"
    >
      Withdraw ₹{balance}
    </button>
  ) : null;
} 