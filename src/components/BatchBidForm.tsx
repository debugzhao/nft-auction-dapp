'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Auction, BiddingStrategy } from '@/types';
import { getAllMockAuctions } from '@/utils/mockData';
import { getIPFSImageUrl } from '@/utils/ipfs';

interface BatchBidItem {
  auction: Auction;
  bidAmount: string;
  strategy: BiddingStrategy;
  selected: boolean;
}

interface BatchBidFormProps {
  onClose: () => void;
  onBatchBid: (bids: BatchBidItem[]) => void;
}

export default function BatchBidForm({ onClose, onBatchBid }: BatchBidFormProps) {
  const { address } = useAccount();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [batchItems, setBatchItems] = useState<BatchBidItem[]>([]);
  const [globalStrategy, setGlobalStrategy] = useState<BiddingStrategy>(BiddingStrategy.MANUAL);
  const [globalIncrement, setGlobalIncrement] = useState('0.001');

  useEffect(() => {
    const allAuctions = getAllMockAuctions().filter(auction => !auction.ended);
    setAuctions(allAuctions);
    
    setBatchItems(allAuctions.map(auction => ({
      auction,
      bidAmount: (parseFloat(auction.currentPrice) + 0.001).toFixed(4),
      strategy: BiddingStrategy.MANUAL,
      selected: false,
    })));
  }, []);

  const handleSelectAll = () => {
    const allSelected = batchItems.every(item => item.selected);
    setBatchItems(items => items.map(item => ({
      ...item,
      selected: !allSelected
    })));
  };

  const handleItemSelect = (index: number) => {
    setBatchItems(items => items.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleBidAmountChange = (index: number, amount: string) => {
    setBatchItems(items => items.map((item, i) => 
      i === index ? { ...item, bidAmount: amount } : item
    ));
  };

  const handleStrategyChange = (index: number, strategy: BiddingStrategy) => {
    setBatchItems(items => items.map((item, i) => 
      i === index ? { ...item, strategy } : item
    ));
  };

  const applyGlobalSettings = () => {
    setBatchItems(items => items.map(item => ({
      ...item,
      strategy: globalStrategy,
      bidAmount: item.selected ? 
        (parseFloat(item.auction.currentPrice) + parseFloat(globalIncrement)).toFixed(4) :
        item.bidAmount
    })));
  };

  const handleSubmit = () => {
    const selectedItems = batchItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('请至少选择一个拍卖');
      return;
    }
    
    onBatchBid(selectedItems);
  };

  const selectedCount = batchItems.filter(item => item.selected).length;
  const totalAmount = batchItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + parseFloat(item.bidAmount), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">批量出价</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 全局设置 */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">全局设置</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出价策略
              </label>
              <select
                value={globalStrategy}
                onChange={(e) => setGlobalStrategy(e.target.value as BiddingStrategy)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={BiddingStrategy.MANUAL}>手动出价</option>
                <option value={BiddingStrategy.LIMIT_PRICE}>限价出价</option>
                <option value={BiddingStrategy.TIME_TRIGGER}>时间触发</option>
                <option value={BiddingStrategy.AI_BIDDING}>AI 智能出价</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                加价幅度 (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={globalIncrement}
                onChange={(e) => setGlobalIncrement(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={applyGlobalSettings}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                应用全局设置
              </button>
            </div>
          </div>
        </div>

        {/* 拍卖列表 */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">选择拍卖</h3>
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {batchItems.every(item => item.selected) ? '取消全选' : '全选'}
              </button>
            </div>

            <div className="space-y-4">
              {batchItems.map((item, index) => (
                <BatchBidItem
                  key={item.auction.id}
                  item={item}
                  index={index}
                  onSelect={() => handleItemSelect(index)}
                  onBidAmountChange={(amount) => handleBidAmountChange(index, amount)}
                  onStrategyChange={(strategy) => handleStrategyChange(index, strategy)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              已选择 <span className="font-semibold">{selectedCount}</span> 个拍卖，
              总金额 <span className="font-semibold">{totalAmount.toFixed(4)} ETH</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedCount === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                批量出价 ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchBidItem({ 
  item, 
  index, 
  onSelect, 
  onBidAmountChange, 
  onStrategyChange 
}: {
  item: BatchBidItem;
  index: number;
  onSelect: () => void;
  onBidAmountChange: (amount: string) => void;
  onStrategyChange: (strategy: BiddingStrategy) => void;
}) {
  const imageUrl = item.auction.nft.image ? getIPFSImageUrl(item.auction.nft.image) : '/placeholder-nft.svg';
  const timeLeft = item.auction.endTime - Date.now() / 1000;
  const isEndingSoon = timeLeft < 3600; // 1小时内结束

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      item.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center space-x-4">
        {/* 选择框 */}
        <input
          type="checkbox"
          checked={item.selected}
          onChange={onSelect}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />

        {/* NFT 图片 */}
        <img
          src={imageUrl}
          alt={item.auction.nft.name || `NFT #${item.auction.tokenId}`}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-nft.svg';
          }}
        />

        {/* NFT 信息 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900 truncate">
            {item.auction.nft.name || `NFT #${item.auction.tokenId}`}
          </h4>
          <p className="text-sm text-gray-500">
            当前价格: {parseFloat(item.auction.currentPrice).toFixed(4)} ETH
          </p>
          <div className="flex items-center space-x-2 mt-1">
            {isEndingSoon && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                即将结束
              </span>
            )}
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {item.auction.bids.length} 次出价
            </span>
          </div>
        </div>

        {/* 出价设置 */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">出价金额 (ETH)</label>
            <input
              type="number"
              step="0.001"
              value={item.bidAmount}
              onChange={(e) => onBidAmountChange(e.target.value)}
              disabled={!item.selected}
              className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">出价策略</label>
            <select
              value={item.strategy}
              onChange={(e) => onStrategyChange(e.target.value as BiddingStrategy)}
              disabled={!item.selected}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value={BiddingStrategy.MANUAL}>手动</option>
              <option value={BiddingStrategy.LIMIT_PRICE}>限价</option>
              <option value={BiddingStrategy.TIME_TRIGGER}>时间触发</option>
              <option value={BiddingStrategy.AI_BIDDING}>AI 出价</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}