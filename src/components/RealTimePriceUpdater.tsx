'use client';

import { useState, useEffect, useRef } from 'react';
import { Auction } from '@/types';

interface PriceUpdate {
  auctionId: string;
  newPrice: string;
  bidder: string;
  timestamp: number;
}

interface RealTimePriceUpdaterProps {
  auctions: Auction[];
  onPriceUpdate: (update: PriceUpdate) => void;
  enabled?: boolean;
}

export default function RealTimePriceUpdater({ 
  auctions, 
  onPriceUpdate, 
  enabled = true 
}: RealTimePriceUpdaterProps) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isActive, setIsActive] = useState(enabled);

  useEffect(() => {
    if (!isActive) return;

    // 模拟实时价格更新
    intervalRef.current = setInterval(() => {
      // 随机选择一个活跃的拍卖
      const activeAuctions = auctions.filter(auction => !auction.ended);
      if (activeAuctions.length === 0) return;

      const randomAuction = activeAuctions[Math.floor(Math.random() * activeAuctions.length)];
      
      // 30% 概率发生价格更新
      if (Math.random() < 0.3) {
        const currentPrice = parseFloat(randomAuction.currentPrice);
        const increment = 0.001 + (Math.random() * 0.01); // 0.001-0.011 ETH 增幅
        const newPrice = (currentPrice + increment).toFixed(4);
        
        // 生成随机出价者地址
        const bidders = [
          '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          '0x8ba1f109551bD432803012645Hac136c772c3c3',
          '0x1234567890123456789012345678901234567890',
          '0xabcdef1234567890abcdef1234567890abcdef12',
          '0x9876543210987654321098765432109876543210',
        ];
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
        
        onPriceUpdate({
          auctionId: randomAuction.id,
          newPrice,
          bidder: randomBidder,
          timestamp: Date.now()
        });
      }
    }, 2000 + Math.random() * 3000); // 2-5秒随机间隔

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [auctions, onPriceUpdate, isActive]);

  const toggleUpdates = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <button
        onClick={toggleUpdates}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          isActive 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${
          isActive ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
        }`}></span>
        {isActive ? '实时更新中' : '已暂停'}
      </button>
    </div>
  );
}

// 价格变化动画组件
export function PriceChangeAnimation({ 
  oldPrice, 
  newPrice, 
  show 
}: { 
  oldPrice: string; 
  newPrice: string; 
  show: boolean; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const increase = parseFloat(newPrice) - parseFloat(oldPrice);

  return (
    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-10">
      <div className="animate-bounce bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        +{increase.toFixed(4)} ETH ⚡
      </div>
    </div>
  );
}

// 高频竞价指示器
export function HighFrequencyIndicator({ 
  bidCount, 
  timeWindow = 60000 // 1分钟
}: { 
  bidCount: number; 
  timeWindow?: number; 
}) {
  const isHighFrequency = bidCount >= 5; // 1分钟内5次或以上
  
  if (!isHighFrequency) return null;

  return (
    <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
      <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
      高频竞价 🔥
    </div>
  );
}

// 竞价热度可视化
export function BiddingHeatMap({ heat }: { heat: number }) {
  const getHeatColor = (heat: number) => {
    if (heat >= 90) return 'from-red-500 to-yellow-400';
    if (heat >= 70) return 'from-orange-500 to-red-400';
    if (heat >= 50) return 'from-yellow-500 to-orange-400';
    if (heat >= 30) return 'from-blue-500 to-yellow-400';
    return 'from-blue-500 to-purple-400';
  };

  const getHeatLabel = (heat: number) => {
    if (heat >= 90) return '🔥 极热';
    if (heat >= 70) return '🌡️ 很热';
    if (heat >= 50) return '🔶 较热';
    if (heat >= 30) return '🔵 温热';
    return '❄️ 冷淡';
  };

  return (
    <div className="relative">
      <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${getHeatColor(heat)} text-white rounded-full text-xs font-medium shadow-md`}>
        {getHeatLabel(heat)} {Math.round(heat)}°
      </div>
      
      {/* 热度条 */}
      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 bg-gradient-to-r ${getHeatColor(heat)} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(heat, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

// 价格趋势箭头
export function PriceTrendArrow({ 
  priceHistory 
}: { 
  priceHistory: { price: number; timestamp: number }[] 
}) {
  if (priceHistory.length < 2) return null;

  const recent = priceHistory.slice(-2);
  const trend = recent[1].price - recent[0].price;
  const trendPercentage = (trend / recent[0].price) * 100;

  if (Math.abs(trendPercentage) < 0.1) return null; // 变化太小不显示

  return (
    <div className={`inline-flex items-center ml-2 text-sm font-medium ${
      trend > 0 ? 'text-green-600' : 'text-red-600'
    }`}>
      {trend > 0 ? '↗️' : '↘️'}
      <span className="ml-1">{Math.abs(trendPercentage).toFixed(1)}%</span>
    </div>
  );
}