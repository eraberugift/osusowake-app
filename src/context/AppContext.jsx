import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  getCurrentUserId, getMyId, setMyId,
  createList, fetchList, updateListTitle,
  getMyListIds, addMyListId, fetchListsByIds, fetchListsByCreator,
  fetchListAdmin, getAdminKey, saveAdminKey,
  fetchItemsByList, insertItem, updateItemFields, updateItemContent, deleteItemRow, uploadItemImage,
  claimItem,
  loginOrRegisterWithEmail, getNotifyEmail, updateNotifyEmail, logout,
  addEmailHistory
} from '../storage.js';
import { CONDITIONS } from '../constants.js';
import { compressImage, isPastDeadline, defaultListTitle, listUrl } from '../utils.js';

const AppContext = createContext(null);

// 画面・モーダル側はこれを呼ぶだけで必要な state / 関数を取り出せる
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

export function AppProvider({ children }) {
  const [myId, setMyIdState] = useState(null);
  const [booting, setBooting] = useState(true);

  const [currentListId, setCurrentListId] = useState(null);
  const [list, setList] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [listNotFound, setListNotFound] = useState(false);

  const [items, setItems] = useState([]);

  const [creatingList, setCreatingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [myLists, setMyLists] = useState([]);
  const [allListsPage, setAllListsPage] = useState(false);
  const [page, setPage] = useState(null);
  const [showMyLists, setShowMyLists] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

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
  const [showExample, setShowExample] = useState(false);
  const [forcedGuest, setForcedGuest] = useState(false);
  const [isListAdmin, setIsListAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState(null);

  const toastTimer = useRef(null);
  const fileRef = useRef(null);

  const isCreatorMode = !forcedGuest && !!list && isListAdmin;
  const deadlinePassed = list && isPastDeadline(list.deadline);

  const showToast = (msg, ms = 2600) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), ms);
  };

  // ------- 起動時：ユーザーID確定・URL判定・自分のリスト読み込み -------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const uid = await getCurrentUserId();
        if (!mounted) return;

        let id = getMyId();
        if (!id) {
          id = uid;
          setMyId(id);
        }
        setMyIdState(id);

        const params = new URLSearchParams(window.location.search);
        const listId = params.get('list');
        const guestMode = params.get('view') === 'guest';

        if (listId) {
          setCurrentListId(listId);
          setForcedGuest(guestMode);
        } else {
          if (params.get('mylists') === '1') setAllListsPage(true);
          if (params.get('page') === 'privacy' || params.get('page') === 'terms') {
            setPage(params.get('page'));  // ★追加
          }
          try {
            const email = await getNotifyEmail(id);
            if (mounted) setNotifyEmail(email);
          } catch (_) {}
          const ids = getMyListIds();
          if (ids.length > 0) {
            try {
              const lists = await fetchListsByIds(ids);
              if (mounted) setMyLists(lists);
            } catch (_) {}
          }
        }
      } catch (e) {
        showToast('読み込みに失敗しました');
      } finally {
        if (mounted) setBooting(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ------- リストとアイテムの読み込み -------
  useEffect(() => {
    if (!currentListId) return;
    let mounted = true;
    (async () => {
      setListLoading(true);
      setListNotFound(false);
      try {
        const l = await fetchList(currentListId);
        if (!mounted) return;
        if (!l) {
          setListNotFound(true);
          setListLoading(false);
          return;
        }
        setList(l);
        const its = await fetchItemsByList(currentListId);
        if (!mounted) return;

        // URLのキー → 端末に覚えたキー の順で使い、作成者か照合する
        const urlKey = new URLSearchParams(window.location.search).get('key');
        let admin = null;
        try {
          admin = await fetchListAdmin(currentListId, myId, urlKey || getAdminKey(currentListId));
        } catch (_) {}
        if (!mounted) return;

        if (admin) {
          saveAdminKey(currentListId, admin.adminKey);
          addMyListId(currentListId); // トップの「あなたが作ったリスト」にも出す
          setAdminKey(admin.adminKey);
          setIsListAdmin(true);
          setItems(its.map((it) => ({ ...it, claimerName: admin.claimers[it.id] ?? null })));
        } else {
          setAdminKey(null);
          setIsListAdmin(false);
          setItems(its);
        }

        if (myId) {
          try {
            const email = await getNotifyEmail(myId);
            if (mounted) setNotifyEmail(email);
          } catch (_) {}
        }
      } catch (e) {
        showToast('読み込みに失敗しました');
      } finally {
        if (mounted) setListLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [currentListId, myId]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    const dataUrl = await compressImage(file);
    setPreview(dataUrl);
    setCompressing(false);
  };

  // 変更後
  const resetForm = () => {
    setName('');
    setCondition(CONDITIONS[0]);
    setDescription('');
    setPreview(null);
    setEditingItem(null); // ★追加
    if (fileRef.current) fileRef.current.value = '';
  };

  // ★追加：商品の編集画面を開く（今の内容をフォームに入れてから開く）
  const openEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCondition(item.condition);
    setDescription(item.description || '');
    setPreview(item.image || null);
    if (fileRef.current) fileRef.current.value = '';
    setFormOpen(true);
  };

  // 「はじめる」で即リストを作成して、リスト画面へ移動する
  const handleCreateList = async () => {
    if (creatingList) return;
    setCreatingList(true);
    try {
      const l = await createList(myId, { title: newListTitle.trim() || defaultListTitle(), deadline: null });
      addMyListId(l.id);
      window.location.href = listUrl(l.id);
    } catch (e) {
      showToast('作成に失敗しました');
      setCreatingList(false);
    }
  };

    // 商品を登録する／編集内容を保存する
    const submitItem = async () => {
      if (!name.trim()) {
        showToast('品名を入力してください');
        return;
      }

      // 既存の画像はURL（http...）、新しく選んだ画像は data: で始まる
      let imageUrl = preview;
      if (preview && preview.startsWith('data:')) {
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

      const fields = {
        name: name.trim(),
        condition,
        description: description.trim(),
        image: imageUrl,
      };

      // 編集の場合
      if (editingItem) {
        try {
          await updateItemContent(editingItem.id, fields);
          setItems((cur) => cur.map((it) => (it.id === editingItem.id ? { ...it, ...fields } : it)));
          setViewItem((v) => (v && v.id === editingItem.id ? { ...v, ...fields } : v));
          resetForm();
          setFormOpen(false);
          showToast('変更を保存しました');
        } catch (e) {
          showToast('保存に失敗しました');
        }
        return;
      }

      // 新規出品の場合
      try {
        const newItem = await insertItem(currentListId, myId, fields);
        setItems((cur) => [newItem, ...cur]);
        resetForm();
        setFormOpen(false);
        showToast('リストに登録しました！');
      } catch (e) {
        showToast('登録に失敗しました');
      }
    };

  const handleSaveTitle = async () => {
    if (!titleInput.trim()) {
      showToast('タイトルを入力してください');
      return;
    }
    setSavingTitle(true);
    try {
      await updateListTitle(currentListId, titleInput.trim());
      setList((cur) => ({ ...cur, title: titleInput.trim() }));
      setTitleEditing(false);
      showToast('タイトルを変更しました');
    } catch (e) {
      showToast('変更に失敗しました');
    } finally {
      setSavingTitle(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!emailInput.trim()) {
      showToast('メールアドレスを入力してください');
      return;
    }
    setSavingEmail(true);
    try {
      const resolvedId = await loginOrRegisterWithEmail(emailInput.trim(), myId);
      addEmailHistory(emailInput.trim());
      if (resolvedId !== myId) {
        setMyId(resolvedId);
        setMyIdState(resolvedId);
        try {
          const lists = await fetchListsByCreator(resolvedId);
          setMyLists(lists);
          lists.forEach((l) => addMyListId(l.id));
        } catch (_) {}
        showToast('以前のリストを復元しました！');
      } else {
        showToast('メールアドレスを登録しました！');
      }
      setNotifyEmail(emailInput.trim().toLowerCase());
      setEmailInput('');
    } catch (e) {
      showToast('登録に失敗しました');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!emailInput.trim()) {
      showToast('メールアドレスを入力してください');
      return;
    }
    setSavingEmail(true);
    try {
      await updateNotifyEmail(myId, emailInput.trim());
      addEmailHistory(emailInput.trim());
      setNotifyEmail(emailInput.trim().toLowerCase());
      setEditingEmail(false);
      setEmailInput('');
      showToast('メールアドレスを更新しました');
    } catch (e) {
      if (e.message === 'EMAIL_TAKEN') {
        showToast('そのメールアドレスは既に使われています');
      } else {
        showToast('更新に失敗しました');
      }
    } finally {
      setSavingEmail(false);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      const newId = await logout();
      setMyId(newId);
      setMyIdState(newId);
      setNotifyEmail(null);
      setEmailInput('');
      setEditingEmail(false);
      showToast('ログアウトしました');
    } catch (e) {
      showToast('ログアウトに失敗しました');
    } finally {
      setLogoutConfirmOpen(false);
    }
  };

  // ------- 共有 -------
  // v はカードの作り直し用。アイテム数やタイトルが変わるとURLも変わり、
  // LINEやXが新しいカードを読み込み直す。デザインを変えたら CARD_VERSION を1つ上げる
  const CARD_VERSION = 3;
  const openItems = items.filter((it) => it.status === 'open');
  const titleHash = [...(list?.title || '')]
    .reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0)
    .toString(36);
  const shareVersion = `${CARD_VERSION}-${items.length}-${openItems.length}-${titleHash}`;
  const shareUrl = currentListId
    ? `${window.location.origin}/s/${currentListId}?v=${shareVersion}`
    : window.location.href;

  // LINE
  const shareText =
    '大切に使っていたけれど、使わなくなったものをリストにしました。\n' +
    '欲しいものがあれば「これ欲しい！」ボタンで教えてね\n' +
    shareUrl;
  const lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(shareText)}`;

  // X（リストの中身から文章を自動で作る）
  const displayTitle =
    !list?.title || list.title === 'ゆずりたいものリスト' ? 'わたしのおゆずりしたいもの' : list.title;
  const pickNames = openItems.slice(0, 3).map((it) => it.name).join('、');
  const xText = [
    '大切にしてきたものを、おゆずりします🐿️',
    `「${displayTitle}」`,
    openItems.length > 0 ? `${pickNames}${openItems.length > 3 ? `など${openItems.length}点` : ''}` : null,
    '欲しいものがあれば「これ欲しい！」で教えてね',
  ].filter(Boolean).join('\n');
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(shareUrl)}`;

  // Instagramストーリーズ
  // iPhoneは「タップした瞬間」に共有しないと失敗するので、画像は共有シートを開いた時点で先に読み込んでおく
  const storyImageUrl = currentListId
    ? `${window.location.origin}/api/story?id=${currentListId}&v=${shareVersion}`
    : null;
  const [storyFile, setStoryFile] = useState(null);

  useEffect(() => {
    if (!shareSheetOpen || !storyImageUrl) return;
    let alive = true;
    setStoryFile(null);
    fetch(storyImageUrl)
      .then((r) => r.blob())
      .then((b) => { if (alive) setStoryFile(new File([b], 'yuzulist-story.png', { type: 'image/png' })); })
      .catch(() => {});
    return () => { alive = false; };
  }, [shareSheetOpen, storyImageUrl]);

  const shareToInstagram = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});

    // スマホで画像共有ができるとき → 共有メニューへ
    if (storyFile && navigator.canShare?.({ files: [storyFile] })) {
      navigator.share({ files: [storyFile] })
        .then(() => showToast('スタンプの「リンク」から、コピーしたリンクを貼ってね', 4500))
        .catch(() => {});
      return;
    }
    if (!storyFile && navigator.canShare) {
      showToast('画像を準備中です。もう一度押してね');
      return;
    }
    // PCなど → 画像を別タブで開く
    window.open(storyImageUrl, '_blank');
    showToast('画像を保存して、インスタに投稿してね', 4000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    showToast('リンクをコピーしました！');
  };

  const adminUrl = currentListId && adminKey ? listUrl(currentListId, { key: adminKey }) : null;

  const copyAdminLink = () => {
    if (!adminUrl) return;
    navigator.clipboard?.writeText(adminUrl).catch(() => {});
    showToast('管理用リンクをコピーしました。メモなどに保存してください', 3500);
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
      await claimItem(modalItem.id, claimerInput.trim()); // ← ここを変更
      const patch = { status: 'kept', claimerName: claimerInput.trim() };
      setItems((cur) => cur.map((it) => (it.id === modalItem.id ? { ...it, ...patch } : it)));
      setModalItem({ ...modalItem, ...patch });
      setViewItem((v) => (v && v.id === modalItem.id ? { ...v, ...patch } : v));
      setModalStage('action');
    } catch (e) {
      // ↓ ここを変更
      if (e.message === 'ALREADY_CLAIMED') {
        showToast('ほかの方がマッチングしました');
        setModalItem(null);
      } else {
        showToast('更新に失敗しました');
      }
    }
  };

  const markDone = async (item) => {
    try {
      await updateItemFields(item.id, { status: 'done' });
      setItems((cur) => cur.map((it) => (it.id === item.id ? { ...it, status: 'done' } : it)));
      setViewItem((v) => (v && v.id === item.id ? { ...v, status: 'done' } : v));
      showToast('お譲り完了にしました');
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
      if (editingItem && editingItem.id === confirmDelete.id) {
        setFormOpen(false);
        resetForm();
      }
      setConfirmDelete(null);
    } catch (e) {
      showToast('削除に失敗しました');
    }
  };

  const lineDummyUrl = (item) =>
    `https://line.me/R/oaMessage/@dummy/?${encodeURIComponent(`【譲って！】${item.name}が欲しいです！`)}`;

  const doneCount = items.filter((it) => it.status !== 'open').length;

  const value = {
    // 基本
    myId, booting,
    currentListId, list, listLoading, listNotFound,
    items, setItems,
    isCreatorMode, deadlinePassed, doneCount,
    // リスト一覧・トップ
    creatingList, newListTitle, setNewListTitle, handleCreateList,
    myLists, allListsPage, showMyLists, setShowMyLists, page,
    // メール／ログイン
    showEmailLogin, setShowEmailLogin,
    notifyEmail, emailInput, setEmailInput, savingEmail, editingEmail, setEditingEmail,
    handleEmailSubmit, handleEmailUpdate,
    logoutConfirmOpen, setLogoutConfirmOpen, handleLogoutConfirm,
    // 出品フォーム
    formOpen, setFormOpen, resetForm, submitItem,
    name, setName, condition, setCondition, description, setDescription,
    preview, compressing, handleFile, fileRef,
    showExample, setShowExample,
    // 共有・タイトル編集
    shareSheetOpen, setShareSheetOpen, shareUrl, lineShareUrl, xShareUrl, shareToInstagram, copyLink,
    adminUrl, copyAdminLink,
    titleEditing, setTitleEditing, titleInput, setTitleInput, savingTitle, handleSaveTitle,
    // アイテム詳細・操作
    viewItem, setViewItem, editingItem, openEdit,
    modalItem, setModalItem, modalStage, claimerInput, setClaimerInput,
    openWantModal, confirmClaim, markDone,
    requestDelete, confirmDelete, setConfirmDelete, doDelete,
    lineDummyUrl,
    // その他
    toast, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
