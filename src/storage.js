// 一時的なstorageラッパーです。
// 今はブラウザのlocalStorageに保存しているだけなので、
// 「自分のブラウザではリロードしても消えない」が「他の人とは共有されない」状態です。
// 次のステップでSupabase接続に差し替えると、複数人で本当に共有できるようになります。

export const storage = {
  async get(key) {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      throw new Error(`key not found: ${key}`);
    }
    return { key, value: raw };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
};
