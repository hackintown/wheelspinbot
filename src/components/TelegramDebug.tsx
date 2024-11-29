import { useEffect, useState } from 'react';

export default function TelegramDebug() {
  const [debug, setDebug] = useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setDebug({
        telegram: !!window.Telegram,
        webApp: !!window.Telegram?.WebApp,
        userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
        initData: window.Telegram?.WebApp?.initDataUnsafe,
        timestamp: new Date().toISOString()
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-4 text-xs">
      <pre>{JSON.stringify(debug, null, 2)}</pre>
    </div>
  );
} 