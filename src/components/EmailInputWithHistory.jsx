import React, { useState } from 'react';
import { COLORS } from '../constants.js';
import { getEmailHistory } from '../storage.js';

// メールアドレス入力欄（iPhone Safari対策の自前入力履歴付き）
export default function EmailInputWithHistory({ value, onChange, placeholder, dropUp = false }) {
  const [open, setOpen] = useState(false);
  const history = getEmailHistory();
  const filtered = history.filter((h) => h.includes(value.trim().toLowerCase()));

  return (
    <div className="relative flex-1 min-w-0">
      <input
        type="email"
        name="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full min-w-0 px-3 py-2 rounded-lg text-xs outline-none"
        style={{ border: `1px solid ${COLORS.border}`, backgroundColor: '#FCFBF8' }}
      />
      {open && filtered.length > 0 && (
        <div
          className={`absolute left-0 right-0 ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'} rounded-lg overflow-hidden shadow-lg z-40`}
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          {filtered.map((h) => (
            <button
              key={h}
              onMouseDown={(e) => { e.preventDefault(); onChange(h); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs"
              style={{ color: COLORS.ink }}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
