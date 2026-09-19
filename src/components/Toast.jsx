import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 font-kaku text-sm font-medium"
      style={{ backgroundColor: COLORS.ink, color: '#FAF8F3' }}
    >
      <CheckCircle2 size={16} />
      {toast}
    </div>
  );
}
