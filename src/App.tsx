import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Application Successfully Loaded!</p>
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
          ✅ Build is successful
        </p>
      </div>
      <p style={{ fontSize: '0.9rem', marginTop: '2rem', opacity: 0.6 }}>
        If you see this, the basic infrastructure is working correctly.
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
