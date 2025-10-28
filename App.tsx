import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './hooks/useTheme';
import { UIProvider } from './contexts/UIContext';
import AuthModal from './components/auth/AuthModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="youthguard-theme">
        <UIProvider>
          <AuthProvider>
            <>
              <AppRouter />
              <AuthModal />
              <Toaster position="top-right" toastOptions={{
                className: 'dark:bg-dark-secondary dark:text-dark-foreground',
              }}/>
            </>
          </AuthProvider>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;