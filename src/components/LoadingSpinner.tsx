import { FaSpinner } from 'react-icons/fa';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
