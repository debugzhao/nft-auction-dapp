'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { Bid, Auction } from '@/types';
import { getAllMockAuctions } from '@/utils/mockData';
import { getIPFSImageUrl } from '@/utils/ipfs';

export default function MyBids() {
  const { address } = useAccount();
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'won'>('active');

  useEffect(() => {
    if (address) {
      // 获取用户的出价记录
      const allAuctions = getAllMockAuctions();
      const userBids: Bid[] = [];
      const userWonAuctions: Auction[] = [];

      allAuctions.forEach(auction => {
        // 找到用户的出价
        const userBidsInAuction = auction.bids.filter(bid => 
          bid.bidder.toLowerCase() === address.toLowerCase()
        );
        userBids.push(...userBidsInAuction);

        // 检查是否获胜
        if (auction.highestBidder?.toLowerCase() === address.toLowerCase() && auction.ended) {
          userWonAuctions.push(auction);
        }
      });

      setMyBids(userBids.sort((a, b) => b.timestamp - a.timestamp));
      setWonAuctions(userWonAuctions);
    }
  }, [address]);

  const activeBids = myBids.filter(bid => {
    const allAuctions = getAllMockAuctions();
    const auction = allAuctions.find(a => a.id === bid.auctionId);
    return auction && !auction.ended && bid.isWinning;
  });

  const historyBids = myBids.filter(bid => {
    const allAuctions = getAllMockAuctions();
    const auction = allAuctions.find(a => a.id === bid.auctionId);
    return auction && (auction.ended || !bid.isWinning);
  });

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
                🚀 NFT Auction Market
              </Link>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请连接钱包</h1>
            <p className="text-gray-600 mb-8">您需要连接钱包才能查看出价记录</p>
            <WalletConnect />
          </div>
        </main>
      </div>
    );
  }

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
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                我的出价
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                数据看板
              </Link>
              <Link 
                href="/create" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                创建拍卖
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的出价</h1>
          <p className="text-gray-600">
            查看您的出价历史、当前领先拍卖和获奖NFT
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">总出价次数</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{myBids.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">当前领先</h3>
              <div className="text-2xl">🏆</div>
            </div>
            <div className="text-3xl font-bold text-green-600">{activeBids.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">获奖数量</h3>
              <div className="text-2xl">🎉</div>
            </div>
            <div className="text-3xl font-bold text-purple-600">{wonAuctions.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">总出价金额</h3>
              <div className="text-2xl">💰</div>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {myBids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0).toFixed(3)}
            </div>
            <div className="text-sm text-gray-500">ETH</div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                当前领先 ({activeBids.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                出价历史 ({historyBids.length})
              </button>
              <button
                onClick={() => setActiveTab('won')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'won'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                获奖NFT ({wonAuctions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 当前领先 */}
            {activeTab === 'active' && (
              <div>
                {activeBids.length > 0 ? (
                  <div className="space-y-4">
                    {activeBids.map((bid) => {
                      const auction = getAllMockAuctions().find(a => a.id === bid.auctionId);
                      if (!auction) return null;
                      
                      return (
                        <BidCard key={bid.id} bid={bid} auction={auction} status="leading" />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无领先拍卖</h3>
                    <p className="text-gray-500">去参与一些拍卖吧！</p>
                  </div>
                )}
              </div>
            )}

            {/* 出价历史 */}
            {activeTab === 'history' && (
              <div>
                {historyBids.length > 0 ? (
                  <div className="space-y-4">
                    {historyBids.map((bid) => {
                      const auction = getAllMockAuctions().find(a => a.id === bid.auctionId);
                      if (!auction) return null;
                      
                      const status = auction.ended ? 
                        (bid.isWinning ? 'won' : 'lost') : 
                        'outbid';
                      
                      return (
                        <BidCard key={bid.id} bid={bid} auction={auction} status={status} />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📜</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无出价历史</h3>
                    <p className="text-gray-500">开始您的第一次出价！</p>
                  </div>
                )}
              </div>
            )}

            {/* 获奖NFT */}
            {activeTab === 'won' && (
              <div>
                {wonAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wonAuctions.map((auction) => (
                      <WonNFTCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无获奖NFT</h3>
                    <p className="text-gray-500">赢得您的第一个NFT！</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BidCard({ bid, auction, status }: { 
  bid: Bid; 
  auction: Auction; 
  status: 'leading' | 'outbid' | 'won' | 'lost' 
}) {
  const imageUrl = auction.nft.image ? getIPFSImageUrl(auction.nft.image) : '/placeholder-nft.svg';
  
  const statusConfig = {
    leading: { text: '领先中', color: 'text-green-600', bg: 'bg-green-50', icon: '🎯' },
    outbid: { text: '被超越', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚠️' },
    won: { text: '已获胜', color: 'text-purple-600', bg: 'bg-purple-50', icon: '🏆' },
    lost: { text: '未中标', color: 'text-gray-600', bg: 'bg-gray-50', icon: '❌' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <img
        src={imageUrl}
        alt={auction.nft.name || `NFT #${auction.tokenId}`}
        className="w-16 h-16 object-cover rounded-lg"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-nft.svg';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-medium text-gray-900 truncate">
          {auction.nft.name || `NFT #${auction.tokenId}`}
        </h4>
        <p className="text-sm text-gray-500">
          出价时间: {new Date(bid.timestamp).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          策略: {bid.strategy === 'manual' ? '手动' : 
                 bid.strategy === 'limit_price' ? '限价' :
                 bid.strategy === 'time_trigger' ? '时间触发' : 'AI竞价'}
        </p>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {parseFloat(bid.amount).toFixed(4)} ETH
        </div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
          <span className="mr-1">{config.icon}</span>
          {config.text}
        </div>
      </div>
      
      <Link
        href={`/auction/${auction.id}`}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        查看
      </Link>
    </div>
  );
}

function WonNFTCard({ auction }: { auction: Auction }) {
  const imageUrl = auction.nft.image ? getIPFSImageUrl(auction.nft.image) : '/placeholder-nft.svg';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={imageUrl}
        alt={auction.nft.name || `NFT #${auction.tokenId}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-nft.svg';
        }}
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {auction.nft.name || `NFT #${auction.tokenId}`}
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">获胜价格</span>
            <span className="font-medium">{parseFloat(auction.currentPrice).toFixed(4)} ETH</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">稀有度</span>
            <span className={`font-medium ${
              auction.nft.rarity === 'legendary' ? 'text-purple-600' :
              auction.nft.rarity === 'epic' ? 'text-blue-600' :
              auction.nft.rarity === 'rare' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {auction.nft.rarity === 'legendary' ? '传奇' :
               auction.nft.rarity === 'epic' ? '史诗' :
               auction.nft.rarity === 'rare' ? '稀有' : '普通'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">获胜时间</span>
            <span className="font-medium">{new Date(auction.endTime * 1000).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Link
            href={`/auction/${auction.id}`}
            className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
}