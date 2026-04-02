// src/main.tsx
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';        
import { AuthProvider } from '../library/auth';
import { AuthContext } from '../library/auth/context';
import { ToastProvider } from '../library/toast'        
import {PendingComponent} from './-pending.component'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider loading={<PendingComponent />}>
      {/* AuthContext.Consumer — это просто "передатчик" контекста авторизации в роутер */}
      <AuthContext.Consumer>
        {(authContext) => (
          <ToastProvider>
            <RouterProvider
              router={router}
              context={{
                auth: authContext,     // ← вот эта строчка важна для роутов
              }}
            />
          </ToastProvider>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  </QueryClientProvider>
);