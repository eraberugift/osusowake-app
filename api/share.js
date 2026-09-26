// 共有リンク（/s/リストID）を開いたときの処理
// ・LINEなどのプレビュー用に、そのリスト専用のカード情報（OGP）を返す
// ・人が開いた場合は、すぐにいつものリスト画面へ移動させる
export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function fromSupabase(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res.json();
}

// HTMLに入れても壊れないように記号を置き換える
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async function handler(req) {
  const url = new URL(req.url);
  const origin = url.origin;
  const id = url.searchParams.get('id') || '';
  const v = url.searchParams.get('v') || '';

  // IDの形がおかしいときはトップへ
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.redirect(`${origin}/`, 302);
  }

  let title = 'わたしのおゆずりしたいもの';
  let names = [];
  let openCount = 0;

  try {
    const [lists, items] = await Promise.all([
      fromSupabase(`lists?id=eq.${id}&select=title`),
      fromSupabase(`items?list_id=eq.${id}&select=name,status&order=created_at.desc`),
    ]);
          if (lists[0]?.title && lists[0].title !== 'ゆずりたいものリスト') title = lists[0].title;
    const open = items.filter((it) => it.status === 'open');
    openCount = open.length;
    names = open.slice(0, 3).map((it) => it.name);
  } catch (_) {}

  const pageTitle = `${title}｜ゆずリス`;
  // カードの下に出る説明文（やさしい「おゆずり」の雰囲気で）
  // 写真は最大3枚なので、それより多いときだけ残りの数を添える
  const moreCount = openCount - 3;
  const description =
    '大切にしてきたものを、次に使ってくれる方へおゆずりします。' +
    (moreCount > 0 ? `写真の他にもあります。` : '');

  const listPage = `${origin}/?list=${id}&view=guest`;
  const shareUrl = `${origin}/s/${id}${v ? `?v=${encodeURIComponent(v)}` : ''}`;
  const imageUrl = `${origin}/api/og?id=${id}${v ? `&v=${encodeURIComponent(v)}` : ''}`;

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="ゆずリス" />
<meta property="og:title" content="${esc(pageTitle)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(shareUrl)}" />
<meta property="og:image" content="${esc(imageUrl)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(pageTitle)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${esc(imageUrl)}" />
<meta http-equiv="refresh" content="0; url=${esc(listPage)}" />
</head>
<body>
<script>location.replace(${JSON.stringify(listPage)});</script>
<p><a href="${esc(listPage)}">リストを開く</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=60',
    },
  });
}
