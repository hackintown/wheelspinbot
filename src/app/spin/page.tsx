"use client";
import { useEffect, useState } from "react";

export default function SpinPage() {
  const [userData, setUserData] = useState<{
    username?: string;
    totalEarnings: number;
    spinsLeft: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    })();
  }, []);

  async function handleSpin() {
    if (!userData || userData.spinsLeft <= 0) return;
    setSpinning(true);
    setSpinResult(null);

    // Simulate spin visually
    setTimeout(async () => {
      const res = await fetch("/api/spin", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setSpinning(false);
        alert("No spins left");
        return;
      }
      setSpinResult(data.amountWon);
      setUserData({
        ...userData,
        totalEarnings: data.totalEarnings,
        spinsLeft: data.spinsLeft
      });
      setSpinning(false);
    }, 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-900 text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-900 text-white text-xl">
        Error loading user data
      </div>
    );
  }

  const { totalEarnings, spinsLeft, username } = userData;
  const progressTo100 = Math.min((totalEarnings / 100) * 100, 100);
  const amountNeeded = Math.max(100 - totalEarnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white p-4 flex flex-col items-center">
      <header className="w-full flex justify-between items-center mb-4">
        <button className="text-white" onClick={() => window.history.back()}>
          Close
        </button>
        <div className="font-bold text-lg">FindoLucky</div>
        <div></div>
      </header>
      
      <div className="bg-purple-800 rounded-md p-4 w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-4">
          <div className="text-xl font-bold">{username || "Player"}</div>
          <div className="text-sm opacity-80">You are so lucky!</div>
        </div>

        <div className="text-center mb-4">
          <div className="text-3xl font-bold mb-2">₹{totalEarnings}</div>
          <div className="text-sm">Only ₹{amountNeeded} to withdraw ₹100!</div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2 mb-4">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all"
              style={{ width: `${progressTo100}%` }}
            ></div>
          </div>
        </div>

        <div className="relative w-64 h-64 mb-4 flex items-center justify-center">
          <div className="w-full h-full rounded-full border-4 border-yellow-400 flex items-center justify-center">
            {spinning ? (
              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            ) : (
              <div className="text-2xl font-bold">
                {spinsLeft > 0 ? `${spinsLeft} Spins` : "0 Spins"}
              </div>
            )}
          </div>
          {spinResult !== null && !spinning && (
            <div className="absolute top-full mt-2 text-lg">
              You Won ₹{spinResult}!
            </div>
          )}
        </div>

        {spinsLeft > 0 ? (
          <button
            onClick={handleSpin}
            className="bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-full"
            disabled={spinning}
          >
            {spinning ? "Spinning..." : "Spin Now!"}
          </button>
        ) : (
          <div className="text-center mb-4">
            <div className="text-lg font-bold mb-2">
              Invite To Get More Spins
            </div>
            <button className="bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-full mb-2">
              Invite For Spins
            </button>
            {totalEarnings >= 100 && (
              <button className="bg-green-500 text-purple-900 font-bold py-2 px-4 rounded-full">
                Withdraw Now!
              </button>
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-center opacity-80">
          Share To: 
          <span className="inline-block ml-2 bg-white text-purple-900 p-1 rounded-full">WhatsApp</span>
          <span className="inline-block ml-2 bg-white text-purple-900 p-1 rounded-full">Facebook</span>
        </div>
      </div>
    </div>
  );
}
