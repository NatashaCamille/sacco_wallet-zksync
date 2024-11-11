import { useState, useEffect } from 'react';
import { createWallet } from '../services/wallet';

export const useWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const walletInstance = await createWallet();
                setWallet(walletInstance);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    return { wallet, loading, error };
};