import React from 'react';
import { Package, Clock } from 'lucide-react';
import { COLORS } from '../constants.js';
import { timeAgo } from '../utils.js';
import StatusBadge from './StatusBadge.jsx';

// アイテム一覧の1行
export default function ItemRow({ item, onClick }) {
  const dimmed = item.status === 'done' ? 0.45 : 1;
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-3 py-3 active:bg-stone-50 transition-colors"
      style={{ borderColor: COLORS.border }}
    >
      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden" style={{ backgroundColor: '#F0ECE2' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" style={{ opacity: dimmed }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft, opacity: dimmed }}>
            <Package size={22} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate mb-1">{item.name}</p>
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <StatusBadge status={item.status} claimerName={item.claimerName} />
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
            {item.condition}
          </span>
        </div>
        <p className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.inkSoft }}>
          <Clock size={11} />
          {timeAgo(item.createdAt)}に出品
        </p>
      </div>
    </button>
  );
}
