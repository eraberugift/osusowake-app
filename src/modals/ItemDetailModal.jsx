import React from 'react';
import { ChevronLeft, Package, Clock, Trash2 } from 'lucide-react';
import { COLORS } from '../constants.js';
import { timeAgo } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import { FullScreen } from '../components/ModalShell.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

// 商品の詳細
export default function ItemDetailModal() {
  const {
    viewItem, setViewItem, isCreatorMode, deadlinePassed,
    ownerMenuOpen, setOwnerMenuOpen, markDone, requestDelete, openWantModal,
  } = useApp();

  return (
    <FullScreen>
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b z-10" style={{ backgroundColor: 'rgba(250,248,243,0.95)', borderColor: COLORS.border }}>
        <button onClick={() => { setViewItem(null); setOwnerMenuOpen(false); }}><ChevronLeft size={22} /></button>
        <h2 className="font-maru font-bold text-base">商品の詳細</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-square" style={{ backgroundColor: '#F0ECE2' }}>
          {viewItem.image ? (
            <img src={viewItem.image} alt={viewItem.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft }}>
              <Package size={40} />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusBadge status={viewItem.status} claimerName={viewItem.claimerName} size="lg" />
          </div>
        </div>

        <div className="px-4 py-4">
          <h3 className="font-maru font-bold text-lg leading-snug mb-2">{viewItem.name}</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
              {viewItem.condition}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.inkSoft }}>
              <Clock size={12} />
              {timeAgo(viewItem.createdAt)}に出品
            </span>
          </div>

          {viewItem.description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.ink }}>{viewItem.description}</p>
          )}

          {isCreatorMode && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
              <button
                onClick={() => setOwnerMenuOpen((v) => !v)}
                className="text-xs font-bold"
                style={{ color: COLORS.inkSoft }}
              >
                出品者メニュー {ownerMenuOpen ? '▲' : '▼'}
              </button>
              {ownerMenuOpen && (
                <div className="flex gap-2 mt-2.5">
                  {viewItem.status !== 'done' && (
                    <button
                      onClick={() => markDone(viewItem)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold"
                      style={{ border: `1px solid ${COLORS.moss}`, color: COLORS.moss }}
                    >
                      お譲り確定にする
                    </button>
                  )}
                  <button
                    onClick={() => requestDelete(viewItem)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.accentDeep }}
                  >
                    <Trash2 size={13} />
                    削除
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        {isCreatorMode ? (
          <button
            onClick={() => setOwnerMenuOpen(true)}
            className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
          >
            編集する
          </button>
        ) : deadlinePassed ? (
          <div className="w-full py-3.5 rounded-full font-bold text-sm text-center" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
            募集は終了しました
          </div>
        ) : viewItem.status === 'open' ? (
          <button
            onClick={() => openWantModal(viewItem)}
            className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            これ欲しい！
          </button>
        ) : viewItem.status === 'kept' ? (
          <button
            onClick={() => openWantModal(viewItem)}
            className="w-full py-3.5 rounded-full font-bold text-sm"
            style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
          >
            連絡方法を見る
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-full font-bold text-sm text-center" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
            お譲り済みです
          </div>
        )}
      </div>
    </FullScreen>
  );
}
