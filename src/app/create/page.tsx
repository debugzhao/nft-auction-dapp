'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { uploadImageToIPFS, uploadMetadataToIPFS } from '@/utils/ipfs';
import { useCreateAuction } from '@/hooks/useAuction';
import WalletConnect from '@/components/WalletConnect';

export default function CreateAuction() {
  const router = useRouter();
  const { address } = useAccount();
  const { createAuction, isCreating, isSuccess } = useCreateAuction();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    startPrice: '',
    duration: 24, // 默认24小时
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('请先连接钱包');
      return;
    }

    if (!formData.image) {
      setError('请选择NFT图片');
      return;
    }

    if (!formData.name.trim()) {
      setError('请输入NFT名称');
      return;
    }

    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      setError('请输入有效的起拍价');
      return;
    }

    try {
      setIsUploading(true);
      
      // 上传图片到IPFS
      const imageUrl = await uploadImageToIPFS(formData.image);
      
      // 创建元数据
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        attributes: [
          { trait_type: 'Type', value: 'Auction NFT' },
          { trait_type: 'Created', value: new Date().toISOString() },
        ],
      };
      
      // 上传元数据到IPFS
      const metadataUrl = await uploadMetadataToIPFS(metadata);
      
      // 创建拍卖（这里简化处理，实际需要先mint NFT）
      // 为了demo，我们使用一个模拟的tokenId
      const tokenId = Date.now().toString();
      
      await createAuction(tokenId, formData.startPrice, formData.duration);
      
    } catch (error) {
      console.error('Error creating auction:', error);
      setError('创建拍卖失败，请重试');
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
                🚀 NFT Auction Market
              </Link>
            </div>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">创建新拍卖</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NFT 图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NFT 图片
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        重新选择
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>上传图片</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                            required
                          />
                        </label>
                        <p className="pl-1">或拖拽到此处</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF 最大 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* NFT 名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                NFT 名称
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入NFT名称"
                required
              />
            </div>

            {/* NFT 描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                描述（可选）
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述你的NFT..."
              />
            </div>

            {/* 起拍价 */}
            <div>
              <label htmlFor="startPrice" className="block text-sm font-medium text-gray-700 mb-2">
                起拍价 (ETH)
              </label>
              <input
                type="number"
                id="startPrice"
                value={formData.startPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, startPrice: e.target.value }))}
                step="0.001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.001"
                required
              />
            </div>

            {/* 拍卖时长 */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                拍卖时长 (小时)
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 小时</option>
                <option value={6}>6 小时</option>
                <option value={12}>12 小时</option>
                <option value={24}>24 小时</option>
                <option value={48}>48 小时</option>
                <option value={72}>72 小时</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href="/"
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={isCreating || isUploading || !address}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating || isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    创建中...
                  </div>
                ) : !address ? (
                  '请先连接钱包'
                ) : (
                  '创建拍卖'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 