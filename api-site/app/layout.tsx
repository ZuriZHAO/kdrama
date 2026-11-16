import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "剧场之外 · 投稿服务（已停用）",
  description: "旧投稿后端，已改为通过 GitHub Issue 投稿。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
