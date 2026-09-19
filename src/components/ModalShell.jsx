import React from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../constants.js';

// 中央に出る小さめのダイアログ
export function CenterModal({ onClose, closable = false, children, width = 'max-w-xs' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(43,38,32,0.5)' }} onClick={onClose} />
      <div className={`relative w-full ${width} rounded-2xl p-5`} style={{ backgroundColor: COLORS.card }}>
        {closable && (
          <button onClick={onClose} className="absolute top-4 right-4" style={{ color: COLORS.inkSoft }}>
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

// 下からせり上がるシート
export function BottomSheet({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(43,38,32,0.5)' }} onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto" style={{ backgroundColor: COLORS.card }}>
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: COLORS.inkSoft }}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

// 画面全体を覆うフルスクリーンモーダル
export function FullScreen({ children, className = 'max-w-md mx-auto h-full flex flex-col' }) {
  return (
    <div className="fixed inset-0 z-40" style={{ backgroundColor: COLORS.bg, height: '100dvh' }}>
      <div className={className}>{children}</div>
    </div>
  );
}
