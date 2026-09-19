import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants.js';
import { formatDeadline, timeAgo, listUrl } from '../utils.js';

// 「あなたが作ったリスト」の1行（トップ画面と全件画面で共用）
export default function ListLinkRow({ list }) {
  return (
    <a
      href={listUrl(list.id)}
      className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 active:bg-stone-50 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold truncate">{list.title}</p>
        <p className="text-[11px]" style={{ color: COLORS.inkSoft }}>
          {list.deadline ? `期限：${formatDeadline(list.deadline)}` : timeAgo(list.createdAt) + 'に作成'}
        </p>
      </div>
      <ChevronLeft size={16} style={{ color: COLORS.inkSoft, transform: 'rotate(180deg)', flexShrink: 0 }} />
    </a>
  );
}
