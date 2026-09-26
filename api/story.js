import { ImageResponse } from '@vercel/og';
import qrcode from 'qrcode-generator';
import { SAMPLE } from './_sample.js';

// Instagramストーリーズ用の縦長画像（1080×1920）を作る
// 使い方：/api/story?id=リストID
//         /api/story?sample=1 で、共有シートのプレビューに使う「見本」を作る
// デザイン：1枚のカードに、写真を「大1枚＋小2枚」散らして置く。下にQRコード
export const config = { runtime: 'edge' };

const W = 1080;
const H = 1920;

const BG = '#F3D5C3';     // 背景の淡いピーチ
const PAPER = '#FFFAF4';  // カードの紙の色
const CARD_W = 928;
const CARD_PAD_X = 56;
const INNER_W = CARD_W - CARD_PAD_X * 2; // 816

// 写真（ポラロイド風）
const BIG = { photo: 448, pad: 24, bottom: 80 };
const SMALL = { photo: 256, pad: 16, bottom: 48 };
const BIG_W = BIG.photo + BIG.pad * 2;     // 496
const SMALL_W = SMALL.photo + SMALL.pad * 2; // 288

const C = {
  ink: '#2E2A26',
  body: '#6F675F',
  accent: '#E2795D',
  accentDeep: '#C25F45',
  accentSoft: '#FBE7E0',
  tile: '#F0ECE2',
  line: '#EBD8C8',
};

const HEAD = '誰か欲しい人いるかな？';
const MSG = '大事に使ってたものだよ。よかったらもらってね';
const STUB1 = '欲しいものがあれば';
const STUB2 = '「これ欲しい！」で教えてね';
const LOGO = 'ゆずリス';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const h = (type, style, children) => ({ type, props: { style, children } });

async function fromSupabase(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res.json();
}

// 画像に使う文字だけをGoogle Fontsから読み込む
// （日本語フォントは複数のファイルに分かれて返ってくることがあるので、全部読む）
async function addFont(fonts, name, family, weight, text) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const files = [...css.matchAll(/src: url\((.+?)\) format\('(opentype|truetype)'\)/g)].map((m) => m[1]);
    const datas = await Promise.all(files.map((f) => fetch(f).then((r) => r.arrayBuffer())));
    datas.forEach((data) => fonts.push({ name, data, weight, style: 'normal' }));
  } catch (_) {}
}

// QRコードをSVG画像にする
function qrDataUrl(text) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges">` +
    `<rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/>` +
    `<path d="${d}" fill="${C.ink}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const shorten = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

// 文字の部品（フォントと太さを必ずセットで指定する）
const maru = (text, size, weight, color, extra = {}) =>
  h('div', { display: 'flex', fontFamily: 'Maru', fontWeight: weight, fontSize: size, color, ...extra }, text);

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const isSample = url.searchParams.get('sample') === '1';

  // タイトルが初期値のままなら、やさしい固定の文言にする
  let title = 'わたしのおゆずりしたいもの';
  let items = [];

  if (isSample) {
    // 見本：ダミーのリスト名と、シルエット画像のアイテム
    title = SAMPLE.title;
    items = SAMPLE.items;
  } else if (/^[0-9a-f-]{36}$/i.test(id)) {
    try {
      const [lists, its] = await Promise.all([
        fromSupabase(`lists?id=eq.${id}&select=title`),
        fromSupabase(`items?list_id=eq.${id}&select=name,image,status&order=created_at.desc`),
      ]);
      if (lists[0]?.title && lists[0].title !== 'ゆずりたいものリスト') title = lists[0].title;
      items = its;
    } catch (_) {}
  }

  // 募集中のアイテムを、写真あり → 写真なし の順で最大3つ
  const open = items.filter((it) => it.status === 'open');
  const picks = [...open.filter((it) => it.image), ...open.filter((it) => !it.image)].slice(0, 3);

  const shownTitle = shorten(title, 13);
  const pickNames = picks.map((it) => shorten(it.name, 8));
  const moreCount = open.length - picks.length;
  const moreText = moreCount > 0 ? `他${moreCount}品もあります` : '';

  // ---- 写真（大1枚＋小2枚を散らす） ----
  const photoInner = (it, i, size) =>
    it?.image
      ? { type: 'img', props: { src: it.image, width: size, height: size, style: { objectFit: 'cover', borderRadius: 4 } } }
      : h('div', {
          width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: it ? C.tile : C.accentSoft, borderRadius: 4, padding: 20, textAlign: 'center',
          fontFamily: 'Maru', fontWeight: 800, fontSize: size > 300 ? 48 : 30, color: C.ink,
        }, it ? pickNames[i] : LOGO);

  const polaroid = (it, i, s, pos) =>
    h('div', {
      position: 'absolute', display: 'flex',
      padding: `${s.pad}px ${s.pad}px ${s.bottom}px`,
      backgroundColor: '#fff', borderRadius: 6,
      boxShadow: '0 12px 28px rgba(120, 80, 50, 0.22)',
      ...pos,
    }, [photoInner(it, i, s.photo)]);

  const pileHeight = picks.length >= 2 ? 672 : BIG.photo + BIG.pad + BIG.bottom + 20;
  const pile = h('div', { display: 'flex', position: 'relative', width: INNER_W, height: pileHeight, marginTop: 48 }, [
    // 小さい写真（大きい写真の下に隠れるように先に置く）
    ...(picks[1] ? [polaroid(picks[1], 1, SMALL, { left: 16, top: 280, transform: 'rotate(-9deg)' })] : []),
    ...(picks[2] ? [polaroid(picks[2], 2, SMALL, { right: 16, top: 304, transform: 'rotate(8deg)' })] : []),
    // 大きい写真
    polaroid(picks[0], 0, BIG, { left: (INNER_W - BIG_W) / 2, top: 0, transform: 'rotate(-3deg)' }),
  ]);

  // ---- 点線 ----
  const dashes = h('div', { display: 'flex', gap: 12, width: INNER_W, marginTop: 48, marginBottom: 40 },
    Array.from({ length: 26 }, () => h('div', { width: 20, height: 4, borderRadius: 2, backgroundColor: C.line }))
  );

  // ---- 下の段：QRコード＋案内＋ロゴ ----
  const stub = h('div', { display: 'flex', alignItems: 'center', gap: 32, width: INNER_W }, [
    {
      type: 'img',
      props: {
        // 見本のQRコードは、ゆずリスのトップページにつなげておく
        src: qrDataUrl(isSample ? `${url.origin}/` : `${url.origin}/s/${id}`),
        width: 160, height: 160,
        style: { borderRadius: 16, border: `2px solid ${C.line}` },
      },
    },
    h('div', { display: 'flex', flexDirection: 'column', flex: 1 }, [
      maru(STUB1, 30, 500, C.ink, { lineHeight: 1.55 }),
      maru(STUB2, 30, 500, C.ink, { lineHeight: 1.55 }),
    ]),
    maru(LOGO, 40, 800, C.accent, { alignSelf: 'flex-end' }),
  ]);

  // ---- カード ----
  const card = h('div', {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: CARD_W, backgroundColor: PAPER, borderRadius: 64,
    padding: `64px ${CARD_PAD_X}px 48px`,
    boxShadow: '0 32px 80px rgba(140, 80, 50, 0.18)',
  }, [
    maru(HEAD, 34, 500, C.accentDeep, { letterSpacing: 3 }),
    maru(shownTitle, 64, 800, C.ink, { marginTop: 20 }),
    pile,
    ...(moreText
      ? [maru(moreText, 34, 800, C.accentDeep, {
          marginTop: 8, padding: '12px 40px', borderRadius: 999, backgroundColor: C.accentSoft,
        })]
      : []),
    h('div', {
      display: 'flex', fontFamily: 'Hand', fontWeight: 600, fontSize: 34,
      color: C.body, letterSpacing: 1, marginTop: 40,
    }, MSG),
    dashes,
    stub,
  ]);

  const blob = (style) => h('div', { position: 'absolute', display: 'flex', borderRadius: 9999, ...style });

  const root = h('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column', alignItems: 'center',
    backgroundColor: BG, position: 'relative', paddingTop: 134, // 下はリンクスタンプ用に空けておく
  }, [
    blob({ top: -200, left: -160, width: 600, height: 600, backgroundColor: 'rgba(255,255,255,0.28)' }),
    blob({ bottom: -240, right: -200, width: 760, height: 760, backgroundColor: 'rgba(226,121,93,0.22)' }),
    card,
  ]);

  // フォント（丸ゴシックは太さ2種類、手書き風は1文だけ）
  const maruBoldText = [shownTitle, LOGO, moreText, '…', ...pickNames].join('');
  const maruMidText = HEAD + STUB1 + STUB2;
  const fonts = [];
  await Promise.all([
    addFont(fonts, 'Maru', 'M+PLUS+Rounded+1c', 800, maruBoldText),
    addFont(fonts, 'Maru', 'M+PLUS+Rounded+1c', 500, maruMidText),
    addFont(fonts, 'Hand', 'Klee+One', 600, MSG),
  ]);

  return new ImageResponse(root, {
    width: W,
    height: H,
    fonts,
    // 見本は中身が変わらないので長めに覚えさせて、2回目以降はすぐ表示されるようにする
    headers: {
      'Cache-Control': isSample
        ? 'public, max-age=86400, s-maxage=604800'
        : 'public, max-age=300, s-maxage=300',
    },
  });
}
