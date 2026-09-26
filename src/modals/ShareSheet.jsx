import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Link2, Pencil, KeyRound, Instagram } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet, CenterModal } from '../components/ModalShell.jsx';

// ストーリーズに投稿するまでの流れ（案内に表示）
const STORY_STEPS = [
  '共有メニューでInstagramを選び、「ストーリーズ」をタップ',
  'スタンプの「リンク」を選んで、貼り付け（リンクはコピー済みです）',
  '好きな場所に置いて、投稿！',
];
import EmailBlock from '../components/EmailBlock.jsx';

// Xのロゴ（lucideに無いので自前のSVG）
function XLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// 丸いアイコン＋下にラベルの共有ボタン
function ShareIcon({ label, bg, color = '#fff', href, onClick, newTab, children }) {
  const circle = (
    <span
      className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );
  const text = <span className="text-[11px] font-bold" style={{ color: COLORS.ink }}>{label}</span>;
  const cls = 'flex flex-col items-center gap-1.5 w-20';

  return href ? (
    <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {circle}{text}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>{circle}{text}</button>
  );
}

// このリストを共有しよう
export default function ShareSheet() {
  const {
    list, setShareSheetOpen,
    titleEditing, setTitleEditing, titleInput, setTitleInput, savingTitle, handleSaveTitle,
    lineShareUrl, xShareUrl, shareToInstagram, copyLink, adminUrl, copyAdminLink,
    notifyEmail, editingEmail, setEditingEmail, emailInput, setEmailInput, savingEmail,
    handleEmailSubmit, handleEmailUpdate, setLogoutConfirmOpen,
  } = useApp();

  const titleRef = useRef(null);
  const [storyGuideOpen, setStoryGuideOpen] = useState(false);

  // 案内の「OK」を押した瞬間に共有メニューを開く（iPhoneはこのタイミングでないと開けない）
  const startStoryShare = () => {
    setStoryGuideOpen(false);
    shareToInstagram();
  };

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

      <p className="text-[11px] font-bold mb-1.5" style={{ color: COLORS.inkSoft }}>リスト名（友達にも表示されます）</p>
      <div
        className="mb-5 px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
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

      {/* ---- 共有先のアイコン：LINE → X → Instagram ---- */}
      <div className="flex justify-center gap-2 mb-2">
        <ShareIcon label="LINE" bg={COLORS.line} href={lineShareUrl}>
          <MessageCircle size={24} />
        </ShareIcon>
        <ShareIcon label="X" bg="#000" href={xShareUrl}>
          <XLogo size={22} />
        </ShareIcon>
        <ShareIcon
          label="ストーリーズ"
          bg="linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 80%, #515BD4 100%)"
          onClick={() => setStoryGuideOpen(true)}
        >
          <Instagram size={24} />
        </ShareIcon>
      </div>
      <button
        onClick={copyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm mt-4 mb-5"
        style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}`, color: COLORS.ink }}
      >
        <Link2 size={17} color={COLORS.indigo} />
        共有用リンクをコピー
      </button>

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
            メモなどに保存しておいてください。<br/>もしデータが消えてもリストを編集できます。
            <span className="font-bold block" style={{ color: COLORS.accentDeep }}>友達には送らないでください。<br/>シークレットモードの方は必ず保存してください。</span>
          </p>
        </div>
      )}

      <div className="pt-4 border-t" style={{ borderColor: COLORS.border }}>
        <EmailBlock
          dropUp
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

      {/* ---- ストーリーズの案内（アイコンを押したときだけ出る） ---- */}
      {storyGuideOpen && (
        <CenterModal onClose={() => setStoryGuideOpen(false)} closable>
          <h3 className="font-maru font-bold text-base mb-1 pr-6">ストーリーズでシェア</h3>
          <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>
            招待状の画像つきで、インスタが開きます
          </p>
          <ol className="space-y-2.5 mb-5">
            {STORY_STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: COLORS.ink }}>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accentDeep }}
                >
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] mb-4 leading-relaxed" style={{ color: COLORS.inkSoft }}>
            リンクを貼らなくても、画像のQRコードからリストを開けます
          </p>
          <button
            onClick={startStoryShare}
            className="w-full py-3 rounded-full font-bold text-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            OK、インスタを開く
          </button>
        </CenterModal>
      )}
    </BottomSheet>
  );
}
