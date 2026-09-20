import React from 'react';
import { Shirt, Bike, BookOpen, MessageCircle, Link2, Pencil } from 'lucide-react';
import { COLORS, CONDITIONS } from '../constants.js';

// トップページ（HomeScreen）の下半分：特長・シーン・使い方
// 文言は各セクション上部の配列を直せば変えられます

const CARD_BG = '#F7F4F0'; // 特長カードの背景
const BODY = '#6F675F';    // 本文のグレー（inkSoftより読みやすい色）
const SVG_FONT = "'M PLUS Rounded 1c', sans-serif";

const H2_CLASS = 'font-maru font-extrabold text-[22px] leading-snug text-center';

// ============================================================
// イラスト（SVG）
// ============================================================

function Avatar({ x, y, s = 1, skin = '#F2C6A8', hair = '#3B2F2A', shirt = COLORS.indigo }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-15 22 Q-15 5 0 5 Q15 5 15 22 Z" fill={shirt} />
      <circle cx="0" cy="-4" r="9" fill={skin} />
      <path d="M-9.5 -5 A9.5 9.5 0 0 1 9.5 -5 Q0 -10 -9.5 -5 Z" fill={hair} />
    </g>
  );
}

// 特長1：知り合い限定だから安心・手軽
function IllustrationTrust() {
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="友達同士が直接手渡しするイメージ">
      {/* 地面 */}
      <ellipse cx="140" cy="146" rx="112" ry="6" fill="#EDE7E0" />

      {/* 盾 */}
      <path
        d="M140 12 L162 20 V44 C162 58 152 68 140 74 C128 68 118 58 118 44 V20 Z"
        fill={COLORS.accent}
      />
      <path d="M129 44 L137 52 L151 36" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      {/* 友達2人 */}
      <Avatar x={76} y={112} s={1.4} skin="#F2C6A8" hair="#3B2F2A" shirt={COLORS.indigo} />
      <Avatar x={204} y={112} s={1.4} skin="#F5D0B5" hair="#7A4B2A" shirt={COLORS.moss} />

      {/* 手渡しする箱 */}
      <rect x="124" y="108" width="32" height="26" rx="4" fill="#D9A566" />
      <rect x="137" y="108" width="6" height="26" fill="#F3D9A8" />

      {/* 腕と手 */}
      <path d="M94 126 L124 126" stroke="#F2C6A8" strokeWidth="6" strokeLinecap="round" />
      <path d="M186 126 L156 126" stroke="#F5D0B5" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// 特長2：「これ欲しい？」と聞く気まずさがない
function IllustrationAwkward() {
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="聞かなくても、タップするだけで伝わるイメージ">
      {/* 聞きづらい吹き出し */}
      <rect x="14" y="14" width="120" height="40" rx="14" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
      <path d="M62 54 L70 68 L82 54" fill="#fff" stroke={COLORS.border} strokeWidth="2" strokeLinejoin="round" />
      <line x1="63" y1="54" x2="81" y2="54" stroke="#fff" strokeWidth="3" />
      <text x="74" y="39" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.inkSoft}>
        これ欲しい？
      </text>
      <circle cx="132" cy="16" r="9" fill={COLORS.accent} />
      <path d="M128 12 L136 20 M136 12 L128 20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />

      <Avatar x={72} y={100} s={1.5} skin="#F5D0B5" hair="#5A3B2E" shirt={COLORS.moss} />

      {/* スマホ */}
      <rect x="170" y="20" width="84" height="140" rx="14" fill="#1F1F1F" />
      <rect x="175" y="25" width="74" height="130" rx="10" fill="#fff" />
      <rect x="181" y="32" width="62" height="44" rx="6" fill={COLORS.accentSoft} />
      <path
        d="M212 66 c-10 -8 -14 -14 -9 -19 c3 -3 7 -2 9 2 c2 -4 6 -5 9 -2 c5 5 1 11 -9 19 z"
        fill={COLORS.accent}
      />
      <rect x="181" y="82" width="40" height="5" rx="2.5" fill="#E5DED6" />
      <rect x="181" y="92" width="28" height="4" rx="2" fill={COLORS.border} />
      <rect x="181" y="108" width="62" height="20" rx="10" fill={COLORS.accent} />
      <text x="212" y="121.5" textAnchor="middle" fontSize="8" fontWeight="800" fontFamily={SVG_FONT} fill="#fff">
        これ欲しい！
      </text>
      <circle cx="236" cy="130" r="11" fill={COLORS.accent} opacity="0.25" />
      <circle cx="236" cy="130" r="4" fill={COLORS.accent} opacity="0.7" />
    </svg>
  );
}

// 特長3：会員登録不要でかんたん利用
function IllustrationNoSignup() {
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="アプリも会員登録もいらないイメージ">
      {/* 不要なもの（左右） */}
      <rect x="18" y="48" width="54" height="54" rx="12" fill="#fff" stroke={COLORS.inkSoft} strokeWidth="2" strokeDasharray="4 4" />
      <text x="45" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.inkSoft}>
        アプリ
      </text>
      <line x1="14" y1="44" x2="76" y2="106" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" />

      <rect x="208" y="48" width="54" height="54" rx="12" fill="#fff" stroke={COLORS.inkSoft} strokeWidth="2" strokeDasharray="4 4" />
      <text x="235" y="80" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.inkSoft}>
        会員登録
      </text>
      <line x1="204" y1="44" x2="266" y2="106" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" />

      {/* すぐ使えるスマホ */}
      <rect x="100" y="14" width="80" height="146" rx="14" fill="#1F1F1F" />
      <rect x="105" y="19" width="70" height="136" rx="10" fill="#fff" />
      <circle cx="140" cy="68" r="24" fill={COLORS.mossSoft} />
      <path d="M128 68 L137 77 L154 58" fill="none" stroke={COLORS.moss} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="140" y="112" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily={SVG_FONT} fill={COLORS.ink}>
        すぐ使える
      </text>
      <rect x="118" y="124" width="44" height="18" rx="9" fill={COLORS.accent} />
      <text x="140" y="136" textAnchor="middle" fontSize="8" fontWeight="800" fontFamily={SVG_FONT} fill="#fff">
        はじめる
      </text>
    </svg>
  );
}

// 特長4：無料で使えます
function IllustrationFree() {
  const chips = [
    { x: 4, y: 52, label: 'リスト作成' },
    { x: 196, y: 52, label: '共有' },
    { x: 100, y: 138, label: '手数料なし' },
  ];
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="無料で使えるイメージ">
      <circle cx="140" cy="80" r="52" fill={COLORS.accent} />
      <circle cx="140" cy="80" r="42" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" opacity="0.7" />
      <text x="140" y="92" textAnchor="middle" fontSize="34" fontWeight="800" fontFamily={SVG_FONT} fill="#fff">
        0円
      </text>
      {chips.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={c.y} width="80" height="26" rx="13" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
          <circle cx={c.x + 14} cy={c.y + 13} r="6" fill={COLORS.mossSoft} />
          <path
            d={`M${c.x + 11} ${c.y + 13} L${c.x + 13.5} ${c.y + 15.5} L${c.x + 17.5} ${c.y + 10.5}`}
            fill="none" stroke={COLORS.moss} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          />
          <text x={c.x + 25} y={c.y + 17} fontSize="10" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.ink}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ============================================================
// 特長
// ============================================================

const FEATURES = [
  {
    title: '知り合い限定だから安心・手軽',
    body: '知らない人との取引は/トラブルが心配。/知り合いだからこそ、/安心して気軽に。/直接会って渡せば、/梱包や配送の/手間もかかりません。',
    Illustration: IllustrationTrust,
  },
  {
    title: '「これ欲しい？」と聞く気まずさがない',
    body: '実はこれ欲しかった。でも「これ欲しい？」と聞くのって違和感。そんなもどかしい、もったいない経験がなくなります。',
    Illustration: IllustrationAwkward,
  },
  {
    title: '会員登録不要でかんたん利用',
    body: 'アプリのインストールも、会員登録もなしですぐに使えます。受け取る友達にインストールしてもらう必要もありません。',
    Illustration: IllustrationNoSignup,
  },
  {
    title: '無料で使える',
    body: 'リストの作成も共有も、費用はかかりません。フリマアプリのような手数料もありません。',
    Illustration: IllustrationFree,
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-5">
      {FEATURES.map(({ title, body, Illustration }, i) => (
        <div key={title} className="rounded-3xl px-5 pt-8 pb-7 text-center" style={{ backgroundColor: CARD_BG }}>
          <p className="italic font-bold text-sm mb-3" style={{ color: COLORS.accent }}>特長その{i + 1}</p>
          <h3 className="font-maru font-extrabold text-xl leading-snug mb-3" style={{ textWrap: 'balance' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-7" style={{ color: BODY }}>
            {body.split('/').map((s, i) => (
              <span key={i} className="inline-block">{s}</span>
            ))}
          </p>
          <Illustration />
        </div>
      ))}
    </section>
  );
}

// ============================================================
// こんなシーンでおすすめ
// ============================================================

const SCENES = [
  'まだ使えるサイズアウトした子供用品',
  '引っ越しで時間がない',
  '大学の教科書や家具を後輩に譲りたい',
  '大きいものはフリマアプリだとコスパが悪い',
];

export function ScenesSection() {
  return (
    <section>
      <h2 className={`${H2_CLASS} mb-6`}>こんなシーンでおすすめ</h2>
      <ul className="flex flex-wrap gap-2.5">
        {SCENES.map((s) => (
          <li
            key={s}
            className="rounded-full px-4 py-2 text-[13px] font-bold leading-snug"
            style={{ border: `2px solid ${COLORS.accent}`, color: COLORS.accent }}
          >
            # {s}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// 1分でわかる使い方（スマホ画面つき）
// ============================================================

const LABEL = { color: COLORS.inkSoft };

// アクセント色の大きな角丸パネル＋下が切れたスマホ
function PhoneStage({ children }) {
  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-[2rem]" style={{ backgroundColor: COLORS.accent }}>
      <div
        className="absolute left-1/2 top-[9%] w-[66%] -translate-x-1/2 rounded-t-[2rem] px-[6px] pt-[6px]"
        style={{ backgroundColor: '#1C1917', height: '100%' }}
      >
        <div className="h-full rounded-t-[1.6rem] overflow-hidden px-3 pt-3 font-kaku" style={{ backgroundColor: '#fff', color: COLORS.ink }}>
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="font-maru font-bold text-[11px]" style={{ color: COLORS.accent }}>ゆずリス</span>
            <img src="/squirrels-logo.png" alt="" style={{ height: 14, width: 'auto' }} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// 1. 譲りたいものを入力する
function ScreenInput() {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-[8px] font-bold mb-1" style={LABEL}>写真</p>
        <div className="h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent }}>
          <Shirt size={22} />
        </div>
      </div>
      <div>
        <p className="text-[8px] font-bold mb-1" style={LABEL}>品名</p>
        <p className="font-maru font-extrabold text-[12px] pb-1 border-b" style={{ borderColor: COLORS.border }}>
          ワンピース（Mサイズ）
        </p>
      </div>
      <div>
        <p className="text-[8px] font-bold mb-1" style={LABEL}>アイテムの状態</p>
        <div className="flex gap-1">
          {CONDITIONS.map((c, i) => (
            <span
              key={c}
              className="flex-1 text-center py-1 rounded text-[7px] font-bold whitespace-nowrap"
              style={
                i === 0
                  ? { backgroundColor: COLORS.accent, color: '#fff' }
                  : { backgroundColor: '#FCFBF8', color: COLORS.inkSoft, border: `1px solid ${COLORS.border}` }
              }
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 py-2 rounded-full text-center text-[9px] font-bold" style={{ backgroundColor: COLORS.accent, color: '#fff' }}>
        この内容で出品する
      </div>
    </div>
  );
}

// 2. リンクを友達にシェアする
function ScreenShare() {
  return (
    <div>
      <p className="font-maru font-bold text-[10px] mb-2">このリストを共有しよう</p>
      <div
        className="rounded-lg px-2 py-1.5 mb-2 flex items-center justify-between gap-2"
        style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}
      >
        <span className="text-[9px] font-bold truncate">子供用品をゆずります</span>
        <Pencil size={9} style={{ color: COLORS.indigo, flexShrink: 0 }} />
      </div>
      <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 mb-1.5 text-[9px] font-bold" style={{ backgroundColor: COLORS.line, color: '#fff' }}>
        <MessageCircle size={11} />
        LINEで送る
      </div>
      <div className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[9px] font-bold" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.ink }}>
        <Link2 size={11} style={{ color: COLORS.indigo }} />
        リンクをコピー
      </div>
      <p className="text-[8px] mt-3 text-center leading-relaxed" style={LABEL}>
        URLを知っている人だけがアクセスできます
      </p>
    </div>
  );
}

function MiniItem({ icon: Icon, name, badge, badgeBg, time }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold truncate">{name}</p>
        <span className="inline-block rounded-full px-1.5 py-[1px] my-0.5 text-[7px] font-bold whitespace-nowrap text-white" style={{ backgroundColor: badgeBg }}>
          {badge}
        </span>
        <p className="text-[7px]" style={LABEL}>{time}</p>
      </div>
    </div>
  );
}

// 3. 欲しい人がいたらマッチング
function ScreenMatching() {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <p className="font-maru font-bold text-[9px]">アイテム一覧</p>
        <p className="text-[8px]" style={LABEL}>3件</p>
      </div>
      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        <div style={{ borderColor: COLORS.border }}>
          <MiniItem icon={Bike} name="キッズ自転車 16インチ" badge="たなかさんとマッチング中" badgeBg={COLORS.indigo} time="2時間前に出品" />
        </div>
        <div style={{ borderColor: COLORS.border }}>
          <MiniItem icon={Shirt} name="ワンピース（Mサイズ）" badge="募集中" badgeBg={COLORS.accent} time="3時間前に出品" />
        </div>
        <div style={{ borderColor: COLORS.border }}>
          <MiniItem icon={BookOpen} name="絵本セット" badge="募集中" badgeBg={COLORS.accent} time="1日前に出品" />
        </div>
      </div>
    </div>
  );
}

// 4. 譲ったらお譲り完了
function ScreenDone() {
  return (
    <div>
      <div className="relative h-24 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
        <Bike size={34} />
        <span className="absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[8px] font-bold text-white" style={{ backgroundColor: COLORS.moss }}>
          お譲り確定
        </span>
      </div>
      <p className="font-maru font-bold text-[11px] mb-1">キッズ自転車 16インチ</p>
      <span className="inline-block rounded px-1.5 py-0.5 text-[8px] font-bold" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
        使用感あり
      </span>
      <p className="text-[8px] leading-relaxed mt-2">補助輪付きです。空気入れも一緒にお渡しします。</p>
      <div className="mt-2 py-2 rounded-full text-center text-[9px] font-bold" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
        お譲り済みです
      </div>
    </div>
  );
}

const STEPS = [
  { title: '譲りたいものを入力する', body: '写真・品名・状態を入れるだけ。会員登録は不要です。', Screen: ScreenInput },
  { title: 'リンクを友達にシェアする', body: 'LINEで送るか、リンクをコピーするだけ。URLを知っている人だけがアクセスできます。', Screen: ScreenShare },
  { title: '欲しい人がいたらマッチング', body: '欲しい人がいたらマッチングします。', Screen: ScreenMatching },
  { title: '譲ったらお譲り完了', body: '友達と連絡をとって、大切にしていたものを譲ろう。', Screen: ScreenDone },
];

export function StepsSection() {
  return (
    <section>
      <h2 className={`${H2_CLASS} mb-8`}>1分でわかるゆずリスの使い方</h2>
      <div className="space-y-12">
        {STEPS.map(({ title, body, Screen }, i) => (
          <div key={title}>
            <h3 className="font-maru font-extrabold text-lg text-center mb-5">{i + 1}. {title}</h3>
            <PhoneStage>
              <Screen />
            </PhoneStage>
            <p className="text-[15px] leading-relaxed mt-5" style={{ color: COLORS.ink }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
