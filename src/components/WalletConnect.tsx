'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function WalletConnect() {
  const { isConnected } = useAccount();

  return (
    <div className="flex items-center space-x-3">
      {isConnected && (
        <Link
          href="/wallet"
          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          💼 钱包
        </Link>
      )}
      <ConnectButton 
        showBalance={true}
        chainStatus="icon"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
} 