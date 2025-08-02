'use client';

import { useEffect, useState } from 'react';
import { BidderRanking } from '@/types';
import { generateMockDashboardData } from '@/utils/mockData';

interface BidderLeaderboardProps {
  bidders?: BidderRanking[];
}

export default function BidderLeaderboard({ bidders: propBidders }: BidderLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<BidderRanking[]>(propBidders || []);
  const [loading, setLoading] = useState(!propBidders);

  useEffect(() => {
    const loadLeaderboard = () => {
      const dashboardData = generateMockDashboardData();
      setLeaderboard(dashboardData.bidderLeaderboard);
      setLoading(false);
    };

    loadLeaderboard();

    // 每10秒更新排行榜
    const interval = setInterval(() => {
      const dashboardData = generateMockDashboardData();
      setLeaderboard(dashboardData.bidderLeaderboard);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">出价者排行榜</h3>
        <div className="text-sm text-gray-500">
          实时更新 • 基于总出价量
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.map((bidder, index) => (
          <BidderCard key={bidder.address} bidder={bidder} />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">总用户</div>
            <div className="font-semibold text-lg">1,247</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">活跃用户</div>
            <div className="font-semibold text-lg">387</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">高频用户</div>
            <div className="font-semibold text-lg">89</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">策略用户</div>
            <div className="font-semibold text-lg">156</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BidderCardProps {
  bidder: BidderRanking;
}

function BidderCard({ bidder }: BidderCardProps) {
  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'high_frequency': return '⚡';
      case 'high_value': return '💎';
      case 'strategic': return '🎯';
      case 'casual': return '🎮';
      default: return '👤';
    }
  };

  const getProfileColor = (type: string) => {
    switch (type) {
      case 'high_frequency': return 'text-yellow-600 bg-yellow-100';
      case 'high_value': return 'text-purple-600 bg-purple-100';
      case 'strategic': return 'text-blue-600 bg-blue-100';
      case 'casual': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
        <span className="text-lg">{getRankIcon(bidder.rank)}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <div className="font-medium text-gray-900 truncate">
            {bidder.username || `${bidder.address.slice(0, 6)}...${bidder.address.slice(-4)}`}
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProfileColor(bidder.profileType)}`}>
            {getProfileIcon(bidder.profileType)}
            {bidder.profileType.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
          <span>出价: {bidder.totalBids}</span>
          <span>成功率: {bidder.successRate}%</span>
          <span>频率: {bidder.bidFrequency}/天</span>
        </div>
      </div>

      <div className="text-right">
        <div className="font-semibold text-gray-900">
          {bidder.totalVolume} ETH
        </div>
        <div className="text-sm text-gray-500">
          稀有度: +{bidder.rarityBonus.toFixed(1)}
        </div>
      </div>
    </div>
  );
}