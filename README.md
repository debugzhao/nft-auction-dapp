# NFT Auction Market - 高并发拍卖平台

基于 Monad 区块链的高频 NFT 拍卖平台，支持多用户并发出价、实时价格更新。

## 🚀 核心特性

- **高并发竞价**：支持多个用户同时出价，突破传统 EVM 串行限制
- **实时更新**：价格和状态实时同步，毫秒级响应
- **简单易用**：专注于核心竞价功能，快速上手
- **Gas 优化**：通过 Monad 高效处理机制降低交易成本

## 🛠️ 技术栈

- **前端**：Next.js 14 + TypeScript + TailwindCSS
- **钱包连接**：RainbowKit + wagmi + viem
- **智能合约**：Solidity + OpenZeppelin
- **存储**：IPFS (nft.storage)
- **区块链**：Monad Testnet

## 📦 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并配置以下环境变量：

```env
# NFT.Storage API Token (需要从 https://nft.storage/ 获取)
NEXT_PUBLIC_NFT_STORAGE_TOKEN=your_nft_storage_token_here

# 智能合约地址 (部署后更新)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# WalletConnect Project ID (需要从 https://cloud.walletconnect.com/ 获取)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 功能演示

### 基础功能
1. **钱包连接**：连接 MetaMask 钱包
2. **创建拍卖**：上传 NFT 并创建拍卖
3. **查看拍卖**：浏览拍卖列表
4. **参与竞价**：对拍卖进行出价

### 高频功能
1. **并发出价**：多个用户同时出价
2. **实时更新**：价格实时变化
3. **冲突处理**：同时出价的处理
4. **性能展示**：高并发处理能力

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── auction/[id]/      # 拍卖详情页
│   ├── create/            # 创建拍卖页
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── providers.tsx      # 全局Provider
├── components/            # React 组件
│   ├── AuctionList.tsx    # 拍卖列表
│   ├── BidForm.tsx        # 出价表单
│   ├── CountdownTimer.tsx # 倒计时
│   └── WalletConnect.tsx  # 钱包连接
├── hooks/                 # 自定义 Hooks
│   └── useAuction.ts      # 拍卖相关逻辑
├── utils/                 # 工具函数
│   ├── ipfs.ts           # IPFS 相关
│   └── wagmi.ts          # wagmi 配置
├── contracts/            # 智能合约
│   └── abi.ts            # 合约 ABI
└── types/                # TypeScript 类型
    └── index.ts          # 类型定义
```

## 🔧 开发指南

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/hooks/` 中添加相关逻辑
3. 在 `src/types/` 中定义类型
4. 更新页面路由

### 智能合约集成

1. 部署合约到 Monad Testnet
2. 更新 `src/contracts/abi.ts` 中的合约地址
3. 在 `src/hooks/useAuction.ts` 中添加合约调用

## 🚀 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 环境变量配置

确保在生产环境中配置以下环境变量：

- `NEXT_PUBLIC_NFT_STORAGE_TOKEN`
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

## 📝 注意事项

1. **测试网配置**：当前配置为 Monad Testnet，生产环境需要更新为 Mainnet
2. **合约地址**：需要先部署智能合约，然后更新环境变量中的合约地址
3. **API 密钥**：需要申请 NFT.Storage 和 WalletConnect 的 API 密钥
4. **钱包支持**：确保用户的钱包支持 Monad 网络

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
