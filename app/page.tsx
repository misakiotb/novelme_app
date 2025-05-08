"use client";

import React from "react";
import Link from "next/link";
import { useFormContext } from "./FormContext";
import { useState } from "react";
import { containsNgWord } from '../utils/ngCheck';
import Image from "next/image";

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
 * サービス稼働状況を判定し、休止中なら休止画面を表示する。
 * 生成ボタン押下時にも都度稼働状況をチェックし、休止中ならエラー表示。
 */
export default function Home() {
  const { values, setValues } = useFormContext();
  const episode = values.episode;
  const mode = values.mode;
  const isValid = episode.length >= 10 && !containsNgWord(episode);
  const [touched, setTouched] = useState(false);
  const [ngError, setNgError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);
  const [error, setError] = useState("");
  // サービス稼働状況
  const [serviceActive, setServiceActive] = useState<boolean | null>(null);
  const [usageCost, setUsageCost] = useState<number | null>(null);

  /**
   * 入力を検証し、API へリクエストして結果を state にセットする
   * 生成ボタン押下時にも /api/usage-status を確認し、休止中ならエラー表示
   */
  const handleGenerate = async () => {
    // --- 0. サービス稼働状況を再チェック ---
    setError("");
    setNgError("");
    setResult(null);
    setLoading(true);
    try {
      const usageRes = await fetch("/api/usage-status");
      const usageData = await usageRes.json();
      setServiceActive(usageData.active);
      setUsageCost(usageData.cost);
      if (!usageData.active) {
        setError("現在、APIコストが上限を超えたためサービスは一時休止中です。");
        setLoading(false);
        return;
      }
    } catch {
      setError("サービス状況の確認に失敗しました");
      setLoading(false);
      return;
    }

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
        fantasy: "ファンタジー冒険譚 - キャリアの挑戦を魔法や冒険に置き換え、スキルを魔法の能力として表現",
        cyberpunk: "サイバーパンク - テクノロジーとの関わりを強調し、未来的で暗めの世界観で描写",
        romance: "青春恋愛小説 - キャリアの選択や成長を、恋愛や友情のストーリーとして描く",
        mystery: "ミステリー/推理小説 - キャリアでの問題解決や謎を、探偵が事件を解決するように描写",
        horror: "ホラー/サスペンス - キャリアの困難や不安を恐怖やサスペンスとして描写",
        isekai: "異世界転生/転職もの - キャリアチェンジを異世界での新しい人生として描く",
        retro: "昭和レトロ風味の人情話 - キャリアの出会いや苦労を、下町の人情模様として描写",
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
    } catch (e: unknown) {
      // --- 4. エラー処理 ---
      setLoading(false);
      if (e instanceof Error) {
        setError(e.message || "エラーが発生しました");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // サイト起動時にサービス稼働状況を取得
  React.useEffect(() => {
    (async () => {
      try {
        const usageRes = await fetch("/api/usage-status");
        const usageData = await usageRes.json();
        setServiceActive(usageData.active);
        setUsageCost(usageData.cost);
      } catch {
        setServiceActive(null);
      }
    })();
  }, []);

  if (serviceActive === false) {
    // 休止中画面
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#1a202c' }}>
          現在サービスは休止中です
        </h1>
        <p style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem' }}>
          APIコストが予算上限を超えたため、一時的にサービスを停止しています。<br />
          毎日9時にリセットされます。
        </p>
        {usageCost !== null && (
          <p style={{ color: '#64748b', fontSize: '1rem' }}>本日のコスト: ${usageCost.toFixed(2)}</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#1a202c' }}>
        NovelMe 〜あなたが主人公の物語〜
      </h1>
      <p style={{ maxWidth: 600, textAlign: 'center', marginBottom: '2rem', color: '#374151' }}>
        お好みの生成モードを選択し、あなたの経歴や印象的なエピソードを入力して
        <br />
        「AIで生成」ボタンをクリック。
        <br />
        あなたを主人公とした架空の物語の「タイトル」と「紹介文」を自動生成します。
        <br />
        ※実行前に必ず<Link href="/notice" style={{ color: '#2563eb', textDecoration: 'underline' }}>注意事項</Link>を確認してください
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
          <option value="fantasy">ファンタジー冒険譚</option>
          <option value="cyberpunk">サイバーパンク</option>
          <option value="romance">青春恋愛小説</option>
          <option value="mystery">ミステリー/推理小説</option>
          <option value="horror">ホラー/サスペンス</option>
          <option value="isekai">異世界転生/転職もの</option>
          <option value="retro">昭和レトロ風味の人情話</option>
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
           onChange={e => {
             setValues({ ...values, episode: e.target.value });
             if (containsNgWord(e.target.value)) {
               setNgError('不適切な内容が含まれています');
             } else {
               setNgError("");
             }
           }}
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
          {loading ? "生成中..." : "AIで生成"}
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
            <Image
              src="/dummy-cover.png"
              alt="書影ダミー"
              width={120}
              height={170}
              style={{
                minWidth: 120,
                width: 120,
                height: 170,
                borderRadius: '0.6rem',
                boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                marginRight: 24,
                flexShrink: 0,
                border: '1.5px solid #6366f1',
                objectFit: 'cover',
                background: '#e0e7ff',
                display: 'block',
              }}
            />
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
