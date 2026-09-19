import React from 'react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import GlobalStyle from '../components/GlobalStyle.jsx';

export default function NotFoundScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-kaku px-6 text-center" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />
      <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>このリストは見つかりませんでした</p>
      <a href={topUrl()} className="text-sm underline" style={{ color: COLORS.accent }}>
        トップに戻る
      </a>
    </div>
  );
}
