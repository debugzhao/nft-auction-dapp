import WalletConnect from '@/components/WalletConnect';
import AuctionList from '@/components/AuctionList';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🚀 NFT Auction Market
              </h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                高并发版
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/create" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                创建拍卖
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            热门拍卖
          </h2>
          <p className="text-gray-600">
            基于 Monad 区块链的高频 NFT 拍卖，支持多用户并发出价
          </p>
        </div>

        {/* 特色功能展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">高并发竞价</h3>
            <p className="text-gray-600 text-sm">
              支持多个用户同时出价，突破传统 EVM 串行限制
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">实时更新</h3>
            <p className="text-gray-600 text-sm">
              价格和状态实时同步，毫秒级响应
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gas 优化</h3>
            <p className="text-gray-600 text-sm">
              通过 Monad 高效处理机制降低交易成本
            </p>
          </div>
        </div>

        {/* 拍卖列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">进行中的拍卖</h3>
            <div className="text-sm text-gray-500">
              实时更新 • 高并发支持
            </div>
          </div>
          
          <AuctionList />
        </div>

        {/* 快速开始指南 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">快速开始</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium text-blue-900">连接钱包</h4>
                <p className="text-blue-700">使用 MetaMask 或其他支持的钱包连接</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium text-blue-900">浏览拍卖</h4>
                <p className="text-blue-700">查看所有进行中的 NFT 拍卖</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium text-blue-900">参与竞价</h4>
                <p className="text-blue-700">实时出价，体验高并发竞价</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
