'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuction } from '@/hooks/useAuction';
import { getIPFSImageUrl } from '@/utils/ipfs';
import BidForm from '@/components/BidForm';
import CountdownTimer from '@/components/CountdownTimer';
import WalletConnect from '@/components/WalletConnect';
import AutoBiddingStrategies from '@/components/AutoBiddingStrategies';

export default function AuctionDetail() {
  const params = useParams();
  const auctionId = params.id as string;
  const { auction, loading } = useAuction(auctionId);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBidSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAutoBid = (amount: string, strategy: any) => {
    console.log('自动出价:', { amount, strategy, auctionId });
    // 这里实现自动出价逻辑
    // 实际项目中会调用智能合约
    handleBidSuccess();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">拍卖不存在</h2>
          <p className="text-gray-600 mb-4">该拍卖可能已被删除或不存在</p>
          <Link 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = auction.nft.image ? getIPFSImageUrl(auction.nft.image) : '/placeholder-nft.png';
  const isEnded = auction.ended || Date.now() / 1000 > auction.endTime;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
                🚀 NFT Auction Market
              </Link>
            </div>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：NFT 图片和信息 */}
          <div className="space-y-6">
            {/* NFT 图片 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={imageUrl}
                alt={auction.nft.name || `NFT #${auction.tokenId}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-nft.svg';
                }}
              />
            </div>

            {/* NFT 信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {auction.nft.name || `NFT #${auction.tokenId}`}
              </h2>
              
              {auction.nft.description && (
                <p className="text-gray-600 mb-4">{auction.nft.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID</span>
                  <span className="font-medium">{auction.tokenId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">卖家</span>
                  <span className="font-medium text-sm">
                    {auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">起拍价</span>
                  <span className="font-medium">{parseFloat(auction.startPrice).toFixed(4)} ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：拍卖信息和出价 */}
          <div className="space-y-6">
            {/* 倒计时 */}
            <CountdownTimer 
              endTime={auction.endTime} 
              onEnd={() => setRefreshKey(prev => prev + 1)}
            />

            {/* 当前价格 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">当前价格</h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600">
                  {parseFloat(auction.currentPrice).toFixed(4)} ETH
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  最高出价者: {auction.highestBidder ? 
                    `${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)}` : 
                    '暂无'
                  }
                </div>
              </div>

              {/* 出价历史 */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">出价历史</h4>
                {auction.bids.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {auction.bids.slice(-5).reverse().map((bid) => (
                      <div key={bid.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                        </span>
                        <span className="font-medium">
                          {parseFloat(bid.amount).toFixed(4)} ETH
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">暂无出价记录</p>
                )}
              </div>
            </div>

            {/* 出价表单 */}
            {!isEnded && (
              <>
                <BidForm auction={auction} onBidSuccess={handleBidSuccess} />
                
                {/* 自动出价策略 */}
                <AutoBiddingStrategies
                  auctionId={auction.id}
                  currentPrice={auction.currentPrice}
                  endTime={auction.endTime}
                  onAutoBid={handleAutoBid}
                />
              </>
            )}

            {/* 拍卖结束状态 */}
            {isEnded && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏁</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">拍卖已结束</h3>
                  {auction.highestBidder ? (
                    <p className="text-gray-600">
                      获胜者: {auction.highestBidder.slice(0, 6)}...{auction.highestBidder.slice(-4)}
                    </p>
                  ) : (
                    <p className="text-gray-600">无人出价</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 