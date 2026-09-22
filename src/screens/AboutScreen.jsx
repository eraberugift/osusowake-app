import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import GlobalStyle from '../components/GlobalStyle.jsx';

// 手紙の紙の色（アプリの背景より少しだけ白く）
const PAPER = '#FFFDF8';

// この画面だけで使うフォント・アニメーション
// 本文は明朝体（手紙・読み物の雰囲気）、署名は手書き風の Klee One
const LETTER_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500;700&family=Klee+One:wght@400;600&display=swap');
  .font-mincho { font-family: 'Zen Old Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', serif; }
  .font-hand { font-family: 'Klee One', 'Hiragino Maru Gothic ProN', 'Yu Gothic', sans-serif; }
  .letter-body { line-break: strict; }
  .letter-paper { animation: letter-in 700ms ease-out both; }
  @keyframes letter-in { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .letter-paper { animation: none; } }
  .about-link:focus-visible { outline: 2px solid ${COLORS.indigo}; outline-offset: 3px; }

  /* 切手：ふちのギザギザは mask で本当に切り抜く（幅・高さは 8px の倍数にすると端がきれいに揃う） */
  .stamp-wrap { flex-shrink: 0; transform: rotate(3deg); filter: drop-shadow(0 1px 1.5px rgba(46,42,38,0.22)); }
  .stamp {
    position: relative;
    width: 96px; height: 72px; box-sizing: border-box;
    padding: 12px 11px;
    display: flex; align-items: center; justify-content: center;
    background: #fff;
    -webkit-mask:
      radial-gradient(circle at center, transparent 2.5px, #000 3px) -4px -4px / 8px 8px,
      linear-gradient(#000, #000) center / calc(100% - 8px) calc(100% - 8px) no-repeat;
    mask:
      radial-gradient(circle at center, transparent 2.5px, #000 3px) -4px -4px / 8px 8px,
      linear-gradient(#000, #000) center / calc(100% - 8px) calc(100% - 8px) no-repeat;
  }
  .stamp::after { content: ''; position: absolute; inset: 6px; border: 1px solid rgba(226,121,93,0.4); pointer-events: none; }
  .stamp img { width: 100%; height: 100%; object-fit: contain; display: block; }
`;

// 本文（段落ごと）
const PARAGRAPHS_BEFORE_QUOTE = [
  'これから先、円安やインフレが進み、これまでのように「大量にモノを作り、大量に消費する」という時代は終わりを告げようとしています。原材料の不足も相まって、これからは「いつでも好きな時に新しいモノを買う」ことが当たり前ではなくなっていくかもしれません。',
  'そんな時代の中で、私は「まだ十分に使えるモノを、友人や知り合い同士で譲り合い、助け合える世界を作りたい」と考えました。',
  '私自身、映画『トイ・ストーリー3』を観たときに深く心を動かされた経験があります。思いの詰まったモノが、それを大切にしてくれる次の人の手へと受け継がれていく——。その温かいバトンタッチこそが、本来あるべきモノの姿であり、とても尊いことだと感じたのです。',
  '既存のフリマアプリは梱包や発送の手間が大きく、どこか事務的で、初期の頃にあったような「人の温もり」が薄れてしまったように感じます。一方で、掲示板型の譲り合いサービスは、知らない人と直接会う心理的な不安や怖さが拭えません。',
];

const QUOTE = '「もし、気心の知れたお友達同士で、もっと滑らかにモノを譲り合えたら、どれほど温かい世界になるだろう？」';
const AFTER_QUOTE = 'それが、このサービスを立ち上げた原点です。';

const PARAGRAPHS_AFTER_QUOTE = [
  '今の世の中は資本主義の仕組みの中で、常に「成長」や「新しい消費」を求められ続けています。けれど、私たちはすでに十分に便利で豊かな生活を享受しています。だからこそ、これからは果てしない消費を競うのではなく、次の世代のために環境を維持し、今ある便利さや豊かさを「持続可能な形で残していく」フェーズに入っているのではないでしょうか。',
  '経済的にも暮らしを楽にし、地球環境にも優しく、そして何より人との繋がりを感じられる。 このツールが、そんな「譲り合いの精神」に満ちた、温かく人間らしい世界を作る一助になれば嬉しいです。',
];

const CLOSING = 'もう使わないモノを”ありがとう”に。';

const bodyText = { fontSize: 15, lineHeight: 2.1, letterSpacing: '0.04em' };

// 開発者の想い（?about=1）
export default function AboutScreen() {
  useEffect(() => {
    const prev = document.title;
    document.title = '開発者の想い｜ゆずリス';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />
      <style>{LETTER_STYLE}</style>

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(253,251,249,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <a href={topUrl()} className="about-link flex items-center gap-1 text-xs font-bold underline" style={{ color: COLORS.indigo }}>
            <ChevronLeft size={14} />
            トップに戻る
          </a>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 pb-16">
        <article
          className="letter-paper font-mincho px-6 pt-7 pb-9"
          style={{
            backgroundColor: PAPER,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 4,
            boxShadow: '0 10px 28px -14px rgba(46,42,38,0.22)',
          }}
        >
          {/* 便箋の頭：タイトルと切手 */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <h1 className="font-bold text-2xl pt-1" style={{ letterSpacing: '0.12em' }}>
              開発者の想い
            </h1>
            <div className="stamp-wrap">
              <div className="stamp">
                <img src="/squirrels-logo.png" alt="" />
              </div>
            </div>
          </div>

          {/* 一行目：手紙の主題 */}
          <p
            className="font-medium pb-7 mb-7 border-b"
            style={{ ...bodyText, lineHeight: 1.9, color: COLORS.accentDeep, borderColor: COLORS.border, textWrap: 'balance' }}
          >
            「モノを大切にし、人と人が温かく助け合う持続可能な世界を」
          </p>

          <div className="letter-body space-y-6" style={bodyText}>
            {PARAGRAPHS_BEFORE_QUOTE.map((t) => (
              <p key={t} style={{ textIndent: '1em' }}>{t}</p>
            ))}

            {/* 想いの核心：中央に置く */}
            <div className="text-center py-3">
              <p
                className="font-medium mb-3"
                style={{ fontSize: 17, lineHeight: 2, color: COLORS.accentDeep, textWrap: 'balance' }}
              >
                {QUOTE}
              </p>
              <p>{AFTER_QUOTE}</p>
            </div>

            {PARAGRAPHS_AFTER_QUOTE.map((t) => (
              <p key={t} style={{ textIndent: '1em' }}>{t}</p>
            ))}
          </div>

          {/* 結び */}
          <p
            className="text-center font-bold mt-12"
            style={{ fontSize: 18, lineHeight: 1.9, letterSpacing: '0.06em', textWrap: 'balance' }}
          >
            {CLOSING}
          </p>

          <p className="font-hand text-right mt-8" style={{ fontSize: 16, color: COLORS.inkSoft, letterSpacing: '0.06em' }}>
            ゆずリス 開発者
          </p>
        </article>

        <a
          href={topUrl()}
          className="about-link block mt-8 w-full text-center py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
        >
          ゆずリスを使ってみる
        </a>
      </main>
    </div>
  );
}
