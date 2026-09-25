import React from 'react';
import { Loader2, Plus, Share2, Mail } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import GlobalStyle from '../components/GlobalStyle.jsx';
import Toast from '../components/Toast.jsx';
import ItemRow from '../components/ItemRow.jsx';
import ItemFormModal from '../modals/ItemFormModal.jsx';
import ItemDetailModal from '../modals/ItemDetailModal.jsx';
import ShareSheet from '../modals/ShareSheet.jsx';
import WantModal from '../modals/WantModal.jsx';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.jsx';
import ExampleModal from '../modals/ExampleModal.jsx';
import LogoutConfirmModal from '../modals/LogoutConfirmModal.jsx';
import EmailLoginModal from '../modals/EmailLoginModal.jsx';

// リスト画面（?list=xxx）
export default function ListScreen() {
  const {
    list, listLoading, items, isCreatorMode, deadlinePassed, notifyEmail,
    setShareSheetOpen, setTitleInput, setFormOpen, setViewItem, openWantModal,
    setLogoutConfirmOpen, setShowEmailLogin, showEmailLogin,
    formOpen, viewItem, shareSheetOpen, modalItem, confirmDelete, showExample, logoutConfirmOpen,
  } = useApp();

  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(253,251,249,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <a href={topUrl()} className="flex items-center gap-1.5">
            <p className="font-maru font-bold text-lg" style={{ color: COLORS.accent }}>
              ゆずリス
            </p>
            <img src="/squirrels-logo.png" alt="" style={{ height: 32, width: 'auto', display: 'block' }} />
          </a>
          {isCreatorMode && (notifyEmail ? (
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              className="flex items-center gap-1 text-xs font-bold"
              style={{ color: COLORS.inkSoft }}
            >
              <Mail size={13} />
              ログイン中
            </button>
          ) : (
            <button
              onClick={() => setShowEmailLogin(true)}
              className="text-xs font-bold underline"
              style={{ color: COLORS.indigo }}
            >
              ログイン／登録
            </button>
          ))}
        </div>
      </header>

      {isCreatorMode ? (
          items.length > 0 && (
            <div className="max-w-md mx-auto px-4 pt-4 pb-3">
              <button
                onClick={() => { setShareSheetOpen(true); setTitleInput(list?.title || ''); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold font-kaku text-sm active:scale-[0.98] transition-transform"
                style={{ backgroundColor: COLORS.accent, color: '#fff' }}
              >
                <Share2 size={16} />
                リストを共有しよう
              </button>
            </div>
          )
        ) : (
          !listLoading && (
            <div className="max-w-md mx-auto px-4 pt-4 pb-3">
              <a
                href={topUrl()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold font-kaku text-sm active:scale-[0.98] transition-transform"
                style={{ backgroundColor: COLORS.moss, color: '#fff' }}
              >
                あなたも譲りたいものがありますか？無料で始める
              </a>
            </div>
          )
        )}

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-maru font-bold text-sm">アイテム一覧</h2>
          <span className="text-xs" style={{ color: COLORS.inkSoft }}>{items.length}件</span>
        </div>

        {listLoading ? (
          <div className="flex justify-center py-16" style={{ color: COLORS.inkSoft }}>
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: COLORS.inkSoft }}>
            {isCreatorMode
              ? '右下の＋から出品してみましょう'
              : 'まだアイテムがありません'}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden divide-y" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border }}>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onClick={() =>
                  !isCreatorMode && item.status === 'kept'
                    ? openWantModal(item)
                    : setViewItem(item)
                }
                showClaimerName={isCreatorMode}
              />
            ))}
          </div>
        )}
      </main>

      {isCreatorMode && !deadlinePassed && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-6 right-5 z-30 flex items-center justify-center w-14 h-14 rounded-full shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          aria-label="出品する"
        >
          <Plus size={26} />
        </button>
      )}

      {viewItem && <ItemDetailModal />}
      {formOpen && <ItemFormModal />}
      {shareSheetOpen && <ShareSheet />}
      {modalItem && <WantModal />}
      {confirmDelete && <ConfirmDeleteModal />}
      {showExample && <ExampleModal />}
      {logoutConfirmOpen && <LogoutConfirmModal />}
      {showEmailLogin && !notifyEmail && <EmailLoginModal />}

      <Toast />
    </div>
  );
}
