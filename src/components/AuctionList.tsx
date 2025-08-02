'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAllAuctions } from '@/hooks/useAuction';
import { Auction } from '@/types';
import { getIPFSImageUrl } from '@/utils/ipfs';
import { PriceChangeAnimation, HighFrequencyIndicator, BiddingHeatMap, PriceTrendArrow } from './RealTimePriceUpdater';

interface AuctionListProps {
  auctions?: Auction[];
  priceUpdates?: { [key: string]: string };
}

export default function AuctionList({ auctions: propAuctions, priceUpdates = {} }: AuctionListProps) {
  const { auctions: hookAuctions, loading } = useAllAuctions();
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  
  // 使用传入的auctions或hook的auctions
  const auctions = propAuctions || hookAuctions;

  useEffect(() => {
    if (auctions.length > 0) {
      setFilteredAuctions(auctions.filter(auction => !auction.ended));
    }
  }, [auctions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (filteredAuctions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无拍卖</h3>
        <p className="text-gray-500">目前没有进行中的拍卖</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAuctions.map((auction) => (
        <AuctionCard 
          key={auction.id} 
          auction={auction} 
          priceUpdate={priceUpdates[auction.id]}
        />
      ))}
    </div>
  );
}

function AuctionCard({ auction, priceUpdate }: { auction: Auction; priceUpdate?: string }) {
  const imageUrl = auction.nft.image ? getIPFSImageUrl(auction.nft.image) : '/placeholder-nft.svg';
  const timeLeft = auction.endTime - Date.now() / 1000;
  const isEndingSoon = timeLeft < 3600; // 1小时内结束
  
  // 计算最近1分钟的出价次数
  const recentBids = auction.bids.filter(bid => 
    Date.now() - bid.timestamp < 60000
  ).length;
  
  // 计算热度值
  const heat = auction.heat || (auction.bids.length * 10 + recentBids * 5);
  
  // 价格历史（模拟）
  const priceHistory = auction.bids
    .slice(-5)
    .map(bid => ({ price: parseFloat(bid.amount), timestamp: bid.timestamp }));

  return (
    <Link href={`/auction/${auction.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative group">
        <div className="relative">
          <img
            src={imageUrl}
            alt={auction.nft.name}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-nft.svg';
            }}
          />
          
          {/* 价格变化动画 */}
          {priceUpdate && (
            <PriceChangeAnimation 
              oldPrice={auction.currentPrice} 
              newPrice={priceUpdate} 
              show={true} 
            />
          )}
          
          {/* 状态标签 */}
          <div className="absolute top-2 left-2 space-y-1">
            {isEndingSoon && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                ⏰ 即将结束
              </div>
            )}
            <HighFrequencyIndicator bidCount={recentBids} />
          </div>
          
          {/* 热度指示器 */}
          <div className="absolute top-2 right-2">
            <BiddingHeatMap heat={heat} />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {auction.nft.name || `NFT #${auction.tokenId}`}
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">当前价格</span>
              <div className="flex items-center">
                <span className={`font-semibold ${priceUpdate ? 'text-green-600 animate-pulse' : 'text-green-600'}`}>
                  {parseFloat(auction.currentPrice).toFixed(4)} ETH
                </span>
                <PriceTrendArrow priceHistory={priceHistory} />
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">出价者</span>
              <span className="text-sm text-gray-500 truncate max-w-32">
                {auction.highestBidder ? 
                  `${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)}` : 
                  '暂无'
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">结束时间</span>
              <span className="text-sm text-gray-500">
                {new Date(auction.endTime * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {auction.bids.length} 次出价
              </span>
              <span className="text-blue-600 font-medium">查看详情 →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 