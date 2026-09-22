import React from 'react';
import { Mail, ChevronRight } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import GlobalStyle from '../components/GlobalStyle.jsx';
import Toast from '../components/Toast.jsx';
import ListLinkRow from '../components/ListLinkRow.jsx';
import { FeaturesSection, ScenesSection, StepsSection } from '../components/LandingSections.jsx';
import EmailLoginModal from '../modals/EmailLoginModal.jsx';
import LogoutConfirmModal from '../modals/LogoutConfirmModal.jsx';


const CONTACT_FORM_URL = 'https://forms.gle/899KaPCoJJngBRaH8';

const FOOTER_LINKS = [
  // 「よくある質問」はページができるまで一旦非表示
  { label: 'お問い合わせ', href: CONTACT_FORM_URL },
  { label: 'プライバシーポリシー', href: `${topUrl()}?page=privacy` },
  { label: '利用規約', href: `${topUrl()}?page=terms` },
  { label: '開発者の想い', href: `${topUrl()}?about=1` },
];

// トップ画面（リスト未選択時）
export default function HomeScreen() {
  const {
    notifyEmail, setShowEmailLogin, setLogoutConfirmOpen,
    // setFormOpen, formOpen,
    handleCreateList, creatingList,
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
          <h1 className="font-maru font-extrabold text-[32px] leading-tight mb-2" style={{ color: COLORS.accent }}>
            誰か欲しい人<br />いるかな？<br />をかんたんに。
          </h1>
          <img src="/squirrels-logo.png" alt="ゆずリス" className="w-56 mx-auto mb-3" />
          <p className="text-sm leading-relaxed mb-8" style={{ color: COLORS.ink }}>
            もう使わないものをリストにして、<br />
            URLを友達に送るだけ。<br />
            ゆずリスは、欲しい人がすぐ分かるサービスです。
          </p>
          <button
            onClick={handleCreateList}
            disabled={creatingList}
            className="w-full py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform mb-3 disabled:opacity-70"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            {creatingList ? '作成中…' : 'はじめる'}
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
                <div className="rounded-xl overflow-hidden divide-y" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border }}>
                  {myLists.slice(0, 3).map((l) => <ListLinkRow key={l.id} list={l} />)}
                  {myLists.length > 3 && (
                    <a
                      href={`${topUrl()}?mylists=1`}
                      className="flex items-center justify-center gap-1 px-4 py-3 text-xs font-bold active:bg-stone-100 transition-colors"
                      style={{ color: COLORS.indigo, backgroundColor: '#FCFBF8', borderColor: COLORS.border }}
                    >
                      すべてのリストを見る（全{myLists.length}件）
                      <ChevronRight size={14} />
                    </a>
                  )}
                </div>
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
            onClick={handleCreateList}
            disabled={creatingList}
            className="w-full py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70"
            style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          >
            {creatingList ? '作成中…' : 'はじめる'}
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

      {showEmailLogin && !notifyEmail && <EmailLoginModal />}
      {logoutConfirmOpen && <LogoutConfirmModal />}

      <Toast />
    </div>
  );
}
