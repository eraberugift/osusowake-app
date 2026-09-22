import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import GlobalStyle from '../components/GlobalStyle.jsx';

const CONTACT_FORM_URL = 'https://forms.gle/899KaPCoJJngBRaH8';

// プライバシーポリシー（PoC/MVP版：最低限の記載のみ）
export default function PrivacyPolicyScreen() {
  return (
    <div className="min-h-screen w-full font-kaku" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <GlobalStyle />

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ backgroundColor: 'rgba(253,251,249,0.94)', borderColor: COLORS.border }}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <a href={topUrl()} className="flex items-center gap-1 text-xs font-bold underline" style={{ color: COLORS.indigo }}>
            <ChevronLeft size={14} />
            トップに戻る
          </a>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 text-sm leading-relaxed">
        <h1 className="font-maru font-bold text-lg mb-1">プライバシーポリシー</h1>
        <p className="text-xs mb-6" style={{ color: COLORS.inkSoft }}>制定日：2026年9月22日</p>

        <p className="mb-6">
          ゆずリス（以下「本サービス」）は、個人開発者（以下「運営者」）が
          試験的に運営するサービスです。本ページでは、本サービスが取得する
          情報とその取り扱いについて説明します。
        </p>

        <Section title="1. 取得する情報">
          <ul className="list-disc pl-5 space-y-1">
            <li>メールアドレス（通知登録・リスト復元を希望される場合のみ、任意）</li>
            <li>リストのタイトル・期限</li>
            <li>出品するアイテムの名称・状態・説明文・写真</li>
            <li>端末に保存される識別用ID（ログイン状態の維持のため）</li>
          </ul>
        </Section>

        <Section title="2. 利用目的">
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの提供・アイテムの表示</li>
            <li>マッチング成立時などの通知メール送信</li>
            <li>機種変更やCookie削除後もリストを復元できるようにするため</li>
            <li>不具合対応・サービス改善</li>
          </ul>
        </Section>

        <Section title="3. 第三者提供・委託先">
          <p className="mb-2">法令に基づく場合を除き、取得した情報を第三者に販売・提供することはありません。</p>
          <p>
            本サービスはデータの保存・処理のために <b>Supabase</b> を利用しています。
            リンク共有の際に LINE の共有ボタンを使用していますが、この操作によって
            運営者が保有する情報が LINE 社に送信されることはありません。
          </p>
        </Section>

        <Section title="4. Cookie・端末内保存について">
          ログイン状態の維持やメールアドレスの入力補完のため、お使いの端末のブラウザ内
          （localStorage）にデータを保存します。これらは運営者のサーバーには送信されません。
        </Section>

        <Section title="5. 情報の削除について">
          登録情報の削除をご希望の場合は、下記のお問い合わせフォームよりご連絡ください。
        </Section>

        <Section title="6. お問い合わせ">
          <a
            href={CONTACT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold"
            style={{ color: COLORS.accentDeep }}
          >
            お問い合わせフォーム
          </a>
        </Section>

        <Section title="7. 改定について">
          本サービスは開発中（PoC/MVP）のため、本ポリシーは予告なく変更される場合があります。
          変更後は本ページにて公表します。
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="font-bold text-sm mb-2">{title}</h2>
      <div style={{ color: COLORS.ink }}>{children}</div>
    </section>
  );
}
