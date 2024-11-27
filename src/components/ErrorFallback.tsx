import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-center mb-4">Something went wrong</h2>
        <p className="text-gray-600 text-center mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
