import React, { useRef, useEffect } from 'react';
import { MessageCircle, Link2, Pencil, Check, KeyRound } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet } from '../components/ModalShell.jsx';
import EmailBlock from '../components/EmailBlock.jsx';

// このリストを共有しよう
export default function ShareSheet() {
  const {
    list, setShareSheetOpen,
    titleEditing, setTitleEditing, titleInput, setTitleInput, savingTitle, handleSaveTitle,
    lineShareUrl, copyLink, adminUrl, copyAdminLink,
    notifyEmail, editingEmail, setEditingEmail, emailInput, setEmailInput, savingEmail,
    handleEmailSubmit, handleEmailUpdate, setLogoutConfirmOpen,
  } = useApp();

  const titleRef = useRef(null);

  // 保存が終わったらキーボードを閉じる
  useEffect(() => {
    if (!titleEditing) titleRef.current?.blur();
  }, [titleEditing]);

  const close = () => { setShareSheetOpen(false); setTitleEditing(false); };

  // ✏️タップで直接フォーカス（iPhoneでも1回でキーボードが出る）
  const startTitleEdit = () => titleRef.current?.focus();

  const onTitleFocus = (e) => {
    setTitleEditing(true);
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len); // カーソルを末尾に
  };

  const cancelTitleEdit = () => {
    setTitleInput(list?.title || '');
    setTitleEditing(false);
  };

  const saveTitle = () => {
    if (savingTitle) return;
    if (titleInput.trim() === (list?.title || '')) { cancelTitleEdit(); return; }
    handleSaveTitle();
  };

  const onTitleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return; // 変換確定のEnterは無視
    if (e.key === 'Enter') { e.preventDefault(); saveTitle(); }
    else if (e.key === 'Escape') { e.preventDefault(); cancelTitleEdit(); }
  };

  // ボタンを押したときにフォーカスが外れてキャンセル扱いにならないようにする
  const keepFocus = (e) => e.preventDefault();


  return (
    <BottomSheet onClose={close}>
      <h3 className="font-maru font-bold text-base mb-3 pr-6">このリストを共有しよう</h3>

      <p className="text-[11px] font-bold mb-1.5" style={{ color: COLORS.inkSoft }}>リスト名</p>
      <div
        className="mb-4 px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: '#FCFBF8',
          border: `1px solid ${titleEditing ? COLORS.accent : COLORS.border}`,
        }}
      >
        <input
          ref={titleRef}
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onFocus={onTitleFocus}
          onBlur={cancelTitleEdit}
          onKeyDown={onTitleKeyDown}
          enterKeyHint="done"
          aria-label="リスト名"
          className="flex-1 min-w-0 bg-transparent outline-none font-bold text-base truncate"
          style={{ color: COLORS.ink, padding: 0, border: 'none' }}
        />
        {titleEditing ? (
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onMouseDown={keepFocus} onClick={cancelTitleEdit} className="text-xs" style={{ color: COLORS.inkSoft }}>
              キャンセル
            </button>
            <button onMouseDown={keepFocus} onClick={saveTitle} disabled={savingTitle} className="text-xs font-bold disabled:opacity-60" style={{ color: COLORS.accentDeep }}>
              {savingTitle ? '保存中…' : '保存'}
            </button>
          </div>
        ) : (
          <button onClick={startTitleEdit} className="flex-shrink-0 p-1 -m-1" style={{ color: COLORS.indigo }} aria-label="リスト名を編集">
            <Pencil size={14} />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-5">
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
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
          共有用リンクをコピー
        </button>
      </div>

      {!notifyEmail && adminUrl && (
        <div className="mb-5 p-3 rounded-xl" style={{ backgroundColor: COLORS.indigoSoft }}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="flex items-center gap-1.5 font-bold text-sm" style={{ color: COLORS.indigo }}>
              <KeyRound size={15} />
              あなた専用の管理リンク
            </p>
            <button
              onClick={copyAdminLink}
              className="flex-shrink-0 px-3 py-1.5 rounded-full font-bold text-xs"
              style={{ backgroundColor: COLORS.card, color: COLORS.indigo, border: `1px solid ${COLORS.indigo}` }}
            >
              コピー
            </button>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: COLORS.ink }}>
            メモなどに保存しておいてください。<br/>このリンクがあれば、もしデータが消えてもリストを編集できます。
            <span className="font-bold inline-block" style={{ color: COLORS.accentDeep }}>友達には送らないでください。<br/>シークレットモードの方は必ず保存してください。</span>
          </p>
        </div>
      )}

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
              <p className="font-maru font-bold text-sm mb-2" style={{ color: COLORS.ink }}>
                📩 登録しておくともっと便利に
              </p>
              <ul className="space-y-1 mb-3">
                <li className="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>譲り先が見つかったら通知でお知らせします</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>管理用リンクを保存しなくても、リストが消えません</span>
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
