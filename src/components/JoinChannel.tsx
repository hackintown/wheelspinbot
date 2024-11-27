import { FaTelegram } from 'react-icons/fa';

interface Props {
  onJoinChannel: () => void;
  isLoading: boolean;
}

export default function JoinChannel({ onJoinChannel, isLoading }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Spin & Win!
          </h1>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 font-semibold">
              Join our channel and get 3 FREE spins!
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={onJoinChannel}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full w-full transform transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
            >
              <FaTelegram className="text-xl" />
              <span>{isLoading ? 'Verifying...' : 'Join Channel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 