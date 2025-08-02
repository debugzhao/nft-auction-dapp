'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { BiddingStrategy } from '@/types';

interface AutoBidConfig {
  strategy: BiddingStrategy;
  maxPrice: string;
  increment: string;
  timeThreshold: number; // 秒
  enabled: boolean;
  auctionId: string;
}

interface AutoBiddingStrategiesProps {
  auctionId: string;
  currentPrice: string;
  endTime: number;
  onAutoBid: (amount: string, strategy: BiddingStrategy) => void;
}

export default function AutoBiddingStrategies({
  auctionId,
  currentPrice,
  endTime,
  onAutoBid
}: AutoBiddingStrategiesProps) {
  const { address } = useAccount();
  const [configs, setConfigs] = useState<AutoBidConfig[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<BiddingStrategy | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 添加策略配置
  const addStrategy = (strategy: BiddingStrategy) => {
    const newConfig: AutoBidConfig = {
      strategy,
      maxPrice: (parseFloat(currentPrice) + 0.05).toFixed(4),
      increment: '0.001',
      timeThreshold: 300, // 5分钟
      enabled: false,
      auctionId
    };

    setConfigs(prev => [...prev, newConfig]);
  };

  // 更新策略配置
  const updateConfig = (index: number, updates: Partial<AutoBidConfig>) => {
    setConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, ...updates } : config
    ));
  };

  // 删除策略
  const removeStrategy = (index: number) => {
    setConfigs(prev => prev.filter((_, i) => i !== index));
  };

  // 启用/禁用策略
  const toggleStrategy = (index: number) => {
    setConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, enabled: !config.enabled } : config
    ));
  };

  // 自动出价逻辑
  useEffect(() => {
    if (!address) return;

    const activeConfigs = configs.filter(config => config.enabled);
    if (activeConfigs.length === 0) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now() / 1000;
      const timeLeft = endTime - now;

      activeConfigs.forEach(config => {
        const shouldBid = checkBiddingCondition(config, timeLeft, currentPrice);
        
        if (shouldBid) {
          const bidAmount = calculateBidAmount(config, currentPrice);
          if (bidAmount && parseFloat(bidAmount) <= parseFloat(config.maxPrice)) {
            onAutoBid(bidAmount, config.strategy);
            setActiveStrategy(config.strategy);
            
            // 短暂显示策略被触发
            setTimeout(() => setActiveStrategy(null), 3000);
          }
        }
      });
    }, 1000); // 每秒检查一次

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [configs, address, endTime, currentPrice, onAutoBid]);

  // 检查出价条件
  const checkBiddingCondition = (config: AutoBidConfig, timeLeft: number, currentPrice: string): boolean => {
    switch (config.strategy) {
      case BiddingStrategy.LIMIT_PRICE:
        // 限价策略：当前价格低于设定的最大价格时出价
        return parseFloat(currentPrice) < parseFloat(config.maxPrice) - parseFloat(config.increment);
      
      case BiddingStrategy.TIME_TRIGGER:
        // 时间触发策略：在指定时间阈值内出价
        return timeLeft <= config.timeThreshold && timeLeft > 0;
      
      case BiddingStrategy.AI_BIDDING:
        // AI策略：综合考虑价格趋势和时间
        const priceRatio = parseFloat(currentPrice) / parseFloat(config.maxPrice);
        const timeRatio = 1 - (timeLeft / (24 * 3600)); // 假设总时长24小时
        const aiScore = (1 - priceRatio) * 0.6 + timeRatio * 0.4; // 价格权重60%，时间权重40%
        return aiScore > 0.7 && Math.random() > 0.8; // 70%阈值，20%概率触发
      
      default:
        return false;
    }
  };

  // 计算出价金额
  const calculateBidAmount = (config: AutoBidConfig, currentPrice: string): string | null => {
    const current = parseFloat(currentPrice);
    const increment = parseFloat(config.increment);
    const maxPrice = parseFloat(config.maxPrice);
    
    let bidAmount = current + increment;
    
    // AI策略会根据竞争激烈程度调整出价
    if (config.strategy === BiddingStrategy.AI_BIDDING) {
      const competitiveness = Math.random(); // 模拟竞争激烈程度
      if (competitiveness > 0.7) {
        bidAmount = current + increment * 2; // 激烈竞争时加大出价
      }
    }
    
    return bidAmount <= maxPrice ? bidAmount.toFixed(4) : null;
  };

  const strategyLabels = {
    [BiddingStrategy.LIMIT_PRICE]: '限价出价',
    [BiddingStrategy.TIME_TRIGGER]: '时间触发',
    [BiddingStrategy.AI_BIDDING]: 'AI 智能出价',
    [BiddingStrategy.MANUAL]: '手动出价'
  };

  const strategyIcons = {
    [BiddingStrategy.LIMIT_PRICE]: '💰',
    [BiddingStrategy.TIME_TRIGGER]: '⏰',
    [BiddingStrategy.AI_BIDDING]: '🤖',
    [BiddingStrategy.MANUAL]: '👤'
  };

  const strategyColors = {
    [BiddingStrategy.LIMIT_PRICE]: 'text-green-600 bg-green-50 border-green-200',
    [BiddingStrategy.TIME_TRIGGER]: 'text-blue-600 bg-blue-50 border-blue-200',
    [BiddingStrategy.AI_BIDDING]: 'text-purple-600 bg-purple-50 border-purple-200',
    [BiddingStrategy.MANUAL]: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  if (!address) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">请连接钱包以使用自动出价策略</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">自动出价策略</h3>
        {activeStrategy && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium animate-pulse ${strategyColors[activeStrategy]}`}>
            🚀 {strategyLabels[activeStrategy]} 已触发
          </div>
        )}
      </div>

      {/* 策略列表 */}
      <div className="space-y-4 mb-6">
        {configs.map((config, index) => (
          <StrategyCard
            key={index}
            config={config}
            onUpdate={(updates) => updateConfig(index, updates)}
            onToggle={() => toggleStrategy(index)}
            onRemove={() => removeStrategy(index)}
          />
        ))}
      </div>

      {/* 添加策略按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => addStrategy(BiddingStrategy.LIMIT_PRICE)}
          className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <span className="mr-2">💰</span>
          添加限价策略
        </button>
        
        <button
          onClick={() => addStrategy(BiddingStrategy.TIME_TRIGGER)}
          className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <span className="mr-2">⏰</span>
          添加时间触发
        </button>
        
        <button
          onClick={() => addStrategy(BiddingStrategy.AI_BIDDING)}
          className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <span className="mr-2">🤖</span>
          添加AI策略
        </button>
      </div>

      {/* 策略说明 */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">策略说明</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>限价出价</strong>：在指定价格范围内自动出价</li>
          <li>• <strong>时间触发</strong>：在拍卖即将结束时自动出价</li>
          <li>• <strong>AI智能出价</strong>：基于价格趋势和时间智能决策</li>
        </ul>
      </div>
    </div>
  );
}

function StrategyCard({
  config,
  onUpdate,
  onToggle,
  onRemove
}: {
  config: AutoBidConfig;
  onUpdate: (updates: Partial<AutoBidConfig>) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const strategyLabels = {
    [BiddingStrategy.LIMIT_PRICE]: '限价出价',
    [BiddingStrategy.TIME_TRIGGER]: '时间触发',
    [BiddingStrategy.AI_BIDDING]: 'AI 智能出价',
    [BiddingStrategy.MANUAL]: '手动出价'
  };

  const strategyIcons = {
    [BiddingStrategy.LIMIT_PRICE]: '💰',
    [BiddingStrategy.TIME_TRIGGER]: '⏰',
    [BiddingStrategy.AI_BIDDING]: '🤖',
    [BiddingStrategy.MANUAL]: '👤'
  };

  const strategyColors = {
    [BiddingStrategy.LIMIT_PRICE]: 'border-green-200 bg-green-50',
    [BiddingStrategy.TIME_TRIGGER]: 'border-blue-200 bg-blue-50',
    [BiddingStrategy.AI_BIDDING]: 'border-purple-200 bg-purple-50',
    [BiddingStrategy.MANUAL]: 'border-gray-200 bg-gray-50'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${config.enabled ? strategyColors[config.strategy] : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{strategyIcons[config.strategy]}</span>
          <h4 className="font-medium text-gray-900">{strategyLabels[config.strategy]}</h4>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 p-1"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            最大价格 (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            value={config.maxPrice}
            onChange={(e) => onUpdate({ maxPrice: e.target.value })}
            disabled={!config.enabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.strategy === BiddingStrategy.TIME_TRIGGER ? '触发时间 (秒)' : '出价增量 (ETH)'}
          </label>
          {config.strategy === BiddingStrategy.TIME_TRIGGER ? (
            <input
              type="number"
              value={config.timeThreshold}
              onChange={(e) => onUpdate({ timeThreshold: parseInt(e.target.value) })}
              disabled={!config.enabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          ) : (
            <input
              type="number"
              step="0.001"
              value={config.increment}
              onChange={(e) => onUpdate({ increment: e.target.value })}
              disabled={!config.enabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          )}
        </div>

        <div className="flex items-end">
          <div className="w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">状态</div>
            <div className={`px-3 py-2 rounded-md text-sm font-medium ${
              config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {config.enabled ? '🟢 已启用' : '⚪ 已禁用'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}