"use client";
import Link from "next/link";
import NovelMeLogo from "./NovelMeLogo";

/**
 * Header コンポーネント
 * サイトロゴを表示し、トップページへのリンクを提供する
 * @returns JSX.Element
 */
export default function Header() {
  return (
    <header style={{ width: '100%', padding: '1.2rem 0', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }} aria-label="トップページへ">
          <NovelMeLogo size={44} />
        </Link>
      </div>
    </header>
  );
}
