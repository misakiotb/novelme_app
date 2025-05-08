"use client";

/**
 * Notice コンポーネント
 * サービス利用上の注意事項を表示するページ
 * @returns JSX.Element
 */
export default function Notice() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '2rem' }}>注意事項</h1>
      <ul style={{ maxWidth: 600, color: 'var(--primary-dark)', fontSize: '1.12rem', lineHeight: 1.8,listStyleType: 'disc', paddingLeft: '1.2rem'}}>
        <li>本サービスはAI（LLM：大規模言語モデル）を利用してタイトル、紹介文、および書影画像を生成しています。</li>
        <li>生成結果は必ずしも事実や現実と一致するものではありません。</li>
        <li>入力内容、生成結果はシステム内に実行ログとして残ります。個人情報や機密情報、人に見られて困る情報の入力はお控えください。</li>
        <li>ログの二次利用は行いません。</li>
        <li>暴力的、性的、公序良俗に反するような、不適切な内容は入力しないでください。</li>
        <li>サービス内容・仕様・使用するLLMモデルは予告なく変更・停止する場合があります。</li>
        <li>本サービスは予算の都合で予告なく停止する場合があります。継続利用をご希望の場合、ぜひスポンサーになってください。</li>
      </ul>
    </div>
  );
}
