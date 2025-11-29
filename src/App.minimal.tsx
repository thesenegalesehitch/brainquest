import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 50%, #0B1426 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠 CogniQuest++</h1>
                <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>Application is loading...</p>
                <p style={{ fontSize: '1rem', marginTop: '2rem', opacity: 0.6 }}>
                    If you see this message, the basic app is working!
                </p>
            </div>
        </div>
    );
};

export default App;
