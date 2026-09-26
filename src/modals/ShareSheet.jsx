import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Link2, Pencil, KeyRound, Instagram, ChevronRight, Loader2 } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { BottomSheet, CenterModal } from '../components/ModalShell.jsx';
import EmailBlock from '../components/EmailBlock.jsx';

// ストーリーズに投稿するまでの流れ（案内に表示）
const STORY_STEPS = [
  {
    text: 'アプリの一覧から「Instagram」を選ぶ',
    note: '見当たらないときは、アプリ一覧を右にスクロールするか「その他」から',
  },
  {
    text: '「ストーリーズ」を選ぶ',
  },
  {
    text: 'スタンプの「リンク」で貼り付け',
    note: 'リンクはコピー済みなので、そのままペーストするだけ。貼らなくても、画像のQRコードから見てもらえます',
  },
];

// プレビューに使う見本（本番のVercelで作る固定の画像）
// 手元の開発画面（localhost）でも表示できるように、本番のURLを直接指定している
const SAMPLE_LINE_IMAGE = '/share-sample-line.png';
const SAMPLE_STORY_IMAGE = '/share-sample-story.png';
const SAMPLE_TITLE = '子供用品をゆずります'; // api/_sample.js の title と同じにする
const SAMPLE_HOST = 'yuzulist-app.vercel.app'; // 見本に表示するアドレス（独自ドメインにしたらここを変える）

// Xのロゴ（lucideに無いので自前のSVG）
function XLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// プレビュー画像（読み込み中・失敗時の見た目をそろえる）
function PreviewImage({ src, alt, aspect, bg }) {
  const [state, setState] = useState('loading'); // loading | loaded | error
  useEffect(() => { setState('loading'); }, [src]);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect, backgroundColor: bg }}>
      {src && state !== 'error' && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: state === 'loaded' ? 1 : 0 }}
        />
      )}
      {state !== 'loaded' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2 text-center">
          {state === 'loading' ? (
            <>
              <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.45)' }} />
              <Loader2 size={16} className="relative animate-spin" style={{ color: COLORS.inkSoft }} />
              <span className="relative text-[10px]" style={{ color: COLORS.inkSoft }}>読み込み中…</span>
            </>
          ) : (
            <span className="text-[10px] leading-relaxed" style={{ color: COLORS.inkSoft }}>
              プレビューを<br />表示できませんでした
            </span>
          )}
        </div>
      )}
    </div>
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
    shareUrl, lineMessage,
    notifyEmail, editingEmail, setEditingEmail, emailInput, setEmailInput, savingEmail,
    handleEmailSubmit, handleEmailUpdate, setLogoutConfirmOpen,
  } = useApp();

  const titleRef = useRef(null);
  const [storyGuideOpen, setStoryGuideOpen] = useState(false);
  const [linePreviewOpen, setLinePreviewOpen] = useState(false);

  // 案内の「画像をシェアする」を押した瞬間に共有メニューを開く（iPhoneはこのタイミングでないと開けない）
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
      <div className="flex justify-center gap-2">
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

      {/* LINEは送る前に確認できないので、見たい人だけ見られるように */}
      <button
        onClick={() => setLinePreviewOpen(true)}
        className="mx-auto mt-3 flex items-center gap-0.5 text-xs font-bold"
        style={{ color: COLORS.indigo }}
      >
        <span className="underline underline-offset-2">LINEでどう届くか見てみる</span>
        <ChevronRight size={13} />
      </button>

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

      {/* ---- LINEの届き方のプレビュー ---- */}
      {linePreviewOpen && (
        <CenterModal onClose={() => setLinePreviewOpen(false)} closable width="max-w-sm">
          <h3 className="font-maru font-bold text-base mb-0.5 pr-6">友達にはこう届きます</h3>
          <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>LINEで送ったときの見え方です</p>

          {/* LINEのトーク画面風 */}
          <div className="rounded-xl p-2.5 pl-8 mb-4 flex flex-col items-end gap-1.5" style={{ backgroundColor: '#EEF2F7' }}>
            <div
              className="text-xs leading-relaxed px-3 py-2 whitespace-pre-line break-all"
              style={{ backgroundColor: '#8DE055', color: '#1F2A10', borderRadius: '14px 14px 4px 14px' }}
            >
              {lineMessage}
              {'\n'}
              <span className="underline" style={{ color: '#1E4FA0' }}>https://{SAMPLE_HOST}/s/…</span>
            </div>
            <div className="w-[88%] rounded-xl overflow-hidden" style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <PreviewImage src={SAMPLE_LINE_IMAGE} alt="LINEに表示されるカードの見本" aspect="1200 / 630" bg="#FFF8F0" />
              <div className="px-2.5 py-2">
                <p className="text-[11px] font-bold truncate" style={{ color: COLORS.ink }}>{SAMPLE_TITLE}｜ゆずリス</p>
                <p className="text-[10px]" style={{ color: COLORS.inkSoft }}>{SAMPLE_HOST}</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center -mt-2 mb-4" style={{ color: COLORS.inkSoft }}>
            ※見本です。実際はあなたのリストの写真が入ります
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setLinePreviewOpen(false)}
              className="flex-1 py-3 rounded-full text-sm font-bold"
              style={{ border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }}
            >
              閉じる
            </button>
            <a
              href={lineShareUrl}
              onClick={() => setLinePreviewOpen(false)}
              className="flex-1 py-3 rounded-full text-sm font-bold text-center active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.line, color: '#fff' }}
            >
              LINEで送る
            </a>
          </div>
        </CenterModal>
      )}

      {/* ---- ストーリーズの案内（アイコンを押したときだけ出る） ---- */}
      {storyGuideOpen && (
        <CenterModal onClose={() => setStoryGuideOpen(false)} closable>
          <h3 className="font-maru font-bold text-base mb-4 pr-6">ストーリーズでシェア</h3>

          {/* 投稿される画像の見本 */}
          <div
            className="mx-auto mb-4 w-24 rounded-lg overflow-hidden"
            style={{ boxShadow: '0 4px 12px rgba(120,80,50,0.18)' }}
          >
            <PreviewImage src={SAMPLE_STORY_IMAGE} alt="ストーリーズに載る画像の見本" aspect="9 / 16" bg="#F3D5C3" />
          </div>

          <ol className="space-y-3 mb-5">
            {STORY_STEPS.map((s, i) => (
              <li key={s.text} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accentDeep }}
                >
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-bold leading-relaxed" style={{ color: COLORS.ink }}>{s.text}</p>
                  {s.note && (
                    <p className="text-xs leading-relaxed mt-0.5" style={{ color: COLORS.inkSoft }}>{s.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <button
            onClick={startStoryShare}
            className="w-full py-3 rounded-full font-bold text-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            画像をシェアする
          </button>
        </CenterModal>
      )}
    </BottomSheet>
  );
}
