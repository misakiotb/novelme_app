import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// --- フォント設定 ---
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

import "./globals.css";

/**
 * ページ共通のメタデータ
 * title, description, keywords, openGraph, twitter カードを設定
 */
export const metadata: Metadata = {
  title: "NovelMe - あなたが主人公の小説タイトル生成AI",
  description: "経歴や印象的なエピソードを入力すると、AIが“あなた専用”の小説タイトルと紹介文を自動生成。キャリアや人生の振り返り・自己肯定感UPに。NovelMeは匿名・無料で使えるWebサービスです。",
  keywords: [
    "AI",
    "小説",
    "タイトル生成",
    "自己分析",
    "キャリア",
    "NovelMe",
    "人生ストーリー"
  ],
  openGraph: {
    title: "NovelMe - あなたが主人公の小説タイトル生成AI",
    description: "経歴や印象的なエピソードを入力すると、AIが“あなた専用”の小説タイトルと紹介文を自動生成。キャリアや人生の振り返り・自己肯定感UPに。NovelMeは匿名・無料で使えるWebサービスです。",
    url: "https://novelme.example.com/", // 本番URLに合わせて修正可
    siteName: "NovelMe",
    images: [
      {
        url: "/ogp.png", // OGP画像（public/ogp.png）を設置推奨
        width: 1200,
        height: 630,
        alt: "NovelMe 小説タイトル生成AI OGP画像"
      }
    ],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "NovelMe - あなたが主人公の小説タイトル生成AI",
    description: "経歴や印象的なエピソードを入力すると、AIが“あなた専用”の小説タイトルと紹介文を自動生成。キャリアや人生の振り返り・自己肯定感UPに。NovelMeは匿名・無料で使えるWebサービスです。",
    images: ["/ogp.png"]
  },
};

import { FormProvider } from "./FormContext";
import Header from "./Header";
import Footer from "./Footer";

import fs from "fs";
import path from "path";
import SuspendPage from "./suspend/page";

/**
 * アプリ全体のルートレイアウトコンポーネント
 * サービス停止中は SuspendPage を表示し、それ以外はヘッダー・コンテンツ・フッターをレンダリング
 *
 * @param children - 各ページのコンテンツ
 * @returns JSX.Element
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- 1. サービス停止判定 ---
  // プロジェクト直下の SUSPEND ファイルの有無でサービス稼働を制御
  const suspendFilePath = path.join(process.cwd(), "SUSPEND");
  const isSuspended = fs.existsSync(suspendFilePath);

  if (isSuspended) {
    // サービス休止中は suspend ページのみ表示
    return (
      <html lang="ja">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <SuspendPage />
        </body>
      </html>
    );
  }

  // --- 2. 通常レイアウトレンダリング ---
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <FormProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </FormProvider>
      </body>
    </html>
  );
}
