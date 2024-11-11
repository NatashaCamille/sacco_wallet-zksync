import React, { createContext, useContext } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const { wallet, loading, error } = useWallet();

    return (
        <WalletContext.Provider value={{ wallet, loading, error }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);