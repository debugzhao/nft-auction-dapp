'use client';

import { useEffect, useState } from 'react';
import { AuctionHeatData } from '@/types';
import { generateMockDashboardData } from '@/utils/mockData';

interface AuctionHeatMapProps {
  data?: AuctionHeatData[];
}

export default function AuctionHeatMap({ data: propData }: AuctionHeatMapProps) {
  const [heatData, setHeatData] = useState<AuctionHeatData[]>(propData || []);
  const [loading, setLoading] = useState(!propData);

  useEffect(() => {
    const loadHeatData = () => {
      const dashboardData = generateMockDashboardData();
      setHeatData(dashboardData.auctionHeatMap);
      setLoading(false);
    };

    loadHeatData();

    // 每3秒更新热度数据
    const interval = setInterval(() => {
      const dashboardData = generateMockDashboardData();
      const updatedHeatData = dashboardData.auctionHeatMap.map(item => ({
        ...item,
        heat: Math.max(0, item.heat + Math.floor(Math.random() * 10 - 5)),
        priceChange: item.priceChange + Math.random() * 4 - 2,
        lastUpdated: Date.now(),
      }));
      setHeatData(updatedHeatData);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const maxHeat = Math.max(...heatData.map(item => item.heat));
  const minHeat = Math.min(...heatData.map(item => item.heat));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">拍卖热度图</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>低</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <div className="w-4 h-4 bg-red-600 rounded"></div>
          </div>
          <span>高</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {heatData.map((item) => (
          <HeatTile
            key={item.auctionId}
            data={item}
            intensity={normalizeHeat(item.heat, minHeat, maxHeat)}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600">最热拍卖</div>
          <div className="font-semibold">
            #{heatData.reduce((max, item) => item.heat > max.heat ? item : max, heatData[0])?.auctionId}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600">平均热度</div>
          <div className="font-semibold">
            {(heatData.reduce((sum, item) => sum + item.heat, 0) / heatData.length).toFixed(1)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-gray-600">活跃拍卖</div>
          <div className="font-semibold">
            {heatData.filter(item => item.heat > 80).length}/{heatData.length}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeatTileProps {
  data: AuctionHeatData;
  intensity: number;
}

function HeatTile({ data, intensity }: HeatTileProps) {
  const getHeatColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-blue-200 border-blue-300';
    if (intensity < 0.4) return 'bg-blue-400 border-blue-500';
    if (intensity < 0.6) return 'bg-blue-600 border-blue-700';
    if (intensity < 0.8) return 'bg-red-400 border-red-500';
    return 'bg-red-600 border-red-700 animate-pulse';
  };

  const isRecent = Date.now() - data.lastUpdated < 30000; // 30秒内为最近更新

  return (
    <div 
      className={`
        ${getHeatColor(intensity)}
        rounded-lg border-2 p-4 transition-all duration-300 hover:scale-105 cursor-pointer
        ${isRecent ? 'ring-2 ring-yellow-400' : ''}
      `}
    >
      <div className="text-white">
        <div className="text-xs font-medium mb-1">拍卖 #{data.auctionId}</div>
        <div className="text-lg font-bold mb-2">{data.heat.toFixed(0)}°</div>
        
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>出价:</span>
            <span>{data.bidCount}</span>
          </div>
          <div className="flex justify-between">
            <span>浏览:</span>
            <span>{data.viewCount}</span>
          </div>
          <div className="flex justify-between">
            <span>涨幅:</span>
            <span className={data.priceChange >= 0 ? 'text-green-200' : 'text-red-200'}>
              {data.priceChange >= 0 ? '+' : ''}{data.priceChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeHeat(value: number, min: number, max: number): number {
  return max === min ? 0.5 : (value - min) / (max - min);
}