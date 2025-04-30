"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "./FormContext";
import { useState } from "react";

/**
 * HintPopup コンポーネント
 * 書き方のヒントをモーダル表示する
 */
function HintPopup() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: '0.5rem 0 1.2rem 0' }}>
      <button
        type="button"
        style={{
          background: 'none',
          color: '#2563eb',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1.02rem',
          textDecoration: 'underline',
          padding: 0,
        }}
        onClick={() => setOpen(true)}
      >
        どう書いたらいい？ 書き方のヒント
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
              padding: '2rem',
              maxWidth: 420,
              width: '90vw',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#64748b',
                cursor: 'pointer',
              }}
              aria-label="閉じる"
            >
              ×
            </button>
            <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.13rem', marginBottom: '1.1rem' }}>
              書き方のヒント
            </div>
            <div style={{ color: '#222', fontSize: '1.04rem', lineHeight: 1.7 }}>
              例えばこのような事を思い出しながら書いてみてください。<br />
              <ul style={{ margin: '0.7rem 0 0 1.2rem', padding: 0, listStyleType: 'disc' }}>
                <li>あなたのキャリアにおける大きな転機や分岐点は何でしたか？その選択は何によって導かれましたか？</li>
                <li>あなたのキャリアにおける「試練」や「壁」は何でしたか？それをどのように乗り越えましたか？</li>
                <li>予期せぬ出来事（偶然の出会いや突然の変化）があなたのキャリアをどう変えましたか？</li>
                <li>これまでのキャリアで出会った「味方」や「メンター」は誰ですか？彼らからどんな影響を受けましたか？</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Home コンポーネント
 * ユーザー入力フォームと生成結果表示を行う
 */
export default function Home() {
  const { values, setValues } = useFormContext();
  const episode = values.episode;
  const mode = values.mode;
  const isValid = episode.length >= 10;
  const [touched, setTouched] = useState(false);
  const [ngError, setNgError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * 入力を検証し、API へリクエストして結果を state にセットする
   */
  const handleGenerate = async () => {
    // --- 1. 初期化 ---
    setTouched(true);
    setNgError("");
    setError("");
    setResult(null);
    // --- 2. 入力バリデーション ---
    if (!isValid) return;
    // --- 3. API リクエスト ---
    setLoading(true);
    try {
      // 英語value→日本語ラベル変換
      const modeMap: Record<string, string> = {
        fantasy: "ファンタジー風",
        ranobe: "ラノベ風",
        mystery: "ミステリー風",
        watakushi: "私小説風",
        history: "歴史小説風",
      };
      const modeForApi = modeMap[mode] || mode;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: modeForApi, episode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNgError(data.message || "エラーが発生しました");
        setLoading(false);
        return;
      }
      // Difyの返却仕様に合わせてtitle/description取得
      setResult({
        title: data.result?.title || data.title || "生成タイトル",
        description: data.result?.description || data.description || "生成紹介文",
      });
    } catch (e: any) {
      // --- 4. エラー処理 ---
      setLoading(false);
      setError(e.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#1a202c' }}>
        NovelMe 〜あなたが主人公の小説タイトル生成〜
      </h1>
      <p style={{ maxWidth: 600, textAlign: 'center', marginBottom: '2rem', color: '#374151' }}>
        あなたの経歴や印象的なエピソードを入力すると、AIが「小説の表紙タイトル」と「紹介文」を自動生成します。
        <br />
        まずは下のフォームに、あなたのストーリーを自由に書いてみてください。
        <br />
        ※実行前に必ず注意事項を確認してください
      </p>
            <form style={{ width: '100%', maxWidth: 960, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <label htmlFor="mode" style={{ fontWeight: 'bold', color: '#2563eb' }}>
          生成モード（小説ジャンル）
        </label>
        <select
          id="mode"
          name="mode"
          style={{ padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f1f5f9' }}
          value={mode}
          onChange={e => setValues({ ...values, mode: e.target.value })}
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
          maxLength={1000}
          style={{ resize: 'vertical', padding: '1rem', borderRadius: '0.5rem', border: ngError ? '#dc2626 1.5px solid' : '#cbd5e1 1px solid', fontSize: '1rem', background: '#f1f5f9' }}
          value={episode}
          onChange={e => { setValues({ ...values, episode: e.target.value }); setNgError(""); }}
          onBlur={() => setTouched(true)}
        />
        {/* 文字数カウンター */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '-0.7rem', marginBottom: '0.4rem' }}>
          <span style={{ color: episode.length > 1000 ? '#dc2626' : '#64748b', fontSize: '0.97rem', letterSpacing: '0.01em' }}>
            {episode.length}/1000文字
          </span>
        </div>
        {/* 書き方のヒントポップアップ */}
        <HintPopup />
        {!isValid && touched && (
          <div style={{ color: '#dc2626', fontSize: '0.97rem', marginTop: '-1rem', marginBottom: '-1rem' }}>
            10文字以上入力してください
          </div>
        )}
        {ngError && (
          <div style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '0.3rem', marginBottom: '-1rem' }}>
            {ngError}
          </div>
        )}
        <button
          type="button"
          style={{ background: '#2563eb', color: '#fff', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', cursor: isValid && !loading ? 'pointer' : 'not-allowed', opacity: isValid ? 1 : 0.5 }}
          onClick={handleGenerate}
          disabled={!isValid || loading}
        >
          {loading ? "生成中..." : "AIで小説タイトルを生成"}
        </button>
        {error && (
          <div style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1rem' }}>{error}</div>
        )}
        {/* 生成結果エリア: 初期表示では非表示、生成ボタンで結果が得られたときだけ表示 */}
        {result !== null && (
          <div
            style={{
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
              borderRadius: '1.5rem',
              padding: '2.2rem 1.5rem 2.5rem 1.5rem',
              marginTop: '2.5rem',
              boxShadow: '0 4px 24px rgba(37,99,235,0.12)',
              maxWidth: 960,
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              border: '2.5px solid #6366f1',
              position: 'relative',
              gap: 24,
            }}
          >
            {/* 書影ダミーブロック */}
            <div
              style={{
                minWidth: 120,
                width: 120,
                height: 170,
                background: 'repeating-linear-gradient(135deg, #e0e7ff, #c7d2fe 12px, #e0e7ff 24px)',
                borderRadius: '0.6rem',
                boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 24,
                flexShrink: 0,
                border: '1.5px solid #6366f1',
                fontSize: '1.6rem',
                color: '#64748b',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                userSelect: 'none',
              }}
            >
              書影ダミー
            </div>
            {/* テキスト側 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '2.1rem',
                color: '#2563eb',
                marginBottom: '1.2rem',
                textAlign: 'left',
                textShadow: '0 2px 12px #c7d2fe',
                letterSpacing: '0.04em',
                lineHeight: 1.25,
                width: '100%',
              }}>{result.title}</div>
              <div style={{
                fontSize: '1.13rem',
                color: '#374151',
                background: 'rgba(255,255,255,0.82)',
                borderRadius: '0.7rem',
                padding: '1.2rem 1rem',
                boxShadow: '0 1px 8px rgba(37,99,235,0.08)',
                lineHeight: 1.8,
                textAlign: 'left',
                fontWeight: 500,
                width: '100%',
              }}>{result.description}</div>
            </div>
            {/* レスポンシブ対応: スマホでは縦並び */}
            <style>{`
              @media (max-width: 600px) {
                .novelme-result-flex {
                  flex-direction: column !important;
                  align-items: center !important;
                  gap: 0 !important;
                }
                .novelme-result-image {
                  margin-right: 0 !important;
                  margin-bottom: 18px !important;
                }
              }
            `}</style>
          </div>
        )}
      </form>
    </div>
  );
}
