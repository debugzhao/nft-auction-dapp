import { NFTStorage, File } from 'nft.storage';

// 初始化 NFT.Storage 客户端
const client = new NFTStorage({ 
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' 
});

// 上传图片到 IPFS
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    const cid = await client.storeBlob(file);
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

// 上传 NFT 元数据到 IPFS
export async function uploadMetadataToIPFS(metadata: {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}): Promise<string> {
  try {
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const metadataFile = new File([metadataBlob], 'metadata.json', {
      type: 'application/json',
    });
    
    const cid = await client.storeBlob(metadataFile);
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

// 从 IPFS 获取图片 URL
export function getIPFSImageUrl(ipfsUrl: string): string {
  if (!ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl;
  }
  
  const cid = ipfsUrl.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${cid}`;
}

// 从 IPFS 获取元数据
export async function getIPFSMetadata(ipfsUrl: string): Promise<any> {
  try {
    const url = getIPFSImageUrl(ipfsUrl);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
} 