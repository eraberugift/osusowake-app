import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import { useApp } from '../context/AppContext.jsx';
import GlobalStyle from '../components/GlobalStyle.jsx';
import Toast from '../components/Toast.jsx';
import ListLinkRow from '../components/ListLinkRow.jsx';

// 「あなたが作ったリスト」全件ページ（?mylists=1）
export default function AllListsScreen() {
  const { myLists } = useApp();

  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(253,251,249,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <a href={topUrl()} className="flex items-center gap-1 text-xs font-bold underline" style={{ color: COLORS.indigo }}>
            <ChevronLeft size={14} />
            トップに戻る
          </a>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="font-maru font-bold text-lg mb-4">あなたが作ったリスト</h1>

        {myLists.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: COLORS.inkSoft }}>
            まだリストがありません
          </p>
        ) : (
          <div className="rounded-xl overflow-hidden divide-y" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border }}>
            {myLists.map((l) => <ListLinkRow key={l.id} list={l} />)}
          </div>
        )}
      </main>

      <Toast />
    </div>
  );
}
