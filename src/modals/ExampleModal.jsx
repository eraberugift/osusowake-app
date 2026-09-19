import React from 'react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet } from '../components/ModalShell.jsx';

const SAMPLES = [
  {
    name: 'ワンピース（Mサイズ）',
    condition: '目立つ傷なし',
    description: '1シーズンだけ着用しました。首元に小さな毛玉がありますが、それ以外は綺麗な状態です。クリーニング済みです。手渡しでのお引き渡しを希望します。',
  },
  {
    name: 'キッズ自転車 16インチ',
    condition: '使用感あり',
    description: '補助輪付きです。あちこちに小さな傷がありますが、走行に問題はありません。空気入れも一緒にお渡しします。',
  },
];

const TIPS = [
  '・傷や汚れは、正直に書いておくと相手も安心できます',
  '・写真は明るい場所で撮ると、状態が伝わりやすくなります',
  '・受け渡し方法の希望（手渡し・郵送など）も書いておくと親切です',
];

// 出品の見本
export default function ExampleModal() {
  const { setShowExample } = useApp();

  return (
    <BottomSheet onClose={() => setShowExample(false)}>
      <h3 className="font-maru font-bold text-base mb-4 pr-6">出品の見本</h3>

      <div className="space-y-3 mb-5">
        {SAMPLES.map((s) => (
          <div key={s.name} className="rounded-xl p-3" style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}>
            <p className="text-xs font-bold mb-1" style={{ color: COLORS.accentDeep }}>品名</p>
            <p className="text-sm font-bold mb-2">{s.name}</p>
            <p className="text-xs font-bold mb-1" style={{ color: COLORS.accentDeep }}>状態</p>
            <p className="text-sm mb-2">{s.condition}</p>
            <p className="text-xs font-bold mb-1" style={{ color: COLORS.accentDeep }}>詳細説明・注意点</p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>{s.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: COLORS.mossSoft }}>
        <p className="text-xs font-bold mb-2" style={{ color: COLORS.moss }}>書き方のコツ</p>
        <ul className="text-xs space-y-1 leading-relaxed" style={{ color: COLORS.moss }}>
          {TIPS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <button
        onClick={() => setShowExample(false)}
        className="w-full py-3 rounded-full font-bold text-sm"
        style={{ backgroundColor: COLORS.accent, color: '#fff' }}
      >
        閉じて出品に戻る
      </button>
    </BottomSheet>
  );
}
