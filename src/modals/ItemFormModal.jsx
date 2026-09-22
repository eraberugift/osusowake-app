import React from 'react';
import { X, Camera, Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { COLORS, CONDITIONS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { FullScreen } from '../components/ModalShell.jsx';

// 商品の出品フォーム
export default function ItemFormModal() {
  const {
    setFormOpen, resetForm, setShowExample,
    fileRef, handleFile, preview, compressing,
    name, setName, condition, setCondition, description, setDescription,
    submitItem, editingItem, requestDelete,
  } = useApp();
  const isEdit = !!editingItem;

  return (
    <FullScreen>
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
        <button onClick={() => { setFormOpen(false); resetForm(); }}><X size={20} /></button>
        <h2 className="font-maru font-bold text-base flex-1">{isEdit ? '商品の編集' : '商品の出品'}</h2>
        <button
          onClick={() => setShowExample(true)}
          className="text-xs underline flex-shrink-0"
          style={{ color: COLORS.indigo }}
        >
          見本を見る
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>写真</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="photo-input" />
          <label
            htmlFor="photo-input"
            className="flex items-center justify-center rounded-xl cursor-pointer overflow-hidden mx-auto"
  style={{ width: '10rem', height: '10rem', border: `1.5px dashed ${COLORS.borderStrong}`, backgroundColor: '#FCFBF8' }}
          >
            {compressing ? (
              <div className="flex flex-col items-center gap-1.5 py-8" style={{ color: COLORS.inkSoft }}>
                <Loader2 size={22} className="animate-spin" />
                <span className="text-xs">処理中…</span>
              </div>
            ) : preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-8" style={{ color: COLORS.inkSoft }}>
                <Camera size={24} />
                <span className="text-xs">タップして写真を選ぶ</span>
              </div>
            )}
          </label>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>品名</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：ラケットバッグ"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${COLORS.border}`, backgroundColor: '#FCFBF8' }}
          />
        </div>

        <div>
          <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>アイテムの状態</label>
          <div className="flex gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-colors"
                style={
                  condition === c
                    ? { backgroundColor: COLORS.accent, color: '#fff' }
                    : { backgroundColor: '#FCFBF8', color: COLORS.inkSoft, border: `1px solid ${COLORS.border}` }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {condition === '使用感あり' && (
          <a
            href="https://curama.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-3 rounded-lg text-xs"
            style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
          >
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
            <span>友達に譲れない大型家具などでお困りの場合は、一括無料査定サービスもあります</span>
          </a>
        )}

        <div>
          <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>詳細説明・注意点（任意）</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="サイズ、傷の場所、受け渡し方法など（任意）"
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style={{ border: `1px solid ${COLORS.border}`, backgroundColor: '#FCFBF8' }}
          />
        </div>
        {isEdit && (
          <button
            onClick={() => requestDelete(editingItem)}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-bold"
            style={{ border: `1px solid ${COLORS.border}`, color: COLORS.accentDeep }}
          >
            <Trash2 size={14} />
            この商品を削除する
          </button>
        )}
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        <button
          onClick={submitItem}
          className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
        >
          {isEdit ? 'この内容で保存する' : 'この内容で出品する'}
        </button>
      </div>
    </FullScreen>
  );
}
