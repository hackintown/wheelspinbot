export const logger = {
  error: (error: Error, context?: object) => {
    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      ...context
    });
  },
  info: (message: string, context?: object) => {
    console.log({
      timestamp: new Date().toISOString(),
      message,
      ...context
    });
  }
}; 