import React from 'react';
import { Mail } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import GlobalStyle from '../components/GlobalStyle.jsx';
import Toast from '../components/Toast.jsx';
import ListLinkRow from '../components/ListLinkRow.jsx';
import { FeaturesSection, ScenesSection, StepsSection } from '../components/LandingSections.jsx';
import CreateListModal from '../modals/CreateListModal.jsx';
import EmailLoginModal from '../modals/EmailLoginModal.jsx';
import LogoutConfirmModal from '../modals/LogoutConfirmModal.jsx';

// リンク先ができたら href を差し替えてください
const FOOTER_LINKS = [
  { label: 'よくある質問', href: '#' },
  { label: 'お問い合わせ', href: '#' },
  { label: 'プライバシーポリシー', href: '#' },
  { label: '利用規約', href: '#' },
];

// トップ画面（リスト未選択時）
export default function HomeScreen() {
  const {
    notifyEmail, setShowEmailLogin, setLogoutConfirmOpen,
    setFormOpen, formOpen,
    myLists, showMyLists, setShowMyLists,
    showEmailLogin, logoutConfirmOpen,
  } = useApp();

  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(253,251,249,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="font-maru font-bold text-lg" style={{ color: COLORS.accent }}>
              ゆずリス
            </p>
            <img src="/squirrels-logo.png" alt="" style={{ height: 24, width: 'auto', display: 'block' }} />
          </div>
          {notifyEmail ? (
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
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-10">
        {/* ---- ヒーロー ---- */}
        <section className="text-center pb-16">
          <h1 className="font-maru font-extrabold text-4xl leading-tight mb-6" style={{ color: COLORS.accent }}>
            誰か欲しい人<br />いるかな？<br />を簡単に。
          </h1>
          <img src="/squirrels-logo.png" alt="ゆずリス" className="w-56 mx-auto mb-6" />
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: COLORS.ink, textWrap: 'balance' }}>
            ゆずリスはURLを知り合いに送るだけで、まだ使えるものを欲しい人が分かるサービスです。
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="w-full py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform mb-3"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            はじめる
          </button>

          {myLists.length > 0 && (
            <div className="text-left">
              <button
                onClick={() => setShowMyLists((v) => !v)}
                className="text-xs underline mb-2 block mx-auto w-fit text-center"
                style={{ color: COLORS.indigo }}
              >
                あなたが作ったリストを見る {showMyLists ? '▲' : '▼'}
              </button>

              {showMyLists && (
                <>
                  <div className="rounded-xl overflow-hidden divide-y" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border }}>
                    {myLists.slice(0, 3).map((l) => <ListLinkRow key={l.id} list={l} />)}
                  </div>
                  {myLists.length > 3 && (
                    <a
                      href={`${topUrl()}?mylists=1`}
                      className="block text-center text-xs underline mt-3"
                      style={{ color: COLORS.indigo }}
                    >
                      さらに見る（他{myLists.length - 3}件）
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        {/* ---- 特長 / シーン / 使い方 ---- */}
        <div className="space-y-16 pb-16">
          <FeaturesSection />
          <ScenesSection />
          <StepsSection />
        </div>

        {/* ---- 最後のCTA ---- */}
        <section className="text-center pb-14">
          <button
            onClick={() => { setFormOpen(true); window.scrollTo({ top: 0 }); }}
            className="w-full py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            はじめる
          </button>
        </section>
      </main>

      {/* ---- フッター ---- */}
      <footer className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 py-6">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-xs underline" style={{ color: COLORS.inkSoft }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {formOpen && <CreateListModal />}
      {showEmailLogin && !notifyEmail && <EmailLoginModal />}
      {logoutConfirmOpen && <LogoutConfirmModal />}

      <Toast />
    </div>
  );
}
