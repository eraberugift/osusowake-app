import React from 'react';
import { Mail } from 'lucide-react';
import { COLORS } from '../constants.js';
import EmailInputWithHistory from './EmailInputWithHistory.jsx';

// 通知メールアドレスの登録・変更・ログアウトをまとめたブロック
export default function EmailBlock({
  notifyEmail, editingEmail, emailInput, setEmailInput, savingEmail,
  onSubmit, onUpdate, onStartEdit, onCancelEdit, onLogout, helperText, dropUp,
}) {
  if (notifyEmail && !editingEmail) {
    return (
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.inkSoft }}>
          <Mail size={13} />
          通知先：{notifyEmail}
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={onStartEdit} className="text-[11px] underline" style={{ color: COLORS.indigo }}>変更する</button>
          <button onClick={onLogout} className="text-[11px] underline" style={{ color: COLORS.inkSoft }}>ログアウト</button>
        </div>
      </div>
    );
  }
  return (
    <div>
      {helperText && (
        <div className="text-[11px] mb-1.5 leading-relaxed" style={{ color: COLORS.inkSoft }}>{helperText}</div>
      )}
      <div className="flex gap-2">
        <EmailInputWithHistory value={emailInput} onChange={setEmailInput} placeholder="メールアドレス（任意）" dropUp={dropUp} />
        <button
          onClick={editingEmail ? onUpdate : onSubmit}
          disabled={savingEmail}
          className="px-4 py-2 rounded-lg text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
        >
          {savingEmail ? '...' : editingEmail ? '保存' : '登録'}
        </button>
        {editingEmail && (
          <button onClick={onCancelEdit} className="px-2 text-xs flex-shrink-0" style={{ color: COLORS.inkSoft }}>
            キャンセル
          </button>
        )}
      </div>
    </div>
  );
}
