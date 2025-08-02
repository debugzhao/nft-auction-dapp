'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';

interface GasSettings {
  strategy: 'eco' | 'standard' | 'fast' | 'custom';
  customGasPrice: string;
  maxPriorityFee: string;
  gasLimit: string;
  autoOptimize: boolean;
}

export default function WalletManagement() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  
  const [gasSettings, setGasSettings] = useState<GasSettings>({
    strategy: 'standard',
    customGasPrice: '20',
    maxPriorityFee: '2',
    gasLimit: '300000',
    autoOptimize: true,
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'gas' | 'security'>('overview');
  const [transactionHistory, setTransactionHistory] = useState([
    {
      id: '1',
      type: 'bid',
      amount: '0.0156',
      status: 'confirmed',
      timestamp: Date.now() - 3600000,
      gasUsed: '21000',
      gasFee: '0.00042'
    },
    {
      id: '2', 
      type: 'create_auction',
      amount: '0',
      status: 'confirmed',
      timestamp: Date.now() - 7200000,
      gasUsed: '120000',
      gasFee: '0.0024'
    },
    {
      id: '3',
      type: 'bid',
      amount: '0.0234',
      status: 'pending',
      timestamp: Date.now() - 300000,
      gasUsed: '-',
      gasFee: '0.00063'
    }
  ]);

  const gasStrategies = [
    {
      type: 'eco' as const,
      name: '经济模式',
      description: '最低Gas费用，交易可能较慢',
      estimatedTime: '5-10分钟',
      gasPrice: '15 Gwei',
      icon: '🐌',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'standard' as const,
      name: '标准模式',
      description: '平衡的Gas费用和速度',
      estimatedTime: '2-5分钟',
      gasPrice: '25 Gwei',
      icon: '⚡',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'fast' as const,
      name: '快速模式',
      description: '更高Gas费用，更快确认',
      estimatedTime: '1-2分钟',
      gasPrice: '35 Gwei',
      icon: '🚀',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      type: 'custom' as const,
      name: '自定义',
      description: '手动设置Gas参数',
      estimatedTime: '根据设置',
      gasPrice: '自定义',
      icon: '⚙️',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleGasSettingsChange = (key: keyof GasSettings, value: any) => {
    setGasSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // 保存设置到本地存储
    localStorage.setItem('gasSettings', JSON.stringify(gasSettings));
    alert('设置已保存！');
  };

  useEffect(() => {
    // 从本地存储加载设置
    const saved = localStorage.getItem('gasSettings');
    if (saved) {
      setGasSettings(JSON.parse(saved));
    }
  }, []);

  if (!isConnected) {
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
            <div className="text-6xl mb-4">💼</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">钱包管理</h1>
            <p className="text-gray-600 mb-8">请先连接钱包以管理您的账户设置</p>
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
              <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full font-medium">
                💼 钱包管理
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/rarity" 
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                🔮 稀有度
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">钱包管理</h1>
          <p className="text-gray-600">
            管理您的钱包连接、Gas优化设置和交易安全
          </p>
        </div>

        {/* 钱包概览卡片 */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">当前钱包</h2>
              <p className="text-blue-100 font-mono text-sm mb-4">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <div className="text-3xl font-bold">
                {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} {balance?.symbol || 'ETH'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">💎</div>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors"
              >
                断开连接
              </button>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                账户概览
              </button>
              <button
                onClick={() => setActiveTab('gas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'gas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gas 优化
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                安全设置
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 账户概览 */}
            {activeTab === 'overview' && (
              <div>
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-900">总交易次数</h3>
                      <div className="text-2xl">📊</div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mt-2">{transactionHistory.length}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-green-900">总Gas费用</h3>
                      <div className="text-2xl">⛽</div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {transactionHistory.reduce((sum, tx) => sum + parseFloat(tx.gasFee), 0).toFixed(5)} ETH
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-purple-900">总出价金额</h3>
                      <div className="text-2xl">💰</div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mt-2">
                      {transactionHistory
                        .filter(tx => tx.type === 'bid')
                        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                        .toFixed(4)} ETH
                    </div>
                  </div>
                </div>

                {/* 交易历史 */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">最近交易</h3>
                <div className="space-y-4">
                  {transactionHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'bid' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {tx.type === 'bid' ? '💰' : '🏗️'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {tx.type === 'bid' ? '拍卖出价' : '创建拍卖'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {tx.amount !== '0' && `${tx.amount} ETH`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Gas: {tx.gasFee} ETH
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'confirmed' ? '✅ 已确认' :
                           tx.status === 'pending' ? '⏳ 待确认' : '❌ 失败'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gas 优化 */}
            {activeTab === 'gas' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Gas 费用优化设置</h3>
                
                {/* Gas策略选择 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {gasStrategies.map((strategy) => (
                    <div
                      key={strategy.type}
                      onClick={() => handleGasSettingsChange('strategy', strategy.type)}
                      className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
                        gasSettings.strategy === strategy.type
                          ? `${strategy.borderColor} ${strategy.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{strategy.icon}</div>
                          <h4 className={`font-semibold ${
                            gasSettings.strategy === strategy.type ? strategy.color : 'text-gray-900'
                          }`}>
                            {strategy.name}
                          </h4>
                        </div>
                        <input
                          type="radio"
                          checked={gasSettings.strategy === strategy.type}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>预计时间: {strategy.estimatedTime}</div>
                        <div>Gas价格: {strategy.gasPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 自定义Gas设置 */}
                {gasSettings.strategy === 'custom' && (
                  <div className="bg-purple-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-purple-900 mb-4">自定义Gas参数</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gas Price (Gwei)
                        </label>
                        <input
                          type="number"
                          value={gasSettings.customGasPrice}
                          onChange={(e) => handleGasSettingsChange('customGasPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Priority Fee (Gwei)
                        </label>
                        <input
                          type="number"
                          value={gasSettings.maxPriorityFee}
                          onChange={(e) => handleGasSettingsChange('maxPriorityFee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gas Limit
                        </label>
                        <input
                          type="number"
                          value={gasSettings.gasLimit}
                          onChange={(e) => handleGasSettingsChange('gasLimit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 自动优化选项 */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">智能Gas优化</h4>
                      <p className="text-sm text-blue-700">根据网络状况自动调整Gas设置</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gasSettings.autoOptimize}
                        onChange={(e) => handleGasSettingsChange('autoOptimize', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  保存Gas设置
                </button>
              </div>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">安全设置</h3>
                
                <div className="space-y-6">
                  {/* 钱包安全 */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">🛡️</div>
                      <div>
                        <h4 className="font-semibold text-green-900">钱包安全状态</h4>
                        <p className="text-sm text-green-700">您的钱包连接是安全的</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        HTTPS 安全连接
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        钱包已验证
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        域名验证通过
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        SSL证书有效
                      </div>
                    </div>
                  </div>

                  {/* 交易限制 */}
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">⚠️</div>
                      <div>
                        <h4 className="font-semibold text-yellow-900">交易安全提醒</h4>
                        <p className="text-sm text-yellow-700">建议的安全实践</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• 始终验证合约地址和交易详情</li>
                      <li>• 不要连接到可疑的DApp</li>
                      <li>• 定期检查已授权的合约权限</li>
                      <li>• 使用硬件钱包提高安全性</li>
                      <li>• 备份您的助记词并安全存储</li>
                    </ul>
                  </div>

                  {/* 已授权合约 */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">已授权合约</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">NFT Auction Contract</div>
                          <div className="text-sm text-gray-500">0x1234...5678</div>
                        </div>
                        <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                          撤销授权
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Simple NFT Contract</div>
                          <div className="text-sm text-gray-500">0xabcd...efgh</div>
                        </div>
                        <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                          撤销授权
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}