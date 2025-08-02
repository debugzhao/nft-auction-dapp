import { Auction, NFT, Bid } from '@/types';

// 生成模拟的NFT数据
export function generateMockNFTs(): NFT[] {
  return [
    {
      id: '1',
      name: 'Cosmic Explorer #001',
      description: '一个神秘的宇宙探索者，拥有独特的星云背景',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      tokenId: '1',
      owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      tokenURI: 'ipfs://QmExample1',
    },
    {
      id: '2',
      name: 'Digital Dreamer #042',
      description: '数字艺术家的梦想之作，融合了现实与虚拟',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      tokenId: '2',
      owner: '0x8ba1f109551bD432803012645Hac136c772c3c3',
      tokenURI: 'ipfs://QmExample2',
    },
    {
      id: '3',
      name: 'Neon City #133',
      description: '赛博朋克风格的城市夜景，充满未来感',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      tokenId: '3',
      owner: '0x1234567890123456789012345678901234567890',
      tokenURI: 'ipfs://QmExample3',
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
  ];

  const bids: Bid[] = [];
  let currentPrice = 0.001;
  const baseTime = Date.now() - 3600000; // 1小时前开始

  for (let i = 0; i < 8; i++) {
    const bidder = bidders[i % bidders.length];
    const amount = currentPrice + (Math.random() * 0.01);
    currentPrice = amount;

    bids.push({
      id: `${auctionId}-bid-${i}`,
      auctionId,
      bidder,
      amount: amount.toFixed(4),
      timestamp: baseTime + (i * 300000), // 每5分钟一个出价
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