import { ImageResponse } from '@vercel/og';
import qrcode from 'qrcode-generator';

// Instagramストーリーズ用の縦長画像（1080×1920）を作る
// 使い方：/api/story?id=リストID
// デザイン：招待状風のチケット（上：便箋＋写真3枚、下：QRコードの半券）
export const config = { runtime: 'edge' };

const W = 1080;
const H = 1920;

const BG = '#F2A386';      // 背景のやさしいオレンジ（切り欠きの色と同じにする）
const PAPER = '#FFF8F0';   // チケットの紙の色
const CARD_W = 860;

const PHOTO = 176;
const FRAME_PAD = 12;
const FRAME_BOTTOM = 30;
const TILTS = ['rotate(-4deg)', 'rotate(2deg) translateY(-8px)', 'rotate(-2deg)'];

const C = {
  ink: '#2E2A26',
  inkSoft: '#9C9389',
  body: '#6F675F',
  accent: '#E2795D',
  accentDeep: '#C25F45',
  accentSoft: '#FBE7E0',
  tile: '#F0ECE2',
  line: '#EAD9CA',
  dot: '#EAC3AE',
};

const HEAD = 'もらってくれる人を探しています';
const MSG1 = '大切にしてきたものを、';
const MSG2 = '次に使ってくれる方へ。';
const STUB1 = '欲しいものがあれば';
const STUB2 = '「これ欲しい！」で教えてね';
const LOGO = 'ゆずリス';
const INVITATION = 'INVITATION';

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

async function loadFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const m = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!m) throw new Error('font not found');
  return (await fetch(m[1])).arrayBuffer();
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

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';

  // タイトルが初期値のままなら、やさしい固定の文言にする
  let title = 'わたしのおゆずりしたいもの';
  let items = [];

  if (/^[0-9a-f-]{36}$/i.test(id)) {
    try {
      const [lists, its] = await Promise.all([
        fromSupabase(`lists?id=eq.${id}&select=title`),
        fromSupabase(`items?list_id=eq.${id}&select=name,image,status&order=created_at.desc`),
      ]);
      if (lists[0]?.title && lists[0].title !== 'ゆずりたいものリスト') title = lists[0].title;
      items = its;
    } catch (_) {}
  }

  const open = items.filter((it) => it.status === 'open');
  const picks = [...open.filter((it) => it.image), ...open.filter((it) => !it.image)].slice(0, 3);

  const shownTitle = shorten(title, 14);
  const pickNames = picks.map((it) => shorten(it.name, 6));

  // 写真に出ていないアイテムの数（4つ以上あるとき「他◯品もあります」を出す）
  const moreCount = open.length - picks.length;
  const moreText = moreCount > 0 ? `他${moreCount}品もあります` : '';

  // ---- 部品 ----
  const frame = (inner, i) =>
    h('div', {
      display: 'flex',
      padding: `${FRAME_PAD}px ${FRAME_PAD}px ${FRAME_BOTTOM}px`,
      backgroundColor: '#fff',
      border: `2px solid ${C.line}`,
      borderRadius: 8,
      boxShadow: '0 8px 18px rgba(120, 90, 60, 0.14)',
      transform: TILTS[i % TILTS.length],
    }, [inner]);

  const textTile = (text, bg) =>
    h('div', {
      width: PHOTO, height: PHOTO, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: bg, borderRadius: 4, color: C.ink,
      fontFamily: 'Maru', fontSize: 28, padding: 14, textAlign: 'center',
    }, text);

  const photos = picks.length
    ? picks.map((it, i) =>
        frame(
          it.image
            ? { type: 'img', props: { src: it.image, width: PHOTO, height: PHOTO, style: { objectFit: 'cover', borderRadius: 4 } } }
            : textTile(pickNames[i], C.tile),
          i
        )
      )
    : [frame(textTile(LOGO, C.accentSoft), 0)];

  const smallDot = () => h('div', { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent });

  const blob = (style) => h('div', { position: 'absolute', display: 'flex', borderRadius: 9999, ...style });

  // ---- チケット上半分 ----
  const top = h('div', {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: CARD_W, backgroundColor: PAPER, padding: '64px 48px 48px',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
  }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
      smallDot(),
      h('div', { display: 'flex', fontFamily: 'Maru', fontSize: 30, letterSpacing: 10, color: C.accent }, INVITATION),
      smallDot(),
    ]),
    h('div', { display: 'flex', fontFamily: 'Hand', fontSize: 44, color: C.accentDeep, marginTop: 14 }, HEAD),
    h('div', { display: 'flex', width: 480, height: 3, backgroundColor: C.line, margin: '32px 0' }),
    h('div', { display: 'flex', fontFamily: 'Maru', fontSize: 56, color: C.ink }, shownTitle),
    h('div', { display: 'flex', gap: 28, marginTop: 52 }, photos),
    // 他にもアイテムがあるときの小さなラベル
    ...(moreText
      ? [h('div', {
          display: 'flex', marginTop: 36, padding: '10px 32px', borderRadius: 999,
          backgroundColor: C.accentSoft, color: C.accentDeep, fontFamily: 'Maru', fontSize: 32,
        }, moreText)]
      : []),
    h('div', {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: 'Hand', fontSize: 40, lineHeight: 1.7, color: C.body, marginTop: 52,
    }, [h('div', { display: 'flex' }, MSG1), h('div', { display: 'flex' }, MSG2)]),
  ]);

  // ---- 切り取り線（左右に半円の切り欠き） ----
  const perforation = h('div', {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: CARD_W, height: 56, backgroundColor: PAPER, position: 'relative',
  }, [
    h('div', { position: 'absolute', left: -28, top: 0, width: 56, height: 56, borderRadius: 28, backgroundColor: BG }),
    h('div', { position: 'absolute', right: -28, top: 0, width: 56, height: 56, borderRadius: 28, backgroundColor: BG }),
    h('div', { display: 'flex', gap: 20 },
      Array.from({ length: 22 }, () => h('div', { width: 10, height: 10, borderRadius: 5, backgroundColor: C.dot }))
    ),
  ]);

  // ---- 半券（QRコード） ----
  const stub = h('div', {
    display: 'flex', alignItems: 'center', gap: 40,
    width: CARD_W, backgroundColor: PAPER, padding: '36px 56px 56px',
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  }, [
    {
      type: 'img',
      props: {
        src: qrDataUrl(`${url.origin}/s/${id}`),
        width: 220, height: 220,
        style: { borderRadius: 16, border: `2px solid ${C.line}` },
      },
    },
    h('div', { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }, [
      h('div', { display: 'flex', fontFamily: 'Maru', fontSize: 34, lineHeight: 1.6, color: C.ink }, STUB1),
      h('div', { display: 'flex', fontFamily: 'Maru', fontSize: 34, lineHeight: 1.6, color: C.ink }, STUB2),
      h('div', { display: 'flex', fontFamily: 'Maru', fontSize: 44, color: C.accent, marginTop: 20 }, LOGO),
    ]),
  ]);

  const root = h('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: BG, position: 'relative', paddingBottom: 260, // 下にリンクスタンプ用の余白
  }, [
    // 背景のふんわりした丸
    blob({ top: -180, left: -140, width: 560, height: 560, backgroundColor: 'rgba(255,255,255,0.18)' }),
    blob({ bottom: -220, right: -180, width: 680, height: 680, backgroundColor: 'rgba(226,121,93,0.35)' }),
    blob({ top: 240, right: 150, width: 18, height: 18, backgroundColor: 'rgba(255,255,255,0.75)' }),
    blob({ top: 320, left: 120, width: 12, height: 12, backgroundColor: 'rgba(255,255,255,0.6)' }),
    blob({ bottom: 300, left: 190, width: 14, height: 14, backgroundColor: 'rgba(255,255,255,0.6)' }),
    // チケット本体
    h('div', {
      display: 'flex', flexDirection: 'column', width: CARD_W,
      boxShadow: '0 24px 48px rgba(120, 60, 30, 0.22)', borderRadius: 40,
    }, [top, perforation, stub]),
  ]);

  const maruText = [INVITATION, shownTitle, STUB1, STUB2, LOGO, moreText, '…', ...pickNames].join('');
  const handText = HEAD + MSG1 + MSG2;
  const fonts = [];
  try {
    fonts.push({ name: 'Maru', data: await loadFont('M+PLUS+Rounded+1c', 800, maruText), weight: 800, style: 'normal' });
  } catch (_) {}
  try {
    fonts.push({ name: 'Hand', data: await loadFont('Klee+One', 600, handText), weight: 600, style: 'normal' });
  } catch (_) {}

  return new ImageResponse(root, {
    width: W,
    height: H,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  });
}
