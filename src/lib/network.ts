export const isRetriableError = (error: unknown) => {
   const message =
      error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

   return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('failed to fetch') ||
      message.includes('ecconn') ||
      message.includes('temporary')
   );
};

