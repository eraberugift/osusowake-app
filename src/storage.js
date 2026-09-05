import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const storage = {
  async get(key) {
    const { data, error } = await supabase
      .from('app_data')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      throw new Error(`key not found: ${key}`);
    }
    return { key, value: JSON.stringify(data.value) };
  },

  async set(key, value) {
    const { error } = await supabase
      .from('app_data')
      .upsert({ key, value: JSON.parse(value), updated_at: new Date().toISOString() });

    if (error) {
      throw error;
    }
    return { key, value };
  },

  async delete(key) {
    const { error } = await supabase.from('app_data').delete().eq('key', key);
    if (error) {
      throw error;
    }
    return { key, deleted: true };
  },
};

export async function uploadItemImage(dataUrl) {
  // canvasで作った圧縮済みのdataURL画像を、実際のファイルに変換してアップロードする
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