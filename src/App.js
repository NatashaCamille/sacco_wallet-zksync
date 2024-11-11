import React from 'react';
import './App.css';
import { Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/auth/Signup';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
    </WalletProvider>
    
  );
}

export default App;
