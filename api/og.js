import { ImageResponse } from '@vercel/og';

// LINEなどのプレビューカード用の画像（1200×630）を作る
// 使い方：/api/og?id=リストID
// デザイン：クリーム色の便箋に、白いフチの写真を少し傾けて並べる
export const config = { runtime: 'edge' };

const W = 1200;
const H = 630;

// 写真のフチ（ポラロイド風）
const PHOTO = 256;        // 写真そのものの大きさ
const FRAME_PAD = 12;     // フチの太さ（上・左右）
const FRAME_BOTTOM = 34;  // フチの太さ（下だけ少し広く）
const FRAME_GAP = 56;     // 写真同士のすき間
const TILTS = [
  'rotate(-4deg)',
  'rotate(2deg) translateY(-8px)',
  'rotate(-2deg)',
];

const C = {
  paper: '#FFF8F0',
  ink: '#2E2A26',
  accent: '#E2795D',
  accentDeep: '#C25F45',
  accentSoft: '#FBE7E0',
  tile: '#F0ECE2',
  frameLine: '#EFE2D6',
};

const TAGLINE = '誰か欲しい人いるかな？';
const LOGO = 'ゆずリス';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// 画像の部品を作る小さな関数（JSXを使わずに書くため）
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

const shorten = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

export default async function handler(req) {
  const id = new URL(req.url).searchParams.get('id') || '';

  // タイトルが初期値のままなら、やさしい固定の文言にする
  let title = 'わたしのおゆずりしたいもの';
  let items = [];

  // IDの形が正しいときだけSupabaseに問い合わせる
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

  // 募集中のアイテムを、写真あり → 写真なし の順で最大3つ
  const open = items.filter((it) => it.status === 'open');
  const picks = [...open.filter((it) => it.image), ...open.filter((it) => !it.image)].slice(0, 3);

  const shownTitle = shorten(title, 16);
  const pickNames = picks.map((it) => shorten(it.name, 8));

  // 写真1枚ぶん（白いフチつき）
  const frame = (inner, i) =>
    h('div', {
      display: 'flex',
      padding: `${FRAME_PAD}px ${FRAME_PAD}px ${FRAME_BOTTOM}px`,
      backgroundColor: '#fff',
      border: `1px solid ${C.frameLine}`,
      borderRadius: 8,
      boxShadow: '0 8px 20px rgba(120, 90, 60, 0.16)',
      transform: TILTS[i % TILTS.length],
    }, [inner]);

  // 写真がないときは、品名を書いたやわらかい色のタイル
  const textTile = (text, bg) =>
    h('div', {
      width: PHOTO, height: PHOTO, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: bg, borderRadius: 4, color: C.ink,
      fontFamily: 'Maru', fontWeight: 800, fontSize: 34, padding: 20, textAlign: 'center',
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

  const root = h('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column', alignItems: 'center',
    backgroundColor: C.paper, paddingTop: 44, position: 'relative',
  }, [
    // 手書き風のひとこと
    h('div', { display: 'flex', fontFamily: 'Hand', fontWeight: 600, fontSize: 40, color: C.accentDeep, letterSpacing: 2 }, TAGLINE),
    // リスト名
    h('div', { display: 'flex', fontFamily: 'Maru', fontWeight: 800, fontSize: 60, color: C.ink, marginTop: 6 }, shownTitle),
    // 写真
    h('div', { display: 'flex', gap: FRAME_GAP, marginTop: 40 }, photos),
    // 右下のロゴ
    h('div', {
      display: 'flex', position: 'absolute', right: 64, bottom: 36,
      fontFamily: 'Maru', fontWeight: 800, fontSize: 32, color: C.accent,
    }, LOGO),
  ]);

  // 画像に出てくる文字の分だけフォントを読む
  const maruText = [shownTitle, LOGO, '…', ...pickNames].join('');
  const fonts = [];
  await Promise.all([
    addFont(fonts, 'Maru', 'M+PLUS+Rounded+1c', 800, maruText),
    addFont(fonts, 'Hand', 'Klee+One', 600, TAGLINE),
  ]);

  return new ImageResponse(root, {
    width: W,
    height: H,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  });
}
