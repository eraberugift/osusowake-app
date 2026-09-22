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
    <svg viewBox="0 40 280 120" className="w-full max-w-[280px] mx-auto" role="img" aria-label="友達同士が袋のまま直接手渡しするイメージ">
      {/* 地面 */}
      <ellipse cx="140" cy="152" rx="118" ry="6" fill="#EDE7E0" />

      {/* 友達2人 */}
      <Avatar x={68} y={106} s={2} skin="#F2C6A8" hair="#3B2F2A" shirt={COLORS.indigo} />
      <Avatar x={212} y={106} s={2} skin="#F5D0B5" hair="#7A4B2A" shirt={COLORS.moss} />

      {/* 腕 */}
      <path d="M94 127 L122 132" stroke="#F2C6A8" strokeWidth="7" strokeLinecap="round" />
      <path d="M186 127 L158 132" stroke="#F5D0B5" strokeWidth="7" strokeLinecap="round" />

      {/* 袋からはみ出す不用品：絵本 */}
      <g transform="rotate(-12 131 116)">
        <rect x="125" y="100" width="12" height="20" rx="2" fill={COLORS.indigo} />
        <rect x="127" y="103" width="8" height="2" rx="1" fill="#fff" opacity="0.6" />
      </g>

      {/* 袋からはみ出す不用品：くま */}
      <circle cx="141" cy="100" r="3.5" fill="#B98A5E" />
      <circle cx="155" cy="100" r="3.5" fill="#B98A5E" />
      <circle cx="148" cy="108" r="9" fill="#B98A5E" />
      <circle cx="145" cy="107" r="1.2" fill="#3B2F2A" />
      <circle cx="151" cy="107" r="1.2" fill="#3B2F2A" />
      <ellipse cx="148" cy="111" rx="3" ry="2" fill="#E6C9A8" />

      {/* 袋 */}
      <path d="M120 120 H160 L157 150 H123 Z" fill="#E9C48F" />
      <path d="M121.3 130 H158.7" stroke="#D9A566" strokeWidth="2" />

      {/* 袋を持つ手 */}
      <circle cx="121" cy="132" r="4" fill="#F2C6A8" />
      <circle cx="159" cy="132" r="4" fill="#F5D0B5" />

      {/* ハート */}
      <g transform="translate(-72 12)">
        <path
          d="M212 66 c-10 -8 -14 -14 -9 -19 c3 -3 7 -2 9 2 c2 -4 6 -5 9 -2 c5 5 1 11 -9 19 z"
          fill={COLORS.accent}
        />
      </g>
    </svg>
  );
}

// 特長2：友達に気を遣わせず譲れる
function IllustrationAwkward() {
  return (
    <svg viewBox="0 0 280 150" className="w-full max-w-[280px] mx-auto" role="img" aria-label="友達がリストを見て「これ欲しい！」と言っているイメージ">
      <ellipse cx="140" cy="135" rx="118" ry="5" fill="#EDE7E0" />

      {/* リストを見ている友達 */}
      <Avatar x={88} y={98} s={1.9} skin="#F5D0B5" hair="#7A4B2A" shirt={COLORS.moss} />
      <path d="M110 110 L146 106" stroke="#F5D0B5" strokeWidth="7" strokeLinecap="round" />

      {/* スマホ（リスト画面） */}
      <rect x="148" y="12" width="74" height="106" rx="12" fill="#1F1F1F" />
      <rect x="153" y="17" width="64" height="96" rx="8" fill="#fff" />
      <rect x="159" y="22" width="24" height="4" rx="2" fill={COLORS.accent} />

      {/* 1行目 */}
      <rect x="159" y="32" width="18" height="18" rx="4" fill="#F0ECE2" />
      <rect x="163" y="36" width="10" height="10" rx="2" fill={COLORS.indigo} />
      <rect x="182" y="35" width="26" height="4" rx="2" fill="#E5DED6" />
      <rect x="182" y="42" width="16" height="3" rx="1.5" fill={COLORS.border} />

      {/* 2行目（選んだもの） */}
      <rect x="157" y="54" width="56" height="30" rx="6" fill={COLORS.accentSoft} />
      <rect x="161" y="60" width="18" height="18" rx="4" fill="#fff" />
      <rect x="165" y="64" width="10" height="10" rx="2" fill={COLORS.accent} />
      <rect x="184" y="62" width="20" height="4" rx="2" fill="#E9CFC6" />
      <circle cx="202" cy="73" r="6.5" fill={COLORS.accent} />
      <g transform="translate(202 75.6) scale(0.22) translate(-212 -66)">
        <path
          d="M212 66 c-10 -8 -14 -14 -9 -19 c3 -3 7 -2 9 2 c2 -4 6 -5 9 -2 c5 5 1 11 -9 19 z"
          fill="#fff"
        />
      </g>

      {/* 3行目 */}
      <rect x="159" y="90" width="18" height="18" rx="4" fill="#F0ECE2" />
      <rect x="163" y="94" width="10" height="10" rx="2" fill={COLORS.moss} />
      <rect x="182" y="93" width="26" height="4" rx="2" fill="#E5DED6" />
      <rect x="182" y="100" width="16" height="3" rx="1.5" fill={COLORS.border} />

      {/* 手 */}
      <circle cx="147" cy="106" r="4" fill="#F5D0B5" />

      {/* 吹き出し */}
      <rect x="32" y="14" width="100" height="36" rx="14" fill={COLORS.accent} />
      <path d="M78 50 L86 63 L98 50 Z" fill={COLORS.accent} />
      <text x="82" y="36.5" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} fill="#fff">
        これ欲しい！
      </text>
      <circle cx="130" cy="18" r="10" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
      <g transform="translate(130 22.5) scale(0.4) translate(-212 -66)">
        <path
          d="M212 66 c-10 -8 -14 -14 -9 -19 c3 -3 7 -2 9 2 c2 -4 6 -5 9 -2 c5 5 1 11 -9 19 z"
          fill={COLORS.accent}
        />
      </g>
    </svg>
  );
}

// 特長3：会員登録不要でかんたん利用
function IllustrationNoSignup() {
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="アプリも会員登録もいらないイメージ">
      {/* 不要なもの（左：アプリ） */}
      <rect x="18" y="48" width="54" height="54" rx="12" fill="#fff" stroke={COLORS.inkSoft} strokeWidth="2" strokeDasharray="4 4" />
      <text x="45" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.inkSoft}>
        アプリ
      </text>
      <circle cx="72" cy="48" r="9" fill={COLORS.accent} />
      <path d="M68 44 L76 52 M76 44 L68 52" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />

      {/* 不要なもの（右：会員登録） */}
      <rect x="208" y="48" width="54" height="54" rx="12" fill="#fff" stroke={COLORS.inkSoft} strokeWidth="2" strokeDasharray="4 4" />
      <text x="235" y="80" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.inkSoft}>
        会員登録
      </text>
      <circle cx="262" cy="48" r="9" fill={COLORS.accent} />
      <path d="M258 44 L266 52 M266 44 L258 52" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />

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

// 特長4：無料で使える
function IllustrationFree() {
  const CHIP_W = 84;
  const chips = [
    { x: 4, y: 52, label: 'リスト作成' },
    { x: 192, y: 52, label: '共有' },
    { x: 98, y: 140, label: '手数料なし' },
  ];
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-[280px] mx-auto" role="img" aria-label="無料で使えるイメージ">
      <circle cx="140" cy="80" r="52" fill={COLORS.accent} />
      <circle cx="140" cy="80" r="42" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" opacity="0.7" />
      <text x="140" y="92" textAnchor="middle" fontSize="34" fontWeight="800" fontFamily={SVG_FONT} fill="#fff">
        0円
      </text>
      {chips.map((c) => {
        const contentW = 18 + c.label.length * 10;
        const left = c.x + (CHIP_W - contentW) / 2;
        return (
          <g key={c.label}>
            <rect x={c.x} y={c.y} width={CHIP_W} height="26" rx="13" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
            <circle cx={left + 6} cy={c.y + 13} r="6" fill={COLORS.mossSoft} />
            <path
              d={`M${left + 3} ${c.y + 13} L${left + 5.5} ${c.y + 15.5} L${left + 9.5} ${c.y + 10.5}`}
              fill="none" stroke={COLORS.moss} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
            <text x={left + 18} y={c.y + 17} fontSize="10" fontWeight="700" fontFamily={SVG_FONT} fill={COLORS.ink}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 特長
// ============================================================

const FEATURES = [
  {
    title: '知り合い限定だから安心・手軽',
    body: '知らない人との取引は/トラブルが心配。/知り合いだからこそ安心。/直接会って渡せば、/梱包や配送の/手間もかかりません。',
    Illustration: IllustrationTrust,
  },
  {
    title: '友達に気を遣わせず譲れる',
    body: '「実はこれ欲しかった」と/後日知ることも。/でも「これ欲しい？」と聞くのは、/相手に気を遣わせそう。/ゆずリスなら、/欲しい人が/自分から手を挙げる仕組みです。',
    Illustration: IllustrationAwkward,
  },
  {
    title: '会員登録不要でかんたん利用',
    body: 'アプリのインストールも、/会員登録もなしで/すぐに使えます。/受け取る友達に/インストールしてもらう/必要もありません。',
    Illustration: IllustrationNoSignup,
  },
  {
    title: '無料で使える',
    body: 'リストの作成も共有も、/費用はかかりません。/フリマアプリのような/手数料もありません。',
    note: '※今後、一部有料の機能を追加する場合があります。',
    Illustration: IllustrationFree,
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-5">
      {FEATURES.map(({ title, body, note, Illustration }, i) => (
        <div key={title} className="rounded-3xl px-5 pt-8 pb-7 text-center" style={{ backgroundColor: CARD_BG }}>
          <p className="italic font-bold text-sm mb-3" style={{ color: COLORS.accent }}>特長その{i + 1}</p>
          <h3 className="font-maru font-extrabold text-xl leading-snug mb-3" style={{ textWrap: 'balance' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-7" style={{ color: BODY }}>
            {body.split('/').map((s, j) => (
              <span key={j} className="inline-block">{s}</span>
            ))}
          </p>
          <Illustration />
          {note && (
            <p className="text-[11px] leading-relaxed mt-5" style={{ color: BODY }}>
              {note}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

// ============================================================
// こんなシーンでおすすめ
// ============================================================

const SCENES = [
  'まだ使える/サイズアウトした/子供用品',
  '引っ越しで/時間がない',
  '大学の教科書や/家具を後輩に/譲りたい',
  '大きいものは/フリマアプリだと/コスパが悪い',
];

const MARKER = 'rgba(226,121,93,0.28)'; // 蛍光ペン風の下線の色

export function ScenesSection() {
  return (
    <section className="py-14">
      <h2 className={`${H2_CLASS} mb-12`}>こんなシーンでおすすめ</h2>
      <ul className="space-y-8 text-center">
        {SCENES.map((s) => (
          <li key={s} className="font-maru font-bold text-[17px] leading-relaxed">
            {s.split('/').map((seg, j) => (
              <span
                key={j}
                className="inline-block"
                style={{ backgroundImage: `linear-gradient(transparent 62%, ${MARKER} 62%)` }}
              >
                {seg}
              </span>
            ))}
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

function KidsClothingIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="55%" height="55%" role="img" aria-label="キッズ服のイラスト">
      {/* パフスリーブ */}
      <circle cx="24" cy="34" r="10" fill={COLORS.accent} stroke={COLORS.ink} strokeWidth="3" />
      <circle cx="76" cy="34" r="10" fill={COLORS.accent} stroke={COLORS.ink} strokeWidth="3" />
      {/* 本体（Aラインワンピース） */}
      <path
        d="M34,26 C27,29 23,35 26,42 L18,84 Q50,92 82,84 L74,42 C77,35 73,29 66,26 Q50,40 34,26 Z"
        fill={COLORS.accent}
        stroke={COLORS.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* 胸元のリボン */}
      <path d="M50,34 L40,28 L40,40 Z" fill={COLORS.moss} stroke={COLORS.ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M50,34 L60,28 L60,40 Z" fill={COLORS.moss} stroke={COLORS.ink} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="50" cy="34" r="3.4" fill={COLORS.moss} stroke={COLORS.ink} strokeWidth="1.6" />
      {/* 水玉 */}
      <circle cx="38" cy="58" r="3.2" fill={COLORS.accentSoft} />
      <circle cx="62" cy="58" r="3.2" fill={COLORS.accentSoft} />
      <circle cx="50" cy="70" r="3.2" fill={COLORS.accentSoft} />
      <circle cx="34" cy="80" r="3.2" fill={COLORS.accentSoft} />
      <circle cx="66" cy="80" r="3.2" fill={COLORS.accentSoft} />
    </svg>
  );
}

// 1. 譲りたいものを入力する
function ScreenInput() {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-[8px] font-bold mb-1" style={LABEL}>写真</p>
        <div className="w-3/5 mx-auto aspect-square rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.accentSoft }}>
          <KidsClothingIllustration />
        </div>
      </div>
      <div>
        <p className="text-[8px] font-bold mb-1" style={LABEL}>品名</p>
        <p className="font-maru font-extrabold text-[12px] pb-1 border-b" style={{ borderColor: COLORS.border }}>
          キッズ服（95cmサイズ）
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
      <div className="py-2 rounded-full text-center text-[9px] font-bold" style={{ backgroundColor: COLORS.accent, color: '#fff', marginTop: 20 }}>
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
  { title: '譲りたいものを登録する', body: '写真・品名・状態を入れるだけ。/サクッと出品できます。', Screen: ScreenInput },
  { title: 'リストを友達にシェアする', body: '作ったリストのURLをLINEなどでシェアするだけ。/URLを知っている人だけがアクセスできます。', Screen: ScreenShare },
  { title: '欲しい人がいたらマッチング', body: '欲しい人がいたらマッチングします。', Screen: ScreenMatching },
  { title: '譲ったらお譲り完了', body: '友達と連絡をとって、大切にしていたものを譲ろう。', Screen: ScreenDone },
];

export function StepsSection() {
  return (
    <section>
      <h2 className={`${H2_CLASS} mb-8`}>1分でわかる使い方</h2>
      <div className="space-y-12">
        {STEPS.map(({ title, body, Screen }, i) => (
          <div key={title}>
            <h3 className="font-maru font-extrabold text-lg text-center mb-5">{i + 1}. {title}</h3>
            <PhoneStage>
              <Screen />
            </PhoneStage>
            <p className="text-[15px] leading-relaxed mt-5" style={{ color: COLORS.ink }}>
              {body.split('/').map((s, j) => (
                <span key={j} className="inline-block">{s}</span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
