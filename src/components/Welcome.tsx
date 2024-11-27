import { FaGamepad, FaTelegram } from 'react-icons/fa';

export default function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform hover:scale-105 transition-transform">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Spin & Win!
          </h1>
          <p className="text-gray-600">
            Get ready for an exciting chance to win amazing rewards!
          </p>
          <button
            onClick={onStart}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full w-full transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <FaGamepad className="text-xl" />
            <span>Start Playing</span>
          </button>
        </div>
      </div>
    </div>
  );
} 