import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { AUCTION_ABI, CONTRACT_ADDRESSES } from '@/contracts/abi';
import { Auction, Bid } from '@/types';
import { getAllMockAuctions, getMockAuction } from '@/utils/mockData';

// 获取所有拍卖
export function useAllAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 使用模拟数据
    const mockAuctions = getAllMockAuctions();
    setAuctions(mockAuctions);
    setLoading(false);
  }, []);

  return { auctions, loading };
}

// 获取单个拍卖信息
export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 使用模拟数据
    const mockAuction = getMockAuction(auctionId);
    setAuction(mockAuction);
    setLoading(false);
  }, [auctionId]);

  return { auction, loading };
}

// 创建拍卖
export function useCreateAuction() {
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: createData } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useTransaction({
    hash: createData,
  });

  const createAuctionHandler = async (
    tokenId: string,
    startPrice: string,
    duration: number
  ) => {
    try {
      setIsCreating(true);
      writeContract({
        address: CONTRACT_ADDRESSES.AUCTION_CONTRACT as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: 'createAuction',
        args: [BigInt(tokenId), parseEther(startPrice), BigInt(duration * 3600)], // duration in seconds
      });
    } catch (error) {
      console.error('Error creating auction:', error);
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsCreating(false);
    }
  }, [isSuccess]);

  return {
    createAuction: createAuctionHandler,
    isCreating: isCreating || isConfirming,
    isSuccess,
  };
}

// 出价
export function usePlaceBid() {
  const [isBidding, setIsBidding] = useState(false);

  const { writeContract, data: bidData } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useTransaction({
    hash: bidData,
  });

  const placeBidHandler = async (auctionId: string, amount: string) => {
    try {
      setIsBidding(true);
      writeContract({
        address: CONTRACT_ADDRESSES.AUCTION_CONTRACT as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: 'placeBid',
        args: [BigInt(auctionId)],
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('Error placing bid:', error);
      setIsBidding(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsBidding(false);
    }
  }, [isSuccess]);

  return {
    placeBid: placeBidHandler,
    isBidding: isBidding || isConfirming,
    isSuccess,
  };
}

// 结束拍卖
export function useEndAuction() {
  const [isEnding, setIsEnding] = useState(false);

  const { writeContract, data: endData } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useTransaction({
    hash: endData,
  });

  const endAuctionHandler = async (auctionId: string) => {
    try {
      setIsEnding(true);
      writeContract({
        address: CONTRACT_ADDRESSES.AUCTION_CONTRACT as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: 'endAuction',
        args: [BigInt(auctionId)],
      });
    } catch (error) {
      console.error('Error ending auction:', error);
      setIsEnding(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsEnding(false);
    }
  }, [isSuccess]);

  return {
    endAuction: endAuctionHandler,
    isEnding: isEnding || isConfirming,
    isSuccess,
  };
}

// 获取用户余额
export function useBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (address) {
      // 这里需要实现获取用户余额的逻辑
      // 可以使用wagmi的useBalance hook
    }
  }, [address]);

  return { balance };
} 