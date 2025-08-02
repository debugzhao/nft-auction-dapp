'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import { getAllMockAuctions } from '@/utils/mockData';
import { getIPFSImageUrl } from '@/utils/ipfs';
import { RarityLevel } from '@/types';

export default function RarityCenter() {
  const [activeTab, setActiveTab] = useState<'rules' | 'nfts' | 'leaderboard'>('rules');
  const [rarityFilter, setRarityFilter] = useState<'all' | RarityLevel>('all');
  
  const auctions = getAllMockAuctions();
  const nfts = auctions.map(auction => auction.nft);

  const filteredNFTs = rarityFilter === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.rarity === rarityFilter);

  const rarityRules = [
    {
      title: '出价频率加成',
      icon: '⚡',
      description: '高频出价用户可获得稀有度提升机会',
      details: [
        '每小时出价 ≥ 10次：+5% 稀有度加成',
        '每小时出价 ≥ 20次：+10% 稀有度加成',
        '每小时出价 ≥ 50次：+20% 稀有度加成（高频王者）'
      ],
      bonusRange: '5% - 20%'
    },
    {
      title: '时间点策略',
      icon: '⏰',
      description: '越接近拍卖结束时间出价，稀有度提升概率越高',
      details: [
        '最后10分钟出价：+15% 稀有度概率',
        '最后5分钟出价：+25% 稀有度概率',
        '最后1分钟出价：+40% 稀有度概率（终极狙击手）'
      ],
      bonusRange: '15% - 40%'
    },
    {
      title: '批量出价奖励',
      icon: '🔄',
      description: '同时对多个NFT出价可获得特殊稀有度标签',
      details: [
        '同时出价3-5个NFT：获得"多元收藏家"标签',
        '同时出价6-10个NFT：获得"战略投资者"标签',
        '同时出价10+个NFT：获得"市场主导者"标签'
      ],
      bonusRange: '特殊标签'
    },
    {
      title: '连续竞价成就',
      icon: '🎯',
      description: '连续参与竞价可累积稀有度倍数',
      details: [
        '连续7天参与：1.2x 稀有度倍数',
        '连续15天参与：1.5x 稀有度倍数',
        '连续30天参与：2.0x 稀有度倍数（传奇收藏家）'
      ],
      bonusRange: '1.2x - 2.0x'
    }
  ];

  const rarityLevels = [
    {
      level: RarityLevel.COMMON,
      name: '普通',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      scoreRange: '0-49',
      percentage: '60%',
      count: nfts.filter(nft => nft.rarity === RarityLevel.COMMON).length
    },
    {
      level: RarityLevel.RARE,
      name: '稀有',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      scoreRange: '50-74',
      percentage: '25%',
      count: nfts.filter(nft => nft.rarity === RarityLevel.RARE).length
    },
    {
      level: RarityLevel.EPIC,
      name: '史诗',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      scoreRange: '75-89',
      percentage: '12%',
      count: nfts.filter(nft => nft.rarity === RarityLevel.EPIC).length
    },
    {
      level: RarityLevel.LEGENDARY,
      name: '传奇',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300',
      scoreRange: '90-100',
      percentage: '3%',
      count: nfts.filter(nft => nft.rarity === RarityLevel.LEGENDARY).length
    }
  ];

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
              <span className="px-3 py-1 text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-medium">
                🔮 稀有度中心
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/my-bids" 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                我的出价
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                数据看板
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            动态稀有度系统
          </h1>
          <p className="text-gray-600">
            通过高频竞价、策略性出价和批量操作提升NFT稀有度
          </p>
        </div>

        {/* 稀有度等级概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {rarityLevels.map((rarity) => (
            <div 
              key={rarity.level}
              className={`bg-white rounded-lg shadow-md p-6 border-2 ${rarity.borderColor}`}
            >
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${rarity.bgColor} ${rarity.color}`}>
                {rarity.name}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">{rarity.count}</div>
                <div className="text-sm text-gray-500">NFT数量</div>
                <div className="text-sm text-gray-600">
                  稀有分: {rarity.scoreRange}
                </div>
                <div className="text-sm text-gray-600">
                  占比: {rarity.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rules'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                稀有度规则
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'nfts'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                NFT 列表
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leaderboard'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                稀有度排行
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 稀有度规则 */}
            {activeTab === 'rules' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">动态稀有度提升机制</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {rarityRules.map((rule, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-3">{rule.icon}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{rule.title}</h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {rule.details.map((detail, i) => (
                          <div key={i} className="flex items-start">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-800">
                          加成范围: {rule.bonusRange}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 稀有度计算公式 */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">稀有度计算公式</h4>
                  <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <div className="text-center text-lg font-semibold text-purple-600 mb-2">
                      最终稀有度 = 基础稀有度 × (1 + 频率加成 + 时间加成) × 连续倍数 + 批量标签分
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• 基础稀有度: NFT固有属性决定的稀有分数 (0-60)</div>
                      <div>• 频率加成: 基于出价频率的加成百分比 (0-20%)</div>
                      <div>• 时间加成: 基于出价时机的加成百分比 (0-40%)</div>
                      <div>• 连续倍数: 基于连续参与天数的倍数 (1.0-2.0x)</div>
                      <div>• 批量标签分: 基于批量出价行为的额外分数 (0-10)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NFT 列表 */}
            {activeTab === 'nfts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">NFT 稀有度列表</h3>
                  <select
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">全部稀有度</option>
                    <option value={RarityLevel.COMMON}>普通</option>
                    <option value={RarityLevel.RARE}>稀有</option>
                    <option value={RarityLevel.EPIC}>史诗</option>
                    <option value={RarityLevel.LEGENDARY}>传奇</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNFTs.map((nft) => {
                    const rarity = rarityLevels.find(r => r.level === nft.rarity)!;
                    const imageUrl = nft.image ? getIPFSImageUrl(nft.image) : '/placeholder-nft.svg';

                    return (
                      <div key={nft.id} className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${rarity.borderColor}`}>
                        <img
                          src={imageUrl}
                          alt={nft.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-nft.svg';
                          }}
                        />
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {nft.name}
                            </h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${rarity.bgColor} ${rarity.color}`}>
                              {rarity.name}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">稀有分数</span>
                              <span className="font-semibold">{nft.rarityScore}/100</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  nft.rarity === RarityLevel.LEGENDARY ? 'bg-purple-600' :
                                  nft.rarity === RarityLevel.EPIC ? 'bg-blue-600' :
                                  nft.rarity === RarityLevel.RARE ? 'bg-green-600' : 'bg-gray-600'
                                }`}
                                style={{ width: `${nft.rarityScore}%` }}
                              ></div>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              属性数量: {nft.attributes?.length || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 稀有度排行 */}
            {activeTab === 'leaderboard' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">稀有度排行榜</h3>
                <div className="space-y-4">
                  {nfts
                    .sort((a, b) => b.rarityScore - a.rarityScore)
                    .slice(0, 10)
                    .map((nft, index) => {
                      const rarity = rarityLevels.find(r => r.level === nft.rarity)!;
                      const imageUrl = nft.image ? getIPFSImageUrl(nft.image) : '/placeholder-nft.svg';

                      return (
                        <div key={nft.id} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          <img
                            src={imageUrl}
                            alt={nft.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-nft.svg';
                            }}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium text-gray-900 truncate">
                              {nft.name}
                            </h4>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rarity.bgColor} ${rarity.color}`}>
                              {rarity.name}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">
                              {nft.rarityScore}
                            </div>
                            <div className="text-sm text-gray-500">稀有分</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}