# おすそわけリンク（仮）

## ローカルで動かす

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開けば動作確認できます。

今の状態は「自分のブラウザのlocalStorageに保存」なので、他の人とはまだデータが共有されません（`src/storage.js` を参照）。これは次のステップでSupabaseに差し替えます。

## GitHubに置く

```bash
git init
git add .
git commit -m "first commit"
gh repo create osusowake-link --public --source=. --push
```

（`gh` コマンドがなければ、GitHub上で先にリポジトリを作成し、表示される `git remote add origin ...` 以降のコマンドを実行してください）

## Vercelにデプロイ

1. https://vercel.com にアクセスし、GitHubアカウントでログイン
2. 「Add New Project」→ 今作ったリポジトリを選択
3. Framework Presetは自動で「Vite」と認識されるはずです。そのまま「Deploy」
4. 数十秒〜数分で `xxxx.vercel.app` のURLが発行されます

## 次のステップ（このあと相談しながら進める部分）

- [ ] Supabaseでデータベースを作り、`src/storage.js` を差し替えて複数人で共有できるようにする
- [ ] 画像を実際にアップロード・保存できるようにする（現状はbase64で保存しているので、件数が増えると重くなります）
- [ ] `index.html` のOGP画像（`/ogp-image.png`）を実際の画像に差し替える
- [ ] 簡易的なアクセス制限（合言葉ゲートなど）を入れる
