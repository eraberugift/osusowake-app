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