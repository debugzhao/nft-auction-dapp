// NFT 类型定义
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  owner: string;
  tokenURI: string;
}

// 拍卖类型定义
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
}

// 出价类型定义
export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: string;
  timestamp: number;
}

// 用户类型定义
export interface User {
  address: string;
  balance: string;
  auctions: Auction[];
  bids: Bid[];
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