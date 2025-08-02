'use client';

import { useEffect, useState } from 'react';
import { RealTimeStats as RealTimeStatsType } from '@/types';
import { generateMockDashboardData } from '@/utils/mockData';

interface RealTimeStatsProps {
  stats?: RealTimeStatsType;
}

export default function RealTimeStats({ stats: propStats }: RealTimeStatsProps) {
  const [stats, setStats] = useState<RealTimeStatsType | null>(propStats || null);
  const [loading, setLoading] = useState(!propStats);

  useEffect(() => {
    // 模拟数据加载
    const loadStats = () => {
      const dashboardData = generateMockDashboardData();
      setStats(dashboardData.realTimeStats);
      setLoading(false);
    };

    loadStats();

    // 每5秒更新一次数据
    const interval = setInterval(() => {
      const dashboardData = generateMockDashboardData();
      // 添加一些随机变化
      const updatedStats = {
        ...dashboardData.realTimeStats,
        activeBidders: dashboardData.realTimeStats.activeBidders + Math.floor(Math.random() * 10 - 5),
        concurrentBids: Math.max(0, dashboardData.realTimeStats.concurrentBids + Math.floor(Math.random() * 6 - 3)),
        peakTPS: dashboardData.realTimeStats.peakTPS + Math.floor(Math.random() * 100 - 50),
      };
      setStats(updatedStats);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        title="活跃竞价者"
        value={stats.activeBidders.toString()}
        icon="👥"
        trend="+5.2%"
        color="text-blue-600"
      />
      
      <StatCard
        title="并发出价"
        value={stats.concurrentBids.toString()}
        icon="⚡"
        trend="+12.8%"
        color="text-green-600"
        pulse={stats.concurrentBids > 20}
      />
      
      <StatCard
        title="总交易量"
        value={`${stats.totalVolume} ETH`}
        icon="💰"
        trend="+8.4%"
        color="text-purple-600"
      />
      
      <StatCard
        title="平均价格"
        value={`${stats.averagePrice} ETH`}
        icon="📊"
        trend="+3.7%"
        color="text-orange-600"
      />
      
      <StatCard
        title="成功率"
        value={`${stats.successRate}%`}
        icon="🎯"
        trend="+1.2%"
        color="text-emerald-600"
      />
      
      <StatCard
        title="峰值 TPS"
        value={stats.peakTPS.toString()}
        icon="🚀"
        trend="+15.6%"
        color="text-red-600"
        pulse={stats.peakTPS > 1200}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
  pulse?: boolean;
}

function StatCard({ title, value, icon, trend, color, pulse }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${pulse ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-2xl font-bold ${color}`}>
            {value}
          </div>
          <div className="text-xs text-green-500 font-medium">
            {trend}
          </div>
        </div>
      </div>
    </div>
  );
}