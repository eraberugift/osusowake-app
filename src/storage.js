import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 今のブラウザ専用の「あなたのID」を取得する。
// まだ一度もアクセスしたことがなければ、裏側で自動的に匿名アカウントが作られる（画面には何も表示されない）
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

function rowToItem(row) {
  return {
    id: row.id,
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

export async function fetchItems(ownerId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToItem);
}

export async function insertItem(ownerId, item) {
  const { data, error } = await supabase
    .from('items')
    .insert({
      owner_id: ownerId,
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

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
    },
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

// メールアドレスで「復元」または「新規登録」を行う
// 既にそのメールアドレスが登録されていれば、そのowner_idを返す（＝復元）
// 登録されていなければ、今のowner_idとメールアドレスを紐付けて保存する（＝新規登録）
export async function loginOrRegisterWithEmail(email, currentOwnerId) {
  const normalized = email.trim().toLowerCase();

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('owner_id')
    .eq('notify_email', normalized)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    // すでに登録済みのメールアドレス → そのowner_idを返す（復元）
    return existing.owner_id;
  }

  // 未登録 → 今のowner_idと紐付けて新規登録
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

// この端末で「あなた」として扱うIDを覚えておくための仕組み。
// メールアドレスでの復元が行われた場合、ここが書き換わる。
const MY_ID_KEY = 'osusowake-my-id';

export function getMyId() {
  return localStorage.getItem(MY_ID_KEY);
}

export function setMyId(id) {
  localStorage.setItem(MY_ID_KEY, id);
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

export async function logout() {
  await supabase.auth.signOut();
  clearMyId();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user.id;
}

export function clearMyId() {
  localStorage.removeItem(MY_ID_KEY);
}