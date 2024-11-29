"use client";
import { useEffect } from 'react';
import { DEV_CONFIG } from '@/config/development';

export default function DevelopmentWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Mock Telegram WebApp object
      window.Telegram = {
        WebApp: {
          ready: () => console.log('Mock: WebApp ready'),
          expand: () => console.log('Mock: WebApp expanded'),
          openTelegramLink: async (url: string) => {
            console.log('Mock: Opening Telegram link:', url);
            // Simulate channel join after 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
            return Promise.resolve();
          },
          initDataUnsafe: DEV_CONFIG.MOCK_TELEGRAM_DATA
        }
      };
    }
  }, []);

  return <>{children}</>;
} 