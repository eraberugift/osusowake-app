import React from 'react';
import { MessageCircle, Gift, Package } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet } from '../components/ModalShell.jsx';

// 「これ欲しい！」→ 名前入力 → LINE連絡の導線
export default function WantModal() {
  const { modalItem, setModalItem, modalStage, claimerInput, setClaimerInput, confirmClaim, lineDummyUrl } = useApp();

  return (
    <BottomSheet onClose={() => setModalItem(null)}>
      <h3 className="font-maru font-bold text-base mb-1 pr-6">{modalItem.name}</h3>
      <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>{modalItem.condition}</p>

      {modalStage === 'name' ? (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: COLORS.ink }}>
            「これ欲しい！」を押すと、出品者とマッチングします。お名前を入れてください。
          </p>
          <input
            value={claimerInput}
            onChange={(e) => setClaimerInput(e.target.value)}
            placeholder="例：たなか"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${COLORS.border}` }}
          />
          <button
            onClick={confirmClaim}
            className="w-full py-3 rounded-full font-bold text-sm"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            これ欲しい！
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
            マッチングしました！出品者からの連絡をお待ちください。
          </div>

          <div className="pt-2 border-t space-y-2" style={{ borderColor: COLORS.border }}>
            <p className="text-xs font-bold" style={{ color: COLORS.inkSoft }}>お礼・受け渡しの準備（任意）</p>
            <a
              href="https://gift.line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
              style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accentDeep }}
            >
              <Gift size={17} />
              <span className="flex-1">お礼のプチギフトを贈る（スタバ 500円）</span>
            </a>
            <a
              href="https://www.amazon.co.jp/s?k=%E6%A2%B1%E5%8C%85%E8%B3%87%E6%9D%90"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
              style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
            >
              <Package size={17} />
              <span className="flex-1">梱包・発送の準備をする</span>
            </a>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
