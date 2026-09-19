# ファイル構成ガイド

今後の修正は「直したい画面のファイルだけ」を貼れば済みます。

## どこを直す？早見表

| やりたいこと | 開くファイル |
|---|---|
| 色・フォント・状態の選択肢を変える | `constants.js` |
| 「〜分前」の表示、画像圧縮、期限判定 | `utils.js` |
| **データ取得・保存・更新のロジック全部** | `context/AppContext.jsx` |
| Supabaseのクエリそのもの | `storage.js` |
| どの画面を出すかの分岐 | `App.jsx` |
| トップページの見た目・コピー | `screens/HomeScreen.jsx` |
| リスト画面（ヘッダー・アイテム一覧） | `screens/ListScreen.jsx` |
| 「あなたが作ったリスト」全件ページ | `screens/AllListsScreen.jsx` |
| リストが無い時／起動中の画面 | `screens/NotFoundScreen.jsx` / `BootScreen.jsx` |
| 出品フォーム | `modals/ItemFormModal.jsx` |
| 商品詳細ページ | `modals/ItemDetailModal.jsx` |
| 共有シート（LINE・リンクコピー・タイトル編集） | `modals/ShareSheet.jsx` |
| 「これ欲しい！」の流れ | `modals/WantModal.jsx` |
| 出品の見本 | `modals/ExampleModal.jsx` |
| 削除確認 / ログアウト確認 / メールログイン / リスト作成 | `modals/` の各ファイル |
| アイテム1行の見た目 | `components/ItemRow.jsx` |
| リスト1行の見た目 | `components/ListLinkRow.jsx` |
| ステータスのバッジ | `components/StatusBadge.jsx` |
| メール入力欄・通知先ブロック | `components/EmailInputWithHistory.jsx` / `EmailBlock.jsx` |
| モーダルの共通の枠 | `components/ModalShell.jsx` |

## 仕組み

state とハンドラはすべて `AppContext.jsx` に集約されています。
画面やモーダルは `useApp()` で必要なものだけ取り出して使うので、
props のバケツリレーはありません。

```jsx
import { useApp } from '../context/AppContext.jsx';

export default function Something() {
  const { items, setViewItem } = useApp();
  ...
}
```

新しい state や処理を足すときは：
1. `AppContext.jsx` の中に `useState` / 関数を書く
2. 一番下の `const value = { ... }` に名前を追加する
3. 使いたい画面で `useApp()` から取り出す

## 元の App.jsx からの変更点（挙動は同じ）

- 共通化した重複コード：リスト行（2か所）、ログアウト確認ダイアログ（2か所）、
  モーダルの外枠（背景＋×ボタン、計8か所）、出品見本のデータ（配列化）
- `window.location.origin + window.location.pathname` を `topUrl()` / `listUrl(id)` に統一
- ロジックの中身、クラス名、文言は一切変えていません
