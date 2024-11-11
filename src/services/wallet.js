import { SaccoWallet } from './SaccoWallet';
// import { SACCO_CONTRACT_ADDRESS } from '../contracts/addresses';

export const createWallet = async () => {
    const wallet = new SaccoWallet();
    await wallet.initialize();
    return wallet;
};