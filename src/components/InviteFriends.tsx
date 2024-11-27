import { FaShare, FaTelegram } from 'react-icons/fa';

interface Props {
  onShare: () => void;
  totalEarnings: number;
}

export default function InviteFriends({ onShare, totalEarnings }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Congratulations!
          </h2>
          <p className="text-gray-600">
            You've won ₹{totalEarnings} so far!
          </p>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-purple-800 font-semibold">
              Invite friends to get more spins!
            </p>
          </div>
          <button
            onClick={onShare}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full w-full transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <FaShare className="text-xl" />
            <span>Invite Friends</span>
          </button>
        </div>
      </div>
    </div>
  );
} 