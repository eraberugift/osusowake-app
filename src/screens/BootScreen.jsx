import React from 'react';
import { Loader2 } from 'lucide-react';
import { COLORS } from '../constants.js';
import GlobalStyle from '../components/GlobalStyle.jsx';

export default function BootScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center font-kaku" style={{ backgroundColor: COLORS.bg }}>
      <GlobalStyle />
      <Loader2 size={24} className="animate-spin" style={{ color: COLORS.inkSoft }} />
    </div>
  );
}
