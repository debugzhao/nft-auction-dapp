'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePlaceBid } from '@/hooks/useAuction';
import { Auction } from '@/types';

interface BidFormProps {
  auction: Auction;
  onBidSuccess?: () => void;
}

export default function BidForm({ auction, onBidSuccess }: BidFormProps) {
  const { address } = useAccount();
  const { placeBid, isBidding, isSuccess } = usePlaceBid();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  const currentPrice = parseFloat(auction.currentPrice);
  const minBidAmount = currentPrice + 0.001; // 最小加价0.001 ETH

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('请先连接钱包');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('请输入有效的出价金额');
      return;
    }

    if (amount <= currentPrice) {
      setError(`出价必须高于当前价格 ${currentPrice.toFixed(4)} ETH`);
      return;
    }

    if (amount < minBidAmount) {
      setError(`最小出价金额为 ${minBidAmount.toFixed(4)} ETH`);
      return;
    }

    try {
      await placeBid(auction.id, bidAmount);
    } catch (error) {
      setError('出价失败，请重试');
    }
  };

  const handleQuickBid = (percentage: number) => {
    const quickAmount = currentPrice * (1 + percentage);
    setBidAmount(quickAmount.toFixed(4));
  };

  if (isSuccess && onBidSuccess) {
    onBidSuccess();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">参与竞价</h3>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">当前价格</span>
          <span className="text-xl font-bold text-green-600">
            {currentPrice.toFixed(4)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">最小出价</span>
          <span className="text-sm text-gray-500">
            {minBidAmount.toFixed(4)} ETH
          </span>
        </div>
      </div>

      <form onSubmit={handleBid} className="space-y-4">
        <div>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
            出价金额 (ETH)
          </label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            step="0.001"
            min={minBidAmount}
            placeholder={`最小 ${minBidAmount.toFixed(4)} ETH`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* 快速出价按钮 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickBid(0.05)}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            +5%
          </button>
          <button
            type="button"
            onClick={() => handleQuickBid(0.1)}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            +10%
          </button>
          <button
            type="button"
            onClick={() => handleQuickBid(0.2)}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            +20%
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isBidding || !address}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isBidding ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              处理中...
            </div>
          ) : !address ? (
            '请先连接钱包'
          ) : (
            '立即出价'
          )}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">出价成功！</p>
        </div>
      )}
    </div>
  );
} 