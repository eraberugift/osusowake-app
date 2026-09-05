import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Gift, Package, MessageCircle, X, Trash2,
  CheckCircle2, Loader2, Plus, ChevronLeft,
  AlertTriangle, Clock, Link2, Share2
} from 'lucide-react';
import {
  getCurrentUserId, fetchItems, insertItem,
  updateItemFields, deleteItemRow, uploadItemImage
} from './storage.js';

const COLORS = {
  bg: '#FAF8F3',
  card: '#FFFFFF',
  ink: '#2B2620',
  inkSoft: '#8A8275',
  border: '#E8E2D6',
  accent: '#C1440E',
  accentDeep: '#9C3608',
  accentSoft: '#F4E3D8',
  indigo: '#2E4057',
  indigoSoft: '#E4E9EF',
  moss: '#5B7553',
  mossSoft: '#E7EDE3',
  line: '#06C755',
};

const CONDITIONS = ['美品', '目立つ傷なし', '使用感あり'];

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 480;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function timeAgo(ts) {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 60) return `${Math.max(diffMin, 1)}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  return `${Math.floor(diffHour / 24)}日前`;
}

function StatusBadge({ status, claimerName, size = 'sm' }) {
  const map = {
    open: { label: '募集中', bg: COLORS.accent, fg: '#fff' },
    kept: { label: claimerName ? `${claimerName}さんキープ中` : 'キープ中', bg: COLORS.indigo, fg: '#fff' },
    done: { label: 'お譲り確定', bg: COLORS.moss, fg: '#fff' },
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

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 font-kaku text-sm font-medium"
      style={{ backgroundColor: COLORS.ink, color: '#FAF8F3' }}
    >
      <CheckCircle2 size={16} />
      {message}
    </div>
  );
}

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [viewOwnerId, setViewOwnerId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);

  const [name, setName] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const [compressing, setCompressing] = useState(false);

  const [toast, setToast] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [claimerInput, setClaimerInput] = useState('');
  const [modalStage, setModalStage] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toastTimer = useRef(null);
  const fileRef = useRef(null);

  const isOwnMode = currentUserId && viewOwnerId && currentUserId === viewOwnerId;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const uid = await getCurrentUserId();
        if (!mounted) return;
        setCurrentUserId(uid);

        const params = new URLSearchParams(window.location.search);
        const u = params.get('u');
        const owner = u || uid;
        setViewOwnerId(owner);

        const list = await fetchItems(owner);
        if (!mounted) return;
        setItems(list);
      } catch (e) {
        showToast('読み込みに失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const showToast = (msg, ms = 2600) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), ms);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    const dataUrl = await compressImage(file);
    setPreview(dataUrl);
    setCompressing(false);
  };

  const resetForm = () => {
    setName('');
    setCondition(CONDITIONS[0]);
    setDescription('');
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submitItem = async () => {
    if (!name.trim()) {
      showToast('品名を入力してください');
      return;
    }

    let imageUrl = null;
    if (preview) {
      try {
        setCompressing(true);
        imageUrl = await uploadItemImage(preview);
      } catch (e) {
        showToast('画像のアップロードに失敗しました');
        setCompressing(false);
        return;
      }
      setCompressing(false);
    }

    try {
      const newItem = await insertItem(currentUserId, {
        name: name.trim(),
        condition,
        description: description.trim(),
        image: imageUrl,
      });
      setItems((cur) => [newItem, ...cur]);
      resetForm();
      setFormOpen(false);
      showToast('リストに登録しました！');
    } catch (e) {
      showToast('登録に失敗しました');
    }
  };

  const shareUrl = viewOwnerId
    ? `${window.location.origin}${window.location.pathname}?u=${viewOwnerId}`
    : window.location.href;
  const shareText = 'おすそわけリンクを見てね';
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    showToast('リンクをコピーしました！');
  };

  const openWantModal = (item) => {
    setModalItem(item);
    setModalStage(item.status === 'kept' || item.status === 'done' ? 'action' : 'name');
    setClaimerInput(item.claimerName || '');
  };

  const confirmClaim = async () => {
    if (!claimerInput.trim()) {
      showToast('お名前を入力してください');
      return;
    }
    try {
      await updateItemFields(modalItem.id, { status: 'kept', claimerName: claimerInput.trim() });
      const patch = { status: 'kept', claimerName: claimerInput.trim() };
      setItems((cur) => cur.map((it) => (it.id === modalItem.id ? { ...it, ...patch } : it)));
      setModalItem({ ...modalItem, ...patch });
      setViewItem((v) => (v && v.id === modalItem.id ? { ...v, ...patch } : v));
      setModalStage('action');
    } catch (e) {
      showToast('更新に失敗しました');
    }
  };

  const markDone = async (item) => {
    try {
      await updateItemFields(item.id, { status: 'done' });
      setItems((cur) => cur.map((it) => (it.id === item.id ? { ...it, status: 'done' } : it)));
      setViewItem((v) => (v && v.id === item.id ? { ...v, status: 'done' } : v));
      setOwnerMenuOpen(false);
      showToast('お譲り確定にしました');
    } catch (e) {
      showToast('更新に失敗しました');
    }
  };

  const requestDelete = (item) => setConfirmDelete(item);

  const doDelete = async () => {
    try {
      await deleteItemRow(confirmDelete.id);
      setItems((cur) => cur.filter((it) => it.id !== confirmDelete.id));
      showToast('削除しました');
      setViewItem((v) => (v && v.id === confirmDelete.id ? null : v));
      setConfirmDelete(null);
    } catch (e) {
      showToast('削除に失敗しました');
    }
  };

  const lineDummyUrl = (item) =>
    `https://line.me/R/oaMessage/@dummy/?${encodeURIComponent(`【譲って！】${item.name}が欲しいです！`)}`;

  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
        .font-maru { font-family: 'Zen Maru Gothic', sans-serif; }
        .font-kaku { font-family: 'Zen Kaku Gothic New', sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(250,248,243,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="font-maru font-bold text-lg leading-tight" style={{ color: COLORS.accent }}>
            おすそわけリンク（仮）
          </h1>
          <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
            {isOwnMode ? 'あなたのリスト' : '友達からのおすそわけ'}
          </p>
        </div>

        {isOwnMode ? (
          <div className="max-w-md mx-auto px-4 pb-3 relative">
            <button
              onClick={() => setShareMenuOpen((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-kaku text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.accent, color: '#fff' }}
            >
              <Share2 size={16} />
              共有する
            </button>

            {shareMenuOpen && (
              <React.Fragment>
                <div className="fixed inset-0 z-20" onClick={() => setShareMenuOpen(false)} />
                <div
                  className="absolute left-4 right-4 top-full mt-2 rounded-xl overflow-hidden shadow-lg z-30"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <a
                    href={lineShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShareMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold"
                    style={{ color: COLORS.ink, borderBottom: `1px solid ${COLORS.border}` }}
                  >
                    <MessageCircle size={17} color={COLORS.line} />
                    LINEで送る
                  </a>
                  <button
                    onClick={() => { copyLink(); setShareMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold"
                    style={{ color: COLORS.ink }}
                  >
                    <Link2 size={17} color={COLORS.indigo} />
                    リンクをコピー
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto px-4 pb-3">
            <a
              href={window.location.origin + window.location.pathname}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-kaku text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.moss, color: '#fff' }}
            >
              あなたも譲れるものはありませんか？
            </a>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-maru font-bold text-sm">アイテム一覧</h2>
          <span className="text-xs" style={{ color: COLORS.inkSoft }}>{items.length}件</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16" style={{ color: COLORS.inkSoft }}>
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: COLORS.inkSoft }}>
            {isOwnMode
              ? 'まだアイテムがありません。右下の＋から出品してみましょう'
              : 'まだアイテムがありません'}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden divide-y" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderColor: COLORS.border }}>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setViewItem(item)}
                className="w-full text-left flex items-center gap-3 px-3 py-3 active:bg-stone-50 transition-colors"
                style={{ borderColor: COLORS.border }}
              >
                <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden" style={{ backgroundColor: '#F0ECE2' }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      style={{ opacity: item.status === 'done' ? 0.45 : 1 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft, opacity: item.status === 'done' ? 0.45 : 1 }}>
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
            ))}
          </div>
        )}
      </main>

      {isOwnMode && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-6 right-5 z-30 flex items-center justify-center w-14 h-14 rounded-full shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: COLORS.accent, color: '#fff' }}
          aria-label="出品する"
        >
          <Plus size={26} />
        </button>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: COLORS.bg }}>
          <div className="max-w-md mx-auto h-full flex flex-col">
            <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
              <button onClick={() => { setFormOpen(false); resetForm(); }}><X size={20} /></button>
              <h2 className="font-maru font-bold text-base">商品の出品</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>写真</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFile}
                  className="hidden"
                  id="photo-input"
                />
                <label
                  htmlFor="photo-input"
                  className="flex items-center justify-center rounded-xl cursor-pointer overflow-hidden"
                  style={{ height: preview ? 'auto' : '11rem', border: `1.5px dashed ${COLORS.border}`, backgroundColor: '#FCFBF8' }}
                >
                  {compressing ? (
                    <div className="flex flex-col items-center gap-1.5 py-8" style={{ color: COLORS.inkSoft }}>
                      <Loader2 size={22} className="animate-spin" />
                      <span className="text-xs">処理中…</span>
                    </div>
                  ) : preview ? (
                    <img src={preview} alt="preview" className="w-full max-h-64 object-cover" />
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
                <label className="text-xs font-bold block mb-1.5" style={{ color: COLORS.inkSoft }}>詳細説明・注意点</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="サイズ、傷の場所、受け渡し方法の希望など"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ border: `1px solid ${COLORS.border}`, backgroundColor: '#FCFBF8' }}
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
              <button
                onClick={submitItem}
                className="w-full py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
                style={{ backgroundColor: COLORS.accent, color: '#fff' }}
              >
                この内容で出品する
              </button>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: COLORS.bg }}>
          <div className="max-w-md mx-auto h-full flex flex-col">
            <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b z-10" style={{ backgroundColor: 'rgba(250,248,243,0.95)', borderColor: COLORS.border }}>
              <button onClick={() => { setViewItem(null); setOwnerMenuOpen(false); }}><ChevronLeft size={22} /></button>
              <h2 className="font-maru font-bold text-base">商品の詳細</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-square" style={{ backgroundColor: '#F0ECE2' }}>
                {viewItem.image ? (
                  <img src={viewItem.image} alt={viewItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft }}>
                    <Package size={40} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={viewItem.status} claimerName={viewItem.claimerName} size="lg" />
                </div>
              </div>

              <div className="px-4 py-4">
                <h3 className="font-maru font-bold text-lg leading-snug mb-2">{viewItem.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
                    {viewItem.condition}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.inkSoft }}>
                    <Clock size={12} />
                    {timeAgo(viewItem.createdAt)}に出品
                  </span>
                </div>

                {viewItem.description && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.ink }}>{viewItem.description}</p>
                )}

                {isOwnMode && (
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                    <button
                      onClick={() => setOwnerMenuOpen((v) => !v)}
                      className="text-xs font-bold"
                      style={{ color: COLORS.inkSoft }}
                    >
                      出品者メニュー {ownerMenuOpen ? '▲' : '▼'}
                    </button>
                    {ownerMenuOpen && (
                      <div className="flex gap-2 mt-2.5">
                        {viewItem.status !== 'done' && (
                          <button
                            onClick={() => markDone(viewItem)}
                            className="flex-1 py-2 rounded-lg text-xs font-bold"
                            style={{ border: `1px solid ${COLORS.moss}`, color: COLORS.moss }}
                          >
                            お譲り確定にする
                          </button>
                        )}
                        <button
                          onClick={() => requestDelete(viewItem)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.accentDeep }}
                        >
                          <Trash2 size={13} />
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
              {viewItem.status === 'open' && (
                <button
                  onClick={() => openWantModal(viewItem)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: COLORS.accent, color: '#fff' }}
                >
                  これ欲しい！
                </button>
              )}
              {viewItem.status === 'kept' && (
                <button
                  onClick={() => openWantModal(viewItem)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
                >
                  連絡方法を見る
                </button>
              )}
              {viewItem.status === 'done' && (
                <div className="w-full py-3.5 rounded-xl font-bold text-sm text-center" style={{ backgroundColor: '#F0ECE2', color: COLORS.inkSoft }}>
                  お譲り済みです
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(43,38,32,0.5)' }} onClick={() => setModalItem(null)} />
          <div className="relative w-full max-w-md rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto" style={{ backgroundColor: COLORS.card }}>
            <button onClick={() => setModalItem(null)} className="absolute top-4 right-4" style={{ color: COLORS.inkSoft }}>
              <X size={20} />
            </button>

            <h3 className="font-maru font-bold text-base mb-1 pr-6">{modalItem.name}</h3>
            <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>{modalItem.condition}</p>

            {modalStage === 'name' ? (
              <div className="space-y-3">
                <p className="text-sm" style={{ color: COLORS.ink }}>
                  「これ欲しい！」を押すと、このアイテムはキープ中になります。お名前を入れてください。
                </p>
                <input
                  value={claimerInput}
                  onChange={(e) => setClaimerInput(e.target.value)}
                  placeholder="例：たなか"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ border: `1px solid ${COLORS.border}` }}
                />
                <button
                  onClick={confirmClaim}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: COLORS.accent, color: '#fff' }}
                >
                  キープしてLINEで連絡する
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: COLORS.mossSoft, color: COLORS.moss }}>
                  チャットや決済は不要！このまま譲る側のLINEで直接話そう
                </div>

                <a
                  href={lineDummyUrl(modalItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: COLORS.line, color: '#fff' }}
                >
                  <MessageCircle size={18} />
                  LINEで直接連絡する
                </a>
                <p className="text-xs leading-relaxed -mt-2" style={{ color: COLORS.inkSoft }}>
                  タップすると、「【譲って！】{modalItem.name}が欲しいです！」の文章が入力された状態でLINEが開く想定です（このプロトタイプではダミーリンクです）。
                </p>

                <div className="pt-2 border-t space-y-2" style={{ borderColor: COLORS.border }}>
                  <p className="text-xs font-bold" style={{ color: COLORS.inkSoft }}>お礼・受け渡しの準備（任意）</p>
                  <a
                    href="https://gift.line.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
                    style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accentDeep }}
                  >
                    <Gift size={17} />
                    <span className="flex-1">お礼のプチギフトを贈る（スタバ 500円）</span>
                  </a>
                  <a
                    href="https://www.amazon.co.jp/s?k=%E6%A2%B1%E5%8C%85%E8%B3%87%E6%9D%90"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
                    style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
                  >
                    <Package size={17} />
                    <span className="flex-1">梱包・発送の準備をする</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(43,38,32,0.5)' }} onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-xs rounded-2xl p-5" style={{ backgroundColor: COLORS.card }}>
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
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
