import React from 'react';
import { COLORS } from '../constants.js';

export default function StatusBadge({ status, claimerName, size = 'sm' }) {
  const map = {
    open: { label: '募集中', bg: COLORS.accent, fg: '#fff' },
    kept: { label: claimerName ? `${claimerName}さんとマッチング中` : 'マッチング中', bg: COLORS.indigo, fg: '#fff' },
    done: { label: 'お譲り完了', bg: COLORS.moss, fg: '#fff' },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold font-kaku whitespace-nowrap ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
