import React from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';

// トップ画面の「リストの名前を決めよう」フルスクリーン
export default function CreateListModal() {
  const { setFormOpen, newListTitle, setNewListTitle, handleCreateList, creatingList } = useApp();
  return (
    <div className="fixed inset-0 z-40" style={{ backgroundColor: COLORS.bg, height: '100dvh' }}>
      <div className="max-w-md mx-auto h-full flex flex-col justify-center px-6">
        <button onClick={() => setFormOpen(false)} className="absolute top-4 left-4" style={{ color: COLORS.inkSoft }}>
          <X size={22} />
        </button>

        <h2 className="font-maru font-bold text-xl mb-6 text-center">リストの名前を決めよう</h2>

        <input
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="例：子供用品をゆずります"
          className="w-full px-4 py-3.5 rounded-2xl text-base outline-none mb-4 text-center"
          style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.card }}
        />

        <button
          onClick={handleCreateList}
          disabled={creatingList}
          className="w-full py-4 rounded-full font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
        >
          {creatingList ? '作成中…' : 'リストを作成'}
        </button>
      </div>
    </div>
  );
}
