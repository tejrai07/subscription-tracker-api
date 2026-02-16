import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Dashboard from './Dashboard';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* If user is at root URL "/" */}
        <Route path="/" element={
          <>
            <SignedIn>
              <Dashboard /> {/* If logged in, show Tracker */}
            </SignedIn>
            <SignedOut>
              <Home />      {/* If logged out, show Welcome */}
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;