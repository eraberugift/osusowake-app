import React from 'react';
import { Mail } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { CenterModal } from '../components/ModalShell.jsx';

export default function LogoutConfirmModal() {
  const { notifyEmail, setLogoutConfirmOpen, handleLogoutConfirm } = useApp();
  return (
    <CenterModal onClose={() => setLogoutConfirmOpen(false)}>
      <h3 className="font-bold text-sm mb-3">ログアウトしますか？</h3>

      {notifyEmail && (
        <div
          className="mb-3 px-3 py-2.5 rounded-lg"
          style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}
        >
          <p className="text-[10px] font-bold mb-0.5" style={{ color: COLORS.inkSoft }}>ログイン中のメールアドレス</p>
          <p className="flex items-center gap-1.5 text-sm font-bold break-all" style={{ color: COLORS.ink }}>
            <Mail size={14} className="flex-shrink-0" style={{ color: COLORS.inkSoft }} />
            {notifyEmail}
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed mb-4" style={{ color: COLORS.inkSoft }}>
        この端末でのログインを解除します。あなたが作ったリストを編集するには、もう一度メールアドレスでログインしてください。
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setLogoutConfirmOpen(false)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }}
        >
          キャンセル
        </button>
        <button
          onClick={handleLogoutConfirm}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
        >
          ログアウトする
        </button>
      </div>
    </CenterModal>
  );
}