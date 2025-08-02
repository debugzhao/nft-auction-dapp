import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Auction Market - 高并发拍卖平台",
  description: "基于 Monad 区块链的高频 NFT 拍卖平台，支持多用户并发出价",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
