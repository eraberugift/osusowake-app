import React from 'react';
import ClaimerMatchedScreen from './ClaimerMatchedScreen.jsx';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet } from '../components/ModalShell.jsx';

// 「これ欲しい！」→ 名前入力 → LINE連絡の導線
export default function WantModal() {
  const { modalItem, setModalItem, modalStage, claimerInput, setClaimerInput, confirmClaim } = useApp();

  if (modalStage !== 'name') {
    return <ClaimerMatchedScreen />;
  }
  return (
    <BottomSheet onClose={() => setModalItem(null)}>
      <h3 className="font-maru font-bold text-base mb-1 pr-6">{modalItem.name}</h3>
      <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>{modalItem.condition}</p>

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
    </BottomSheet>
  );
}
