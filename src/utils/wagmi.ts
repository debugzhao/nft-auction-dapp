import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'NFT Auction Market',
  projectId: 'demo',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

export { config }; 