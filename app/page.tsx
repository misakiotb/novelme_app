"use client";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#1a202c' }}>
        NovelMe 〜あなたが主人公の小説タイトル生成〜
      </h1>
      <p style={{ maxWidth: 480, textAlign: 'center', marginBottom: '2rem', color: '#374151' }}>
        あなたの経歴や印象的なエピソードを入力すると、AIが「小説の表紙タイトル」と「紹介文」を自動生成します。
        <br />
        まずは下のフォームに、あなたのストーリーを自由に書いてみてください。
      </p>
            <form style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <label htmlFor="mode" style={{ fontWeight: 'bold', color: '#2563eb' }}>
          生成モード（小説ジャンル）
        </label>
        <select
          id="mode"
          name="mode"
          style={{ padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f1f5f9' }}
        >
          <option value="fantasy">ファンタジー風</option>
          <option value="ranobe">ラノベ風</option>
          <option value="mystery">ミステリー風</option>
          <option value="watakushi">私小説風</option>
          <option value="history">歴史小説風</option>
        </select>
        <label htmlFor="episode" style={{ fontWeight: 'bold', color: '#2563eb' }}>
          経歴・印象的なエピソード
        </label>
        <textarea
          id="episode"
          name="episode"
          placeholder="例：新卒で営業職に就き、失敗続きだったが、ある出会いをきっかけに成績トップに…など"
          rows={6}
          style={{ resize: 'vertical', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f1f5f9' }}
          disabled
        />
        <button
          type="button"
          style={{ background: '#2563eb', color: '#fff', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', cursor: 'pointer', opacity: 1 }}
          onClick={() => window.location.href = '/result'}
        >
          AIで小説タイトルを生成（ダミー遷移）
        </button>
      </form>
      <div style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.95rem' }}>
        ※この画面はイメージ用のダミーです。ボタンや入力はまだ動きません。
      </div>
    </div>
  );
}
