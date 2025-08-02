import { Auction, NFT, Bid, RarityLevel, BiddingStrategy, UserRole, DashboardData, RealTimeStats, AuctionHeatData, BidderRanking, TransactionStats, NetworkStatus, NFTAttribute } from '@/types';

// 生成模拟的NFT数据
export function generateMockNFTs(): NFT[] {
  const attributes1: NFTAttribute[] = [
    { traitType: 'Background', value: 'Cosmic Nebula', rarityBonus: 15 },
    { traitType: 'Eyes', value: 'Starlight', rarityBonus: 25 },
    { traitType: 'Weapon', value: 'Plasma Sword', rarityBonus: 30 },
  ];

  const attributes2: NFTAttribute[] = [
    { traitType: 'Background', value: 'Digital Matrix', rarityBonus: 20 },
    { traitType: 'Style', value: 'Cyberpunk', rarityBonus: 35 },
    { traitType: 'Aura', value: 'Neon Glow', rarityBonus: 15 },
  ];

  const attributes3: NFTAttribute[] = [
    { traitType: 'Architecture', value: 'Futuristic Towers', rarityBonus: 18 },
    { traitType: 'Lighting', value: 'Neon Signs', rarityBonus: 22 },
    { traitType: 'Weather', value: 'Rain Storm', rarityBonus: 28 },
  ];

  return [
    {
      id: '1',
      name: 'Cosmic Explorer #001',
      description: '一个神秘的宇宙探索者，拥有独特的星云背景，高频竞价可提升其稀有度',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      tokenId: '1',
      owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      tokenURI: 'ipfs://QmExample1',
      rarity: RarityLevel.RARE,
      rarityScore: 70,
      attributes: attributes1,
      createdAt: Date.now() - 86400000,
      lastUpdated: Date.now() - 3600000,
    },
    {
      id: '2',
      name: 'Digital Dreamer #042',
      description: '数字艺术家的梦想之作，融合了现实与虚拟，批量出价用户可获得特殊加成',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      tokenId: '2',
      owner: '0x8ba1f109551bD432803012645Hac136c772c3c3',
      tokenURI: 'ipfs://QmExample2',
      rarity: RarityLevel.EPIC,
      rarityScore: 85,
      attributes: attributes2,
      createdAt: Date.now() - 172800000,
      lastUpdated: Date.now() - 1800000,
    },
    {
      id: '3',
      name: 'Neon City #133',
      description: '赛博朋克风格的城市夜景，充满未来感，终局出价者有机会获得传奇级稀有度',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      tokenId: '3',
      owner: '0x1234567890123456789012345678901234567890',
      tokenURI: 'ipfs://QmExample3',
      rarity: RarityLevel.LEGENDARY,
      rarityScore: 95,
      attributes: attributes3,
      createdAt: Date.now() - 259200000,
      lastUpdated: Date.now() - 900000,
    },
  ];
}

// 生成模拟的出价数据
export function generateMockBids(auctionId: string): Bid[] {
  const bidders = [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x8ba1f109551bD432803012645Hac136c772c3c3',
    '0x1234567890123456789012345678901234567890',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x9876543210987654321098765432109876543210',
    '0xfedcba0987654321fedcba0987654321fedcba09',
  ];

  const strategies = [
    BiddingStrategy.MANUAL,
    BiddingStrategy.LIMIT_PRICE,
    BiddingStrategy.TIME_TRIGGER,
    BiddingStrategy.AI_BIDDING,
  ];

  const bids: Bid[] = [];
  let currentPrice = 0.001;
  const baseTime = Date.now() - 3600000; // 1小时前开始

  for (let i = 0; i < 12; i++) {
    const bidder = bidders[i % bidders.length];
    const strategy = strategies[i % strategies.length];
    const amount = currentPrice + (Math.random() * 0.01);
    const rarityBonus = Math.random() * 10;
    currentPrice = amount;

    bids.push({
      id: `${auctionId}-bid-${i}`,
      auctionId,
      bidder,
      amount: amount.toFixed(4),
      timestamp: baseTime + (i * 300000), // 每5分钟一个出价
      strategy,
      isWinning: i === 11, // 最后一个是获胜出价
      rarityBonus,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: 1000000 + i,
    });
  }

  return bids.sort((a, b) => b.timestamp - a.timestamp);
}

// 生成模拟的拍卖数据
export function generateMockAuctions(): Auction[] {
  const nfts = generateMockNFTs();
  const auctions: Auction[] = [];

  nfts.forEach((nft, index) => {
    const startPrice = (0.001 + index * 0.002).toFixed(4);
    const currentPrice = (parseFloat(startPrice) + Math.random() * 0.01).toFixed(4);
    const endTime = Math.floor(Date.now() / 1000) + (3600 * (index + 1)); // 1-3小时后结束
    const bids = generateMockBids((index + 1).toString());
    const highestBidder = bids.length > 0 ? bids[0].bidder : '';
    
    // 计算热度值
    const heat = bids.length * 10 + Math.random() * 50;
    const isHot = heat > 80;

    auctions.push({
      id: (index + 1).toString(),
      tokenId: nft.tokenId,
      seller: nft.owner,
      startPrice,
      currentPrice,
      endTime,
      highestBidder,
      ended: false,
      bids,
      nft,
      // 新增字段
      bidCount: bids.length,
      viewCount: Math.floor(Math.random() * 500) + 100,
      heat,
      isHot,
      settlementType: index % 2 === 0 ? 'auto' : 'manual',
      isMultiRound: index === 2, // 第三个拍卖支持多轮成交
    });
  });

  return auctions;
}

// 获取单个模拟拍卖
export function getMockAuction(id: string): Auction | null {
  const auctions = generateMockAuctions();
  return auctions.find(auction => auction.id === id) || null;
}

// 获取所有模拟拍卖
export function getAllMockAuctions(): Auction[] {
  return generateMockAuctions();
}

// 生成数据看板模拟数据
export function generateMockDashboardData(): DashboardData {
  const realTimeStats: RealTimeStats = {
    activeBidders: 127,
    concurrentBids: 23,
    totalVolume: '245.67',
    averagePrice: '0.0847',
    successRate: 78.5,
    peakTPS: 1250,
  };

  const auctionHeatMap: AuctionHeatData[] = [
    { auctionId: '1', heat: 95, bidCount: 12, viewCount: 340, priceChange: 15.6, lastUpdated: Date.now() },
    { auctionId: '2', heat: 87, bidCount: 8, viewCount: 220, priceChange: 8.3, lastUpdated: Date.now() - 30000 },
    { auctionId: '3', heat: 76, bidCount: 15, viewCount: 180, priceChange: 22.1, lastUpdated: Date.now() - 60000 },
  ];

  const bidderLeaderboard: BidderRanking[] = [
    {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      username: 'CryptoWhale_001',
      totalBids: 156,
      successRate: 85.2,
      totalVolume: '67.89',
      rarityBonus: 45.3,
      rank: 1,
      bidFrequency: 12.5,
      profileType: 'high_frequency',
    },
    {
      address: '0x8ba1f109551bD432803012645Hac136c772c3c3',
      username: 'NFT_Hunter',
      totalBids: 98,
      successRate: 76.4,
      totalVolume: '89.12',
      rarityBonus: 38.7,
      rank: 2,
      bidFrequency: 8.3,
      profileType: 'high_value',
    },
    {
      address: '0x1234567890123456789012345678901234567890',
      username: 'StrategyMaster',
      totalBids: 203,
      successRate: 82.1,
      totalVolume: '45.67',
      rarityBonus: 52.1,
      rank: 3,
      bidFrequency: 15.2,
      profileType: 'strategic',
    },
  ];

  const transactionStats: TransactionStats = {
    totalTransactions: 1847,
    totalVolume: '245.67',
    averageTransactionValue: '0.1331',
    medianTransactionValue: '0.0847',
    priceRangeDistribution: [
      { min: '0.001', max: '0.01', count: 756, percentage: 40.9 },
      { min: '0.01', max: '0.1', count: 612, percentage: 33.1 },
      { min: '0.1', max: '1.0', count: 398, percentage: 21.6 },
      { min: '1.0', max: '10.0', count: 81, percentage: 4.4 },
    ],
    timeDistribution: [
      { hour: 0, transactionCount: 45, volume: '4.23' },
      { hour: 6, transactionCount: 89, volume: '12.45' },
      { hour: 12, transactionCount: 156, volume: '23.67' },
      { hour: 18, transactionCount: 203, volume: '34.12' },
    ],
    categoryStats: [
      { category: 'Cosmic', count: 523, volume: '87.23', averagePrice: '0.1667' },
      { category: 'Digital Art', count: 398, volume: '76.45', averagePrice: '0.1921' },
      { category: 'Cyberpunk', count: 301, volume: '81.99', averagePrice: '0.2724' },
    ],
  };

  const networkStatus: NetworkStatus = {
    currentTPS: 1128,
    peakTPS: 1250,
    averageTPS: 987,
    gasPrice: '0.000000025',
    blockHeight: 1000567,
    networkLatency: 45,
    congestionLevel: 'low',
  };

  return {
    realTimeStats,
    auctionHeatMap,
    bidderLeaderboard,
    transactionStats,
    networkStatus,
  };
} 