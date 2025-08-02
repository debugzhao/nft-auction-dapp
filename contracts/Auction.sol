// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Auction is ReentrancyGuard {
    using Counters for Counters.Counter;

    struct AuctionItem {
        uint256 tokenId;
        address seller;
        uint256 startPrice;
        uint256 currentPrice;
        uint256 endTime;
        address highestBidder;
        bool ended;
    }

    IERC721 public nftContract;
    Counters.Counter private _auctionIds;
    
    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;

    event AuctionCreated(uint256 indexed auctionId, uint256 indexed tokenId, address indexed seller, uint256 startPrice, uint256 duration);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 amount);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function createAuction(uint256 tokenId, uint256 startPrice, uint256 duration) external returns (uint256) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Not approved");
        require(startPrice > 0, "Start price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");

        _auctionIds.increment();
        uint256 auctionId = _auctionIds.current();

        auctions[auctionId] = AuctionItem({
            tokenId: tokenId,
            seller: msg.sender,
            startPrice: startPrice,
            currentPrice: startPrice,
            endTime: block.timestamp + duration,
            highestBidder: address(0),
            ended: false
        });

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit AuctionCreated(auctionId, tokenId, msg.sender, startPrice, duration);
        return auctionId;
    }

    function placeBid(uint256 auctionId) external payable nonReentrant {
        AuctionItem storage auction = auctions[auctionId];
        require(!auction.ended, "Auction ended");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.value > auction.currentPrice, "Bid too low");

        // 退还之前的出价
        if (auction.highestBidder != address(0)) {
            bids[auctionId][auction.highestBidder] += auction.currentPrice;
        }

        auction.highestBidder = msg.sender;
        auction.currentPrice = msg.value;

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external nonReentrant {
        AuctionItem storage auction = auctions[auctionId];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime, "Auction not yet ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            // 转移NFT给获胜者
            nftContract.transfer(auction.highestBidder, auction.tokenId);
            
            // 转移资金给卖家
            payable(auction.seller).transfer(auction.currentPrice);
            
            emit AuctionEnded(auctionId, auction.highestBidder, auction.currentPrice);
        } else {
            // 无人出价，退还NFT给卖家
            nftContract.transfer(auction.seller, auction.tokenId);
        }
    }

    function getAuction(uint256 auctionId) external view returns (AuctionItem memory) {
        return auctions[auctionId];
    }

    function getAllAuctions() external view returns (uint256[] memory) {
        uint256[] memory auctionIds = new uint256[](_auctionIds.current());
        for (uint256 i = 1; i <= _auctionIds.current(); i++) {
            auctionIds[i - 1] = i;
        }
        return auctionIds;
    }

    function withdrawBid(uint256 auctionId) external nonReentrant {
        uint256 amount = bids[auctionId][msg.sender];
        require(amount > 0, "No bid to withdraw");

        bids[auctionId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
} 