"use client";

/**
 * NovelMeLogo コンポーネント
 * SVG 形式でサイトロゴを表示する
 *
 * @param size - ロゴの高さ(px)。幅は高さの約6倍で自動調整
 * @returns JSX.Element
 */
export default function NovelMeLogo({ size = 44 }: { size?: number }) {
  // size: ロゴ全体の高さ(px)
  // 幅は文字サイズに合わせて調整
  return (
    <svg
    data-testid="novelme-logo-svg"
      width={size * 6}
      height={size}
      viewBox="0 0 240 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      aria-label="NovelMe ロゴ"
    >
      {/* ブックマーク型アイコン */}
      <g>
        <rect x="7" y="7" width="30" height="30" rx="7" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
        <path d="M15 13 h14 a2 2 0 0 1 2 2 v18 l-9-6-9 6V15a2 2 0 0 1 2-2z" fill="var(--primary)" stroke="var(--primary)" strokeWidth="1.2" />
      </g>
      {/* NovelMe テキスト */}
      <text
        x="50"
        y="32"
        fill="var(--primary)"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="2.1rem"
        letterSpacing="0.03em"
      >
        NovelMe
      </text>
    </svg>
  );
}
