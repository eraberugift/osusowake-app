# ファイル構成ガイド

今後の修正は「直したい画面のファイルだけ」を貼れば済みます。

## どこを直す？早見表

| やりたいこと | 開くファイル |
|---|---|
| 色・フォント・状態の選択肢を変える | `constants.js` |
| 「〜分前」の表示、画像圧縮、期限判定、URLの組み立て | `utils.js` |
| **データ取得・保存・更新のロジック全部** | `context/AppContext.jsx` |
| Supabaseのクエリそのもの | `storage.js` |
| どの画面を出すかの分岐 | `App.jsx` |
| トップページの見た目・コピー | `screens/HomeScreen.jsx` |
| リスト画面（ヘッダー・アイテム一覧） | `screens/ListScreen.jsx` |
| 「あなたが作ったリスト」全件ページ | `screens/AllListsScreen.jsx` |
| リストが無い時／起動中の画面 | `screens/NotFoundScreen.jsx` / `BootScreen.jsx` |
| 出品フォーム | `modals/ItemFormModal.jsx` |
| 商品詳細ページ | `modals/ItemDetailModal.jsx` |
| 共有シート（LINE・リンクコピー・タイトル編集・管理リンク） | `modals/ShareSheet.jsx` |
| 「これ欲しい！」の流れ | `modals/WantModal.jsx` |
| 出品の見本 | `modals/ExampleModal.jsx` |
| 削除確認 / ログアウト確認 / メールログイン / リスト作成 | `modals/` の各ファイル |
| アイテム1行の見た目 | `components/ItemRow.jsx` |
| リスト1行の見た目 | `components/ListLinkRow.jsx` |
| ステータスのバッジ | `components/StatusBadge.jsx` |
| メール入力欄・通知先ブロック | `components/EmailInputWithHistory.jsx` / `EmailBlock.jsx` |
| モーダルの共通の枠 | `components/ModalShell.jsx` |
| 管理者かどうかの判定・管理リンク | `context/AppContext.jsx` ＋ `storage.js` ＋ Supabase（下記参照） |

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

## 管理者の判定と管理リンク

### 管理者かどうかはサーバーで決める

- 管理者（出品者）かどうかは、Supabase の関数 `get_list_admin` の結果で決まります。
- `AppContext.jsx` のリスト読み込み時に、次のどちらかで照合します。
  - この端末の `myId` がリストの `creator_id` と一致する
  - 正しい管理キーを持っている（URLの `?key=` → 端末に覚えたキー の順で使う）
- 照合に成功すると `isListAdmin` が `true` になり、
  `isCreatorMode = !forcedGuest && !!list && isListAdmin` で管理画面が出ます。
- **`list.creatorId === myId` や localStorage のリストID一覧だけで管理者扱いにしないこと。**
  そうすると、マッチング相手の名前が取れないのに管理画面だけ出る状態になります。

### 管理リンク

- 形式：`?list=<リストID>&key=<admin_key>`（`listUrl(id, { key })` で作る）
- 友達用リンク：`?list=<リストID>&view=guest`（`listUrl(id, { guest: true })`）
- 管理キーは端末の localStorage（`osusowake-admin-keys`）にも保存されますが、
  本体は「ユーザーが保存したリンク」です。localStorage が消えてもリンクから復帰できます。
- 共有シートの「あなた専用の管理リンク」は、メール未登録のときだけ表示します。

## ⚠️ データベースの「ゲストに見せない列」のルール

ゲストのブラウザに届けたくない列は、Supabase の列単位の読み取り権限で隠しています。

| テーブル | ゲストから読めない列 | 作成者が受け取る方法 |
|---|---|---|
| `lists` | `admin_key` | `get_list_admin` 関数 |
| `items` | `claimer_name` | `get_list_admin` 関数 |

### 列を追加・変更するときは、次の2か所を必ずセットで直す

1. **Supabase の SQL**：`grant select (...)` に新しい列を追加する
   ```sql
   -- 例：items に new_column を足した場合
   grant select (new_column) on public.items to anon, authenticated;
   ```
2. **`storage.js`**：`LIST_COLUMNS` / `ITEM_COLUMNS` に新しい列を追加する

どちらかを忘れると、その列が読めなかったり、権限エラーでリストが表示されなくなります。

### ゲストに見せたくない列（名前・連絡先など）を足すとき

- 上の 1 にも 2 にも**入れない**
- `get_list_admin` 関数の返り値に追加し、`AppContext.jsx` で作成者のときだけ items / list に合流させる

### `select` の書き方

- `select('*')` や引数なしの `.select()` は**使わない**（権限エラーになります）
- 必ず `LIST_COLUMNS` / `ITEM_COLUMNS` か、必要な列名を明示する

### 不具合が出たときの戻し方

```sql
grant select on public.lists, public.items to anon, authenticated;
```

これで列の制限が外れ、全列が読める状態に戻ります（ゲストにも名前やキーが見えるので、一時的な対処としてだけ使う）。

## 🤖 AI（Claude など）に修正を頼むとき

このファイルを一緒に渡した場合、AI は次のルールを守って修正すること。

1. **列の追加・変更を伴う修正では**、`storage.js` の列定数と Supabase の `grant select` の SQL を**必ずセットで**提示する。片方だけの修正案は出さない。
2. **`select('*')` や引数なしの `.select()` を書かない。** 列を明示する。
3. **ゲストに見せたくない情報**（個人名・連絡先・キーなど）は、列の読み取り権限で隠し、`get_list_admin` のような照合付きの関数から作成者にだけ返す設計にする。画面上で隠すだけの対応はしない。
4. **管理者の判定（`isCreatorMode`）を変更しない。** `creator_id` との単純比較や localStorage だけで管理者扱いにする変更は提案しない。変更が必要な場合は、理由と影響を先に説明する。
5. **Supabase の SQL を伴う修正では**、実行する順番（コードのデプロイ前か後か）と、元に戻す SQL もあわせて示す。
6. 新しい state や処理は、上の「仕組み」の手順どおり `AppContext.jsx` に集約する。

## 元の App.jsx からの変更点（挙動は同じ）

- 共通化した重複コード：リスト行（2か所）、ログアウト確認ダイアログ（2か所）、
  モーダルの外枠（背景＋×ボタン、計8か所）、出品見本のデータ（配列化）
- `window.location.origin + window.location.pathname` を `topUrl()` / `listUrl(id)` に統一
- ロジックの中身、クラス名、文言は一切変えていません
