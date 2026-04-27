import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { isRetriableError } from '../lib/network';

const client = new QueryClient({
   defaultOptions: {
      queries: {
         retry(failureCount, error) {
            return failureCount < 2 && isRetriableError(error);
         },
         retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
         refetchOnReconnect: true,
      },
      mutations: {
         retry(failureCount, error) {
            return failureCount < 1 && isRetriableError(error);
         },
      },
   },
});

export default function QueryProvider({ children }: PropsWithChildren) {
   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
