// 用户角色枚举
export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

// 稀有度等级枚举
export enum RarityLevel {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  PLATINUM = 'platinum',
}

// 出价策略类型
export enum BiddingStrategy {
  MANUAL = 'manual',
  LIMIT_PRICE = 'limit_price',
  TIME_TRIGGER = 'time_trigger',
  AI_BIDDING = 'ai_bidding',
}

// NFT 类型定义（增强版）
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  owner: string;
  tokenURI: string;
  rarity: RarityLevel;
  rarityScore: number;
  attributes: NFTAttribute[];
  createdAt: number;
  lastUpdated: number;
}

// NFT 属性
export interface NFTAttribute {
  traitType: string;
  value: string;
  rarityBonus: number;
}

// 拍卖类型定义（增强版）
export interface Auction {
  id: string;
  tokenId: string;
  seller: string;
  startPrice: string;
  currentPrice: string;
  endTime: number;
  highestBidder: string;
  ended: boolean;
  bids: Bid[];
  nft: NFT;
  // 新增字段
  bidCount: number;
  viewCount: number;
  heat: number; // 热度值
  isHot: boolean; // 是否为热门拍卖
  settlementType: 'auto' | 'manual';
  isMultiRound: boolean; // 是否支持多轮成交
}

// 出价类型定义（增强版）
export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: string;
  timestamp: number;
  // 新增字段
  strategy: BiddingStrategy;
  isWinning: boolean;
  rarityBonus: number;
  txHash?: string;
  blockNumber?: number;
}

// 批量出价
export interface BatchBid {
  id: string;
  bidder: string;
  auctionIds: string[];
  amounts: string[];
  strategy: BiddingStrategy;
  timestamp: number;
  successCount: number;
  failureCount: number;
}

// 用户类型定义（增强版）
export interface User {
  address: string;
  balance: string;
  role: UserRole;
  auctions: Auction[];
  bids: Bid[];
  batchBids: BatchBid[];
  // 用户统计
  stats: UserStats;
  // 偏好设置
  preferences: UserPreferences;
}

// 用户统计
export interface UserStats {
  totalBids: number;
  successfulBids: number;
  totalSpent: string;
  totalEarned: string;
  rarityBonus: number;
  biddingFrequency: number; // 出价频率
  averageBidAmount: string;
  favoriteCategories: string[];
}

// 用户偏好
export interface UserPreferences {
  defaultStrategy: BiddingStrategy;
  maxBidAmount: string;
  autoRebid: boolean;
  notifications: boolean;
  gasOptimization: boolean;
}

// 创建拍卖表单类型
export interface CreateAuctionForm {
  name: string;
  description: string;
  image: File | null;
  startPrice: string;
  duration: number; // 以小时为单位
}

// 出价表单类型
export interface BidForm {
  amount: string;
}

// 拍卖状态枚举
export enum AuctionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

// 网络配置类型
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// 数据看板相关类型
export interface DashboardData {
  // 实时统计
  realTimeStats: RealTimeStats;
  // 拍卖热度数据
  auctionHeatMap: AuctionHeatData[];
  // 出价排行榜
  bidderLeaderboard: BidderRanking[];
  // 成交统计
  transactionStats: TransactionStats;
  // 网络状态
  networkStatus: NetworkStatus;
}

// 实时统计
export interface RealTimeStats {
  activeBidders: number;
  concurrentBids: number;
  totalVolume: string;
  averagePrice: string;
  successRate: number;
  peakTPS: number;
}

// 拍卖热度数据
export interface AuctionHeatData {
  auctionId: string;
  heat: number;
  bidCount: number;
  viewCount: number;
  priceChange: number;
  lastUpdated: number;
}

// 出价者排行
export interface BidderRanking {
  address: string;
  username?: string;
  totalBids: number;
  successRate: number;
  totalVolume: string;
  rarityBonus: number;
  rank: number;
  bidFrequency: number;
  profileType: 'high_frequency' | 'high_value' | 'strategic' | 'casual';
}

// 成交统计
export interface TransactionStats {
  totalTransactions: number;
  totalVolume: string;
  averageTransactionValue: string;
  medianTransactionValue: string;
  priceRangeDistribution: PriceRange[];
  timeDistribution: TimeDistribution[];
  categoryStats: CategoryStats[];
}

// 价格范围分布
export interface PriceRange {
  min: string;
  max: string;
  count: number;
  percentage: number;
}

// 时间分布
export interface TimeDistribution {
  hour: number;
  transactionCount: number;
  volume: string;
}

// 分类统计
export interface CategoryStats {
  category: string;
  count: number;
  volume: string;
  averagePrice: string;
}

// 网络状态
export interface NetworkStatus {
  currentTPS: number;
  peakTPS: number;
  averageTPS: number;
  gasPrice: string;
  blockHeight: number;
  networkLatency: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

// 稀有度系统相关
export interface RaritySystem {
  rules: RarityRule[];
  boosts: RarityBoost[];
  achievements: RarityAchievement[];
}

// 稀有度规则
export interface RarityRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  rarityBonus: number;
  isActive: boolean;
}

// 稀有度加成
export interface RarityBoost {
  id: string;
  type: 'frequency' | 'timing' | 'batch' | 'strategy';
  multiplier: number;
  description: string;
  requirements: string[];
}

// 稀有度成就
export interface RarityAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: RarityLevel;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
} 