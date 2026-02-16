import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: '#0f172a', 
      color: 'white',
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 0 20px rgba(56, 189, 248, 0.5)' }}>
        T-Subscription Tracker 
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>
        Track your subscriptions, analyze costs, and save money.
      </p>
      
      <SignInButton mode="modal">
        <button style={{ 
          padding: '15px 40px', 
          fontSize: '1.2rem', 
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '50px', 
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5)',
          fontWeight: 'bold'
        }}>
          Get Started with Google
        </button>
      </SignInButton>
    </div>
  );
}

export default Home;