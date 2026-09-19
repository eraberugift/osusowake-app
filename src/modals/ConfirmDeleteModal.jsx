import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { CenterModal } from '../components/ModalShell.jsx';

export default function ConfirmDeleteModal() {
  const { confirmDelete, setConfirmDelete, doDelete } = useApp();
  return (
    <CenterModal onClose={() => setConfirmDelete(null)}>
      <h3 className="font-bold text-sm mb-2">「{confirmDelete.name}」を削除しますか？</h3>
      <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>この操作は取り消せません。</p>

      {confirmDelete.condition === '使用感あり' && (
        <a
          href="https://curama.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 p-3 rounded-lg text-xs mb-4"
          style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
        >
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
          <span>友達に譲れなかった処分にお困りなら、一括無料査定という手もあります</span>
        </a>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setConfirmDelete(null)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }}
        >
          キャンセル
        </button>
        <button
          onClick={doDelete}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
        >
          削除する
        </button>
      </div>
    </CenterModal>
  );
}
