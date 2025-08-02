'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import RealTimeStats from '@/components/Dashboard/RealTimeStats';
import AuctionHeatMap from '@/components/Dashboard/AuctionHeatMap';
import BidderLeaderboard from '@/components/Dashboard/BidderLeaderboard';
import { generateMockDashboardData } from '@/utils/mockData';

export default function Dashboard() {
  const [dashboardData] = useState(() => generateMockDashboardData());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
                🚀 NFT Auction Market
              </Link>
              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                数据看板
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/create" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                创建拍卖
              </Link>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                🔄 刷新
              </button>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            高并发拍卖数据看板
          </h1>
          <p className="text-gray-600">
            实时监控 Monad 链上拍卖活动、竞价热度及网络性能
          </p>
        </div>

        {/* 实时统计 */}
        <div className="mb-8">
          <RealTimeStats 
            key={`stats-${refreshKey}`} 
            stats={dashboardData.realTimeStats} 
          />
        </div>

        {/* 网络状态 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">网络TPS</h3>
              <div className="text-2xl">⚡</div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dashboardData.networkStatus.currentTPS.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              峰值: {dashboardData.networkStatus.peakTPS.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Gas 价格</h3>
              <div className="text-2xl">⛽</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {parseFloat(dashboardData.networkStatus.gasPrice).toFixed(9)}
            </div>
            <div className="text-sm text-gray-500">ETH/Gas</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">网络延迟</h3>
              <div className="text-2xl">📡</div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {dashboardData.networkStatus.networkLatency}ms
            </div>
            <div className="text-sm text-gray-500">
              拥堵程度: {dashboardData.networkStatus.congestionLevel}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">区块高度</h3>
              <div className="text-2xl">🔗</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dashboardData.networkStatus.blockHeight.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">最新区块</div>
          </div>
        </div>

        {/* 拍卖热度图和出价排行榜 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">拍卖热度图</h3>
            <AuctionHeatMap 
              key={`heatmap-${refreshKey}`} 
              data={dashboardData.auctionHeatMap} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">出价者排行榜</h3>
            <BidderLeaderboard 
              key={`leaderboard-${refreshKey}`} 
              bidders={dashboardData.bidderLeaderboard} 
            />
          </div>
        </div>

        {/* 交易统计 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">交易统计分析</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {dashboardData.transactionStats.totalTransactions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">总交易数</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {dashboardData.transactionStats.totalVolume} ETH
              </div>
              <div className="text-sm text-gray-500">总交易额</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {dashboardData.transactionStats.averageTransactionValue} ETH
              </div>
              <div className="text-sm text-gray-500">平均交易额</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {dashboardData.transactionStats.medianTransactionValue} ETH
              </div>
              <div className="text-sm text-gray-500">交易中位数</div>
            </div>
          </div>

          {/* 价格分布 */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">价格区间分布</h4>
            <div className="space-y-3">
              {dashboardData.transactionStats.priceRangeDistribution.map((range, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">
                    {range.min} - {range.max} ETH
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${range.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {range.count} ({range.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 分类统计 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">NFT 分类统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardData.transactionStats.categoryStats.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{category.category}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">交易数量</span>
                    <span className="font-medium">{category.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">交易额</span>
                    <span className="font-medium">{category.volume} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">平均价格</span>
                    <span className="font-medium">{category.averagePrice} ETH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}