const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署智能合约...");

  // 部署 NFT 合约
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const nftContract = await SimpleNFT.deploy();
  await nftContract.waitForDeployment();
  
  const nftAddress = await nftContract.getAddress();
  console.log("NFT 合约已部署到:", nftAddress);

  // 部署拍卖合约
  const Auction = await ethers.getContractFactory("Auction");
  const auctionContract = await Auction.deploy(nftAddress);
  await auctionContract.waitForDeployment();
  
  const auctionAddress = await auctionContract.getAddress();
  console.log("拍卖合约已部署到:", auctionAddress);

  console.log("\n部署完成！");
  console.log("请更新 .env.local 文件中的合约地址：");
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftAddress}`);
  console.log(`NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS=${auctionAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 