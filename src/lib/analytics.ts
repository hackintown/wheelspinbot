export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    // Implement your analytics logic here
    console.log(`[Analytics] ${eventName}`, properties);
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
};
