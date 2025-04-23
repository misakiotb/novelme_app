"use client";

export default function Result() {
  const dummyTitle = "あなたの人生が小説になる日";
  const dummyDate = new Date().toLocaleDateString();
  const dummyDescription =
    "この小説は、あなたの経験やエピソードをもとにAIが生み出した、世界にひとつだけのストーリーです。困難を乗り越えた瞬間や、心に残る出会いを振り返りながら、あなた自身が主人公となる物語をお楽しみください。";

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: 900, width: '100%', minHeight: 340 }}>
        {/* 左側：ダミー書影 */}
        <div style={{ width: 220, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', borderRadius: '1rem 0 0 1rem' }}>
          <div style={{ width: 140, height: 200, background: '#cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold', fontSize: 18 }}>
            書影イメージ
          </div>
        </div>
        {/* 右側：タイトル、発売日、紹介文 */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a202c' }}>{dummyTitle}</h2>
          <div style={{ color: '#2563eb', marginBottom: '1.2rem', fontWeight: 'bold' }}>発売日：{dummyDate}</div>
          <p style={{ fontSize: '1.1rem', color: '#374151', lineHeight: 1.7 }}>{dummyDescription}</p>
        </div>
      </div>
      {/* もう一度生成するボタン */}
      <button
        type="button"
        style={{ marginTop: '2.5rem', background: '#2563eb', color: '#fff', fontWeight: 'bold', padding: '0.9rem 2.2rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        onClick={() => window.location.href = '/'}
      >
        もう一度生成する
      </button>
      {/* 注意書き */}
      <div style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.98rem', textAlign: 'center', maxWidth: 600 }}>
        ※このページを閉じたり再読み込みすると、同じ内容をもう一度見ることはできません。<br />
        新しく生成するたびに異なる結果になります。
      </div>
    </div>
  );
}
