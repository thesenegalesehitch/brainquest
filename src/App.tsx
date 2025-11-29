import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error &&
          typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const TestPage = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 50%, #0B1426 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: 'sans-serif',
    padding: '2rem'
  }}>
    <div style={{ textAlign: 'center', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠 CogniQuest++</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Step 3: AuthContext Added</p>
      <div style={{
        background: 'rgba(34, 211, 238, 0.1)',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>
          ✅ React is working<br />
          ✅ Router is working<br />
          ✅ QueryClient is working<br />
          ✅ ErrorBoundary is working<br />
          ✅ AuthContext is working
        </p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<TestPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
