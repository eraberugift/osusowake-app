import React from 'react';
import { ChevronLeft, Package, PartyPopper, MessageCircle, Truck, Gift as GiftIcon } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { FullScreen } from '../components/ModalShell.jsx';

const STEPS = [
  { icon: MessageCircle, text: 'LINEやDMなどで連絡をする' },
  { icon: Truck, text: '受け渡し方法を調整する' },
  { icon: GiftIcon, text: 'お譲りする' },
];

// 出品者向け：マッチング完了画面（商品詳細を兼ねる）
export default function MatchedItemScreen() {
  const { viewItem, setViewItem, markDone } = useApp();
  const claimer = viewItem.claimerName ? `${viewItem.claimerName}さん` : 'お相手';

  return (
    <FullScreen>
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b z-10" style={{ backgroundColor: 'rgba(250,248,243,0.95)', borderColor: COLORS.border }}>
        <button onClick={() => setViewItem(null)}><ChevronLeft size={22} /></button>
        <h2 className="font-maru font-bold text-base">マッチング完了</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-8 pb-6 text-center">
          <div
            style={{ width: 96, height: 96, backgroundColor: '#F0ECE2' }}
            className="mx-auto rounded-xl overflow-hidden mb-3"
          >
            {viewItem.image ? (
              <img src={viewItem.image} alt={viewItem.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft }}>
                <Package size={30} />
              </div>
            )}
          </div>
          <p className="text-sm font-bold mb-4" style={{ color: COLORS.inkSoft }}>{viewItem.name}</p>

          <PartyPopper size={64} style={{ color: COLORS.moss }} className="mx-auto mb-4" />

          <h3 className="font-maru font-bold text-2xl leading-snug mb-2" style={{ color: COLORS.ink }}>
            {claimer}と<br />マッチングしました！
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
            連絡をしてお譲りしてください。
          </p>
        </div>

        <div className="px-4 pb-8">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}>
            <p className="text-xs font-bold mb-3" style={{ color: COLORS.inkSoft }}>この後の流れ</p>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.text} className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
                    >
                      {i + 1}
                    </div>
                    <Icon size={16} style={{ color: COLORS.inkSoft }} className="flex-shrink-0" />
                    <span className="text-sm" style={{ color: COLORS.ink }}>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        <button
          onClick={() => markDone(viewItem)}
          className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.moss, color: '#fff' }}
        >
          お譲り完了にする
        </button>
      </div>
    </FullScreen>
  );
}
