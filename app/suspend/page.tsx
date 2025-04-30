import React from "react";

/**
 * SuspendPage コンポーネント
 * サービス休止中に表示されるメンテナンス画面
 * @returns JSX.Element
 */
export default function SuspendPage() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f8f8',
      padding: '2rem',
    }}>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        padding: '2.5rem 2rem',
        maxWidth: 960,
        width: '100%',
        textAlign: 'center',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#333',
          marginBottom: '1.2rem',
        }}>
          サービスは現在休止中です
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem',
        }}>
          NovelMeは現在システムメンテナンスまたは利用状況により一時的に休止しています。<br />
          ご不便をおかけして申し訳ありません。<br />
          サービス再開までしばらくお待ちください。
        </p>

      </div>
    </div>
  );
}
