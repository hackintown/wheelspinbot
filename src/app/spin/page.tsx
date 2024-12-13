"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import dynamic from 'next/dynamic';

// Dynamically import the Wheel component with SSR disabled
const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
);

// Data for the roulette wheel.
// Each segment has an option label and optional styling.

interface RouletteSegment {
  option: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
  image?: {
    uri: string;
    offsetX?: number;
    offsetY?: number;
    sizeMultiplier?: number;
  };
}

const ROULETTE_DATA: RouletteSegment[] = [
  {
    option: "₹100",
    style: {
      backgroundColor: "#FF6B35",
      textColor: "#ffffff"
    }
  },
  {
    option: "Mini",
    style: {
      backgroundColor: "#9932CC",
      textColor: "#ffffff"
    }
  },
  {
    option: "Mega",
    style: {
      backgroundColor: "#1E90FF",
      textColor: "#ffffff"
    }
  },
  {
    option: "Double",
    style: {
      backgroundColor: "#FFA500",
      textColor: "#ffffff"
    }
  },
  {
    option: "?",
    style: {
      backgroundColor: "#FF4444",
      textColor: "#ffffff"
    }
  },
  {
    option: "Double",
    style: {
      backgroundColor: "#808080",
      textColor: "#ffffff"
    }
  },
  {
    option: "Mini",
    style: {
      backgroundColor: "#FF1493",
      textColor: "#ffffff"
    }
  },
  {
    option: "Medium",
    style: {
      backgroundColor: "#32CD32",
      textColor: "#ffffff"
    }
  },
];

/**
 * Interface representing the user data fetched from /api/user.
 */
interface UserData {
  username?: string;
  totalEarnings: number;
  spinsLeft: number;
}

/**
 * Interface representing the data returned from /api/spin.
 */
interface SpinResponse {
  amountWon: number;
  totalEarnings: number;
  spinsLeft: number;
  error?: string;
}

export default function SpinPage() {
  // State for user data (earnings, spins, username)
  const [userData, setUserData] = useState<UserData | null>(null);

  // Loading state to show a loading indicator while fetching user data
  const [loading, setLoading] = useState<boolean>(true);

  // Spinning state to control the wheel spin animation
  const [spinning, setSpinning] = useState<boolean>(false);

  // After the spin stops, the spin result (amount won) will be stored here
  const [spinResult, setSpinResult] = useState<number | null>(null);

  // Holds the index of the prize in the wheel data
  const [prizeNumber, setPrizeNumber] = useState<number | null>(null);

  /**
   * Fetch user data from /api/user on component mount.
   */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const data: UserData = await res.json();
        setUserData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Handle the spin action:
   * 1. Checks if user has spins left.
   * 2. Sets the spinning state.
   * 3. Fetches spin results from /api/spin.
   * 4. Determines which segment in the wheel corresponds to the amount won.
   * 5. Updates user data accordingly.
   */
  async function handleSpin() {
    if (!userData || userData.spinsLeft <= 0) return;

    setSpinning(true);
    setSpinResult(null);

    // Simulate a slight delay before fetching spin result for a better UX
    setTimeout(async () => {
      try {
        const res = await fetch("/api/spin", { method: "POST" });
        if (!res.ok) {
          setSpinning(false);
          alert("Unable to spin at this time.");
          return;
        }

        const data: SpinResponse = await res.json();

        if (data.error) {
          setSpinning(false);
          alert("No spins left");
          return;
        }

        const wonAmount = data.amountWon;
        // Find the index in the ROULETTE_DATA that corresponds to the won amount
        const index = ROULETTE_DATA.findIndex((d) => d.option === `₹${wonAmount}`);

        // If not found (for example if the server returns a special prize), fall back to a random index
        const chosenIndex = index > -1 ? index : Math.floor(Math.random() * ROULETTE_DATA.length);

        setPrizeNumber(chosenIndex);

        // Update user data with the new earnings and spins count
        setUserData({
          ...userData,
          totalEarnings: data.totalEarnings,
          spinsLeft: data.spinsLeft,
        });
      } catch (error) {
        console.error(error);
        setSpinning(false);
      }
    }, 500);
  }

  /**
   * Called when the wheel finishes spinning. This calculates the final result and displays it.
   */
  function handleStopSpinning() {
    setSpinning(false);
    if (prizeNumber !== null && ROULETTE_DATA[prizeNumber]) {
      const wonLabel = ROULETTE_DATA[prizeNumber].option;
      // Extract number from label if it starts with "₹"
      const wonAmountStr = wonLabel.startsWith("₹") ? wonLabel.replace("₹", "") : "";
      const wonAmountNum = Number(wonAmountStr);
      setSpinResult(!isNaN(wonAmountNum) ? wonAmountNum : null);
    }
  }

  // While loading user data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-900 text-white text-xl">
        Loading...
      </div>
    );
  }

  // If user data couldn't be loaded for some reason
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-900 text-white text-xl">
        Error loading user data
      </div>
    );
  }

  const { totalEarnings, spinsLeft, username } = userData;

  // Calculate the progress toward ₹100 withdrawal
  const progressTo100 = Math.min((totalEarnings / 100) * 100, 100);
  const amountNeeded = Math.max(100 - totalEarnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a1091] via-[#3a0975] to-[#2a0659] text-white p-4 flex flex-col items-center max-w-lg mx-auto">
      {/* Action Buttons Section */}
      <div className="flex justify-between items-center px-4 pt-3 pb-6 w-full max-w-4xl mx-auto">
        {/* Rank Button */}
        <div className="text-center">
          <button className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
            <Image
              src="/images/cup.webp"
              alt="View Rankings"
              width={50}
              height={50}
              className="drop-shadow-lg"
            />
          </button>
          <p className="text-white bg-indigo-900 backdrop-blur-sm border border-white/10 rounded-lg px-3 text-sm py-0.5 font-light shadow-lg -mt-2">
            Rank
          </p>
        </div>

        {/* Invitation Button */}
        <div className="text-center">
          <button className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
            <Image
              src="/images/invite.png"
              alt="Invite Friends"
              width={50}
              height={50}
              className="drop-shadow-lg"
            />
          </button>
          <p className="text-white bg-indigo-900 backdrop-blur-sm border border-white/10 rounded-lg px-3 text-sm py-0.5 font-light shadow-lg -mt-2">
            Invitation
          </p>
        </div>

        {/* Withdraw Button */}
        <div className="text-center">
          <button className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
            <Image
              src="/images/coin.png"
              alt="Withdraw Earnings"
              width={50}
              height={50}
              className="drop-shadow-lg"
            />
          </button>
          <p className="text-white bg-indigo-900 backdrop-blur-sm border border-white/10 rounded-lg px-3 text-sm py-0.5 font-light shadow-lg -mt-2">
            Withdraw
          </p>
        </div>
      </div>

      {/* User Info and Progress Section */}
      <div className="p-4 w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-4">
          <div className="text-xl font-bold">{username || "Player"}</div>
          <div className="text-sm opacity-80">You are so lucky!</div>
        </div>

        <div className="text-center mb-4">
          <div className="text-3xl font-bold mb-2 flex gap-x-2 items-center justify-center">
            <Image
              src="/images/coin.png"
              alt="Earnings"
              width={35}
              height={35}
              className="drop-shadow-lg"
            />
            <span className="text-2xl font-bold text-yellow-400">₹{totalEarnings}</span>
          </div>

          <div className="w-[250px] bg-gray-600 rounded-full h-2.5 mb-2">
            <div
              className="bg-yellow-500 h-full rounded-full transition-all"
              style={{ width: `${progressTo100}%` }}
            />
          </div>
          <div className="text-sm font-light mb-4">
            Only <span className="text-yellow-500 font-bold">₹{amountNeeded}</span> to withdraw ₹100!
          </div>
        </div>

        {/* Spin Wheel Section */}
        <div className="relative w-96 h-96 mb-4 flex flex-col items-center justify-center">
          {/* Decorative Outer Glow */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-pulse z-0" />

          {/* The Roulette Wheel */}
          <div className="z-10">
            <Wheel
              mustStartSpinning={spinning}
              prizeNumber={prizeNumber ?? 0}
              data={ROULETTE_DATA}
              outerBorderColor={"#fff"}
              outerBorderWidth={3}
              innerBorderColor={"#fff"}
              innerBorderWidth={4}
              innerRadius={20}
              radiusLineColor={"#fff"}
              radiusLineWidth={1}
              fontSize={24}
              fontWeight={500}
              textColors={["#ffffff"]}
              textDistance={75}
              perpendicularText={false}
              spinDuration={0.8}
              fontFamily={'Roboto'}
              onStopSpinning={handleStopSpinning}
            />
          </div>

          {/* Center Display: Spins Left or Spinner */}
          <div className="absolute flex flex-col items-center justify-center">
            {spinning ? (
              <div className="animate-spin h-14 w-14 border-4 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <div className="text-2xl font-bold text-white flex items-center justify-center p-1">
                  {spinsLeft > 0 ? spinsLeft : "0"}
                </div>
                {/* <div className="text-xs font-normal text-white">Spins</div> */}
              </>
            )}
          </div>

          {/* Display the won amount after the spin stops */}
          {spinResult !== null && !spinning && (
            <div className="absolute top-full mt-2 text-lg text-center font-bold text-yellow-400">
              You Won ₹{spinResult}!
            </div>
          )}
        </div>

        {/* Spin Button or Invitation */}
        {spinsLeft > 0 ? (
          <button
            onClick={handleSpin}
            className="bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-full"
            disabled={spinning}
          >
            {spinning ? "Spinning..." : "Spin Now!"}
          </button>
        ) : (
          <div className="text-center mb-4 mt-10">
            <button className="bg-indigo-900 text-white font-medium text-sm py-2 px-4 w-[280px] rounded-lg mb-2 border border-white/10">
              Invite For Spins
            </button>
            {totalEarnings >= 100 && (
              <button className="bg-green-500 text-purple-900 font-bold py-2 px-4 rounded-full">
                Withdraw Now!
              </button>
            )}
          </div>
        )}

        {/* Share Buttons */}
        <div className="text-sm text-center opacity-80 flex items-center justify-center gap-2 mt-4">
          <span className="mr-2 font-light text-white">Share To:</span>
          <button className="inline-flex items-center gap-1 bg-green-500 text-white p-1.5 rounded-full hover:bg-green-600 transition-colors">
            <FaWhatsapp size={18} />
          </button>
          <button className="inline-flex items-center gap-1 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors">
            <FaFacebook size={18} />
          </button>
          <button className="inline-flex items-center gap-1 bg-black text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors">
            <FaTwitter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
