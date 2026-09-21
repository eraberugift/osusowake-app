import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

let authPromise = null;

export function getCurrentUserId() {
  if (authPromise) return authPromise;

  authPromise = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user.id;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.user.id;
  })();

  return authPromise;
}

// ------- リスト関連 -------

function rowToList(row) {
  return {
    id: row.id,
    creatorId: row.creator_id,
    title: row.title,
    deadline: row.deadline,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function createList(creatorId, { title, deadline }) {
  const { data, error } = await supabase
    .from('lists')
    .insert({ creator_id: creatorId, title: title || 'ゆずりたいものリスト', deadline: deadline || null })
    .select()
    .single();

  if (error) throw error;
  return rowToList(data);
}

export async function fetchList(listId) {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('id', listId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToList(data) : null;
}

export async function updateListTitle(listId, title) {
  const { error } = await supabase
    .from('lists')
    .update({ title: title || 'ゆずりたいものリスト' })
    .eq('id', listId);

  if (error) throw error;
}

export async function updateListDeadline(listId, deadline) {
  const { error } = await supabase
    .from('lists')
    .update({ deadline: deadline || null })
    .eq('id', listId);

  if (error) throw error;
}

const MY_LISTS_KEY = 'osusowake-my-lists';

export function getMyListIds() {
  const raw = localStorage.getItem(MY_LISTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addMyListId(listId) {
  const ids = getMyListIds();
  if (!ids.includes(listId)) {
    ids.unshift(listId);
    localStorage.setItem(MY_LISTS_KEY, JSON.stringify(ids));
  }
}

export async function fetchListsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  const rows = data.map(rowToList);
  return ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
}

export async function fetchListsByCreator(creatorId) {
  const { data, error } = await supabase
    .from('lists')
    .select('*, items!inner(id)')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(rowToList);
}

// ------- アイテム関連 -------

function rowToItem(row) {
  return {
    id: row.id,
    listId: row.list_id,
    name: row.name,
    condition: row.condition,
    description: row.description,
    image: row.image,
    status: row.status,
    claimerName: row.claimer_name,
    createdAt: new Date(row.created_at).getTime(),
    ownerId: row.owner_id,
  };
}

export async function fetchItemsByList(listId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(rowToItem);
}

export async function insertItem(listId, creatorId, item) {
  const { data, error } = await supabase
    .from('items')
    .insert({
      list_id: listId,
      owner_id: creatorId,
      name: item.name,
      condition: item.condition,
      description: item.description,
      image: item.image,
      status: 'open',
    })
    .select()
    .single();

  if (error) throw error;
  return rowToItem(data);
}

export async function updateItemFields(id, patch) {
  const dbPatch = {};
  if (patch.status) dbPatch.status = patch.status;
  if (patch.claimerName !== undefined) dbPatch.claimer_name = patch.claimerName;
  const { error } = await supabase.from('items').update(dbPatch).eq('id', id);
  if (error) throw error;
}

export async function deleteItemRow(id) {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadItemImage(dataUrl) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage
    .from('item-images')
    .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('item-images').getPublicUrl(fileName);
  return data.publicUrl;
}

// ------- Googleログイン関連（維持、未使用） -------

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href },
  });
  if (error) throw error;
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return data.subscription;
}

export function isAnonymousUser(user) {
  return !!user?.is_anonymous;
}

// ------- メールアドレスによる通知登録・復元・統合 -------

export async function loginOrRegisterWithEmail(email, currentOwnerId) {
  const normalized = email.trim().toLowerCase();

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('owner_id')
    .eq('notify_email', normalized)
    .maybeSingle();

  if (findError) throw findError;

  if (existing && existing.owner_id !== currentOwnerId) {
    // アイテムの持ち主だけでなく、リストの持ち主情報も一緒に付け替える
    const { error: mergeItemsError } = await supabase
      .from('items')
      .update({ owner_id: existing.owner_id })
      .eq('owner_id', currentOwnerId);

    if (mergeItemsError) throw mergeItemsError;

    const { error: mergeListsError } = await supabase
      .from('lists')
      .update({ creator_id: existing.owner_id })
      .eq('creator_id', currentOwnerId);

    if (mergeListsError) throw mergeListsError;

    return existing.owner_id;
  }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({ owner_id: currentOwnerId, notify_email: normalized, updated_at: new Date().toISOString() });

  if (upsertError) throw upsertError;
  return currentOwnerId;
}

export async function getNotifyEmail(ownerId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('notify_email')
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) throw error;
  return data?.notify_email || null;
}

export async function updateNotifyEmail(ownerId, newEmail) {
  const normalized = newEmail.trim().toLowerCase();

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('owner_id')
    .eq('notify_email', normalized)
    .maybeSingle();

  if (findError) throw findError;
  if (existing && existing.owner_id !== ownerId) {
    throw new Error('EMAIL_TAKEN');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ owner_id: ownerId, notify_email: normalized, updated_at: new Date().toISOString() });

  if (error) throw error;
}

// ------- この端末で「あなた」として扱うIDを覚えておく仕組み -------

const MY_ID_KEY = 'osusowake-my-id';

export function getMyId() {
  return localStorage.getItem(MY_ID_KEY);
}

export function setMyId(id) {
  localStorage.setItem(MY_ID_KEY, id);
}

export function clearMyId() {
  localStorage.removeItem(MY_ID_KEY);
}

export async function logout() {
  await supabase.auth.signOut();
  clearMyId();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user.id;
}

// ------- メールアドレスの入力履歴（iPhone Safari対策の自前補完） -------

const EMAIL_HISTORY_KEY = 'osusowake-email-history';

export function getEmailHistory() {
  const raw = localStorage.getItem(EMAIL_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addEmailHistory(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  let history = getEmailHistory();
  history = history.filter((e) => e !== normalized);
  history.unshift(normalized);
  history = history.slice(0, 5);
  localStorage.setItem(EMAIL_HISTORY_KEY, JSON.stringify(history));
}
