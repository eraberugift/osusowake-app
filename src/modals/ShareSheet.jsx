import React from 'react';
import { MessageCircle, Link2, Pencil, Check } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet } from '../components/ModalShell.jsx';
import EmailBlock from '../components/EmailBlock.jsx';

// このリストを共有しよう
export default function ShareSheet() {
  const {
    list, setShareSheetOpen,
    titleEditing, setTitleEditing, titleInput, setTitleInput, savingTitle, handleSaveTitle,
    lineShareUrl, copyLink,
    notifyEmail, editingEmail, setEditingEmail, emailInput, setEmailInput, savingEmail,
    handleEmailSubmit, handleEmailUpdate, setLogoutConfirmOpen,
  } = useApp();

  const close = () => { setShareSheetOpen(false); setTitleEditing(false); };

  return (
    <BottomSheet onClose={close}>
      <h3 className="font-maru font-bold text-base mb-3 pr-6">このリストを共有しよう</h3>

      <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}>
        {titleEditing ? (
          <div className="flex gap-2">
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${COLORS.border}`, backgroundColor: '#fff' }}
            />
            <button
              onClick={handleSaveTitle}
              disabled={savingTitle}
              className="flex items-center justify-center px-3 rounded-lg flex-shrink-0"
              style={{ backgroundColor: COLORS.accent, color: '#fff' }}
            >
              <Check size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold truncate">{list?.title}</p>
            <button onClick={() => setTitleEditing(true)} className="flex-shrink-0" style={{ color: COLORS.indigo }}>
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-5">
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.line, color: '#fff' }}
        >
          <MessageCircle size={18} />
          LINEで送る
        </a>
        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-full font-bold text-sm"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.ink }}
        >
          <Link2 size={18} color={COLORS.indigo} />
          リンクをコピー
        </button>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: COLORS.border }}>
        <EmailBlock
          notifyEmail={notifyEmail}
          editingEmail={editingEmail}
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          savingEmail={savingEmail}
          onSubmit={handleEmailSubmit}
          onUpdate={handleEmailUpdate}
          onStartEdit={() => { setEditingEmail(true); setEmailInput(notifyEmail); }}
          onCancelEdit={() => { setEditingEmail(false); setEmailInput(''); }}
          onLogout={() => setLogoutConfirmOpen(true)}
          helperText={
            <>
              <p className="font-bold mb-1.5">📩 登録しておくともっと便利に</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>譲り先が見つかったら通知でお知らせします</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>機種変更したり、Cookieを消しても続きを編集できます</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>これまで作ったリストを、あとでまとめて見返せます</span>
                </li>
              </ul>
            </>
          }
        />
      </div>
    </BottomSheet>
  );
}
