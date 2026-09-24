import React from 'react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { CenterModal } from '../components/ModalShell.jsx';

export default function LogoutConfirmModal() {
  const { setLogoutConfirmOpen, handleLogoutConfirm } = useApp();
  return (
    <CenterModal onClose={() => setLogoutConfirmOpen(false)}>
      <h3 className="font-bold text-sm mb-2">ログアウトしますか？</h3>
      <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>
        通知メールは届かなくなります。別の端末でリストを編集するには、登録したメールアドレスでのログインが必要です。
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
