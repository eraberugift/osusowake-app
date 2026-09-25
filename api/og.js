import { ImageResponse } from '@vercel/og';

// LINEなどのプレビューカード用の画像（1200×630）を作る
// 使い方：/api/og?id=リストID
export const config = { runtime: 'edge' };

const W = 1200;
const H = 630;
const BAND = 130; // 下の帯の高さ
const PAD = 20;
const GAP = 16;

const C = {
  bg: '#FDFBF9',
  ink: '#2E2A26',
  accent: '#E2795D',
  accentDeep: '#C25F45',
  accentSoft: '#FBE7E0',
  tile: '#F0ECE2',
};

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
async function loadFont(text) {
  const url = `https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@800&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const m = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!m) throw new Error('font not found');
  return (await fetch(m[1])).arrayBuffer();
}

const shorten = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

export default async function handler(req) {
  const id = new URL(req.url).searchParams.get('id') || '';

  let title = 'ゆずりたいものリスト';
  let items = [];

  // IDの形が正しいときだけSupabaseに問い合わせる
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    try {
      const [lists, its] = await Promise.all([
        fromSupabase(`lists?id=eq.${id}&select=title`),
        fromSupabase(`items?list_id=eq.${id}&select=name,image,status&order=created_at.desc`),
      ]);
      if (lists[0]?.title) title = lists[0].title;
      items = its;
    } catch (_) {}
  }

  // 募集中のアイテムを、写真あり → 写真なし の順で最大3つ
  const open = items.filter((it) => it.status === 'open');
  const picks = [...open.filter((it) => it.image), ...open.filter((it) => !it.image)].slice(0, 3);

  const n = Math.max(picks.length, 1);
  const tileW = Math.floor((W - PAD * 2 - GAP * (n - 1)) / n);
  const tileH = H - BAND - PAD - GAP;

  const textTile = (text, bg) =>
    h('div', {
      width: tileW, height: tileH, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: bg, borderRadius: 24, color: C.ink, fontSize: 44, padding: 24, textAlign: 'center',
    }, text);

  const tiles = picks.length
    ? picks.map((it) =>
        it.image
          ? { type: 'img', props: { src: it.image, width: tileW, height: tileH, style: { objectFit: 'cover', borderRadius: 24 } } }
          : textTile(shorten(it.name, 12), C.tile)
      )
    : [textTile('ゆずリス', C.accentSoft)];

  const pill = open.length > 0 ? `募集中 ${open.length}件` : '受付終了';
  const shownTitle = shorten(title, 16);

  const root = h('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column',
    backgroundColor: C.bg, fontFamily: 'Maru',
  }, [
    // 上：写真3枚
    h('div', { display: 'flex', gap: GAP, padding: `${PAD}px ${PAD}px ${GAP}px` }, tiles),
    // 下：リスト名と件数の帯
    h('div', {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: BAND, padding: '0 40px', backgroundColor: C.accent,
    }, [
      h('div', { display: 'flex', color: '#fff', fontSize: 54 }, shownTitle),
      h('div', {
        display: 'flex', backgroundColor: '#fff', color: C.accentDeep,
        fontSize: 36, padding: '8px 28px', borderRadius: 999,
      }, pill),
    ]),
  ]);

  // 画像に出てくる文字をすべて渡して、その分だけフォントを読む
  const allText = [shownTitle, pill, 'ゆずリス…', ...picks.map((it) => shorten(it.name, 12))].join('');
  let fonts = [];
  try {
    fonts = [{ name: 'Maru', data: await loadFont(allText), weight: 800, style: 'normal' }];
  } catch (_) {}

  return new ImageResponse(root, {
    width: W,
    height: H,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  });
}
