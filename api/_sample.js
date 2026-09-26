// 共有プレビュー用の「見本」データ
// /api/og?sample=1 や /api/story?sample=1 で使う（ファイル名が _ で始まるので、URLとしては公開されない）
// 商品の写真のかわりに、やわらかい色のシルエット画像を使う

// シルエット画像（SVG）を data URL にする
const svg = (bg, fg, body) =>
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
      `<rect width="100" height="100" fill="${bg}"/>` +
      `<g fill="${fg}" stroke="${fg}">${body}</g>` +
    `</svg>`
  );

// 自転車
const BIKE = svg('#E7ECF1', '#9FB2C6',
  `<circle cx="29" cy="64" r="15" fill="none" stroke-width="5"/>` +
  `<circle cx="71" cy="64" r="15" fill="none" stroke-width="5"/>` +
  `<path d="M29 64 L44 40 L62 40 L71 64 M44 40 L52 64 L62 40 M40 32 L50 32 M62 40 L60 30 L68 29" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
);

// ワンピース
const DRESS = svg('#FBE7E0', '#E9A58F',
  `<circle cx="27" cy="31" r="8" stroke="none"/>` +
  `<circle cx="73" cy="31" r="8" stroke="none"/>` +
  `<path d="M36 24 C30 27 27 32 29 38 L20 80 Q50 88 80 80 L71 38 C73 32 70 27 64 24 Q50 36 36 24 Z" stroke="none"/>`
);

// 絵本
const BOOKS = svg('#E6F1EA', '#9CC2AC',
  `<rect x="22" y="62" width="56" height="12" rx="2" stroke="none"/>` +
  `<rect x="27" y="47" width="48" height="12" rx="2" stroke="none"/>` +
  `<rect x="24" y="32" width="50" height="12" rx="2" stroke="none"/>` +
  `<rect x="19" y="76" width="62" height="3" rx="1.5" stroke="none"/>`
);

// くまのぬいぐるみ
const BEAR = svg('#F0ECE2', '#CDB99F',
  `<circle cx="34" cy="26" r="8" stroke="none"/>` +
  `<circle cx="66" cy="26" r="8" stroke="none"/>` +
  `<circle cx="50" cy="38" r="17" stroke="none"/>` +
  `<ellipse cx="50" cy="68" rx="20" ry="18" stroke="none"/>` +
  `<circle cx="30" cy="62" r="7" stroke="none"/>` +
  `<circle cx="70" cy="62" r="7" stroke="none"/>` +
  `<circle cx="38" cy="84" r="8" stroke="none"/>` +
  `<circle cx="62" cy="84" r="8" stroke="none"/>`
);

export const SAMPLE = {
  title: '子供用品をゆずります',
  items: [
    { name: 'キッズ自転車', image: BIKE, status: 'open' },
    { name: 'キッズ服', image: DRESS, status: 'open' },
    { name: '絵本セット', image: BOOKS, status: 'open' },
    { name: 'くまのぬいぐるみ', image: BEAR, status: 'open' },
  ],
};
