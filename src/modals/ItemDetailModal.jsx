import React, { useState } from 'react'; // ★ useState を追加
import { ChevronLeft, Package, Clock, Gift } from 'lucide-react'; // ★ Trash2 を消して Gift を追加
import { COLORS } from '../constants.js';
import { timeAgo } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import { FullScreen, CenterModal } from '../components/ModalShell.jsx'; // ★ CenterModal を追加
import StatusBadge from '../components/StatusBadge.jsx';

// 商品の詳細
export default function ItemDetailModal() {
  const {
    viewItem, setViewItem, isCreatorMode, deadlinePassed,
    markDone, openEdit, openWantModal, // ★ ownerMenuOpen などを消して openEdit を追加
    // requestDelete もここでは不要になった（削除は編集画面に移動）
  } = useApp();

  // ★ 出品者がマッチング中の商品を開いた時は、最初からポップアップを出す
  const [showMatchPopup, setShowMatchPopup] = useState(
    isCreatorMode && viewItem.status === 'kept'
  );

  const claimer = viewItem.claimerName ? `${viewItem.claimerName}さん` : 'お相手';

  return (
    <FullScreen>
      {/* ヘッダー */}
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b z-10" style={{ backgroundColor: 'rgba(250,248,243,0.95)', borderColor: COLORS.border }}>
        <button onClick={() => setViewItem(null)}><ChevronLeft size={22} /></button>
        <h2 className="font-maru font-bold text-base">商品の詳細</h2>
      </div>

      {/* 本文 */}
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
            <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>{viewItem.description}</p>
          )}

          {/* ★ ここにあった「出品者メニュー」ブロックを丸ごと削除 */}
        </div>
      </div>

      {/* 下のボタン */}
      <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        {isCreatorMode ? (
          // ★ 出品者：状態ごとにボタンを出し分け
          viewItem.status === 'open' ? (
            <button
              onClick={() => openEdit(viewItem)}
              className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
            >
              編集する
            </button>
          ) : viewItem.status === 'kept' ? (
            <button
              onClick={() => setShowMatchPopup(true)}
              className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.indigo, color: '#fff' }}
            >
              お譲り完了にする
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-full font-bold text-sm text-center" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
              お譲り済みです
            </div>
          )
        ) : deadlinePassed ? (
          // ↓ ここから下（ゲスト向け）は変更なし
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

      {/* ★ 追加：出品者向けの「マッチング中」ポップアップ */}
      {isCreatorMode && showMatchPopup && viewItem.status === 'kept' && (
        <CenterModal onClose={() => setShowMatchPopup(false)} closable width="max-w-sm">
          <div className="text-center pt-2">
            <div
              className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
            >
              <Gift size={22} />
            </div>
            <p className="font-maru font-bold text-base leading-relaxed mb-1">
              {claimer}とマッチングしました！
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: COLORS.inkSoft }}>
              連絡をしてお譲りしてください。
            </p>
            <button
              onClick={() => markDone(viewItem)}
              className="w-full py-3 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.moss, color: '#fff' }}
            >
              お譲り完了
            </button>
          </div>
        </CenterModal>
      )}
    </FullScreen>
  );
}