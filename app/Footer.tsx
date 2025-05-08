"use client";
import Link from "next/link";

/**
 * Footer コンポーネント
 * サイトの各種リンクおよび著作権表示を提供する
 * @returns JSX.Element
 */
export default function Footer() {
  return (
    <footer style={{ width: '100%', padding: '1.2rem 0', background: 'var(--surface)', textAlign: 'center', marginTop: 'auto' }}>
      <div style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>
        2025 NovelMe &nbsp;|&nbsp;
        <Link href="/notice" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>注意事項</Link>
      </div>
    </footer>
  );
}
