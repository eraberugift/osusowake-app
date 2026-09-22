import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';
import GlobalStyle from '../components/GlobalStyle.jsx';

const CONTACT_FORM_URL = 'https://forms.gle/899KaPCoJJngBRaH8';

// 利用規約（PoC/MVP版：最低限の記載のみ）
export default function TermsScreen() {
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
        <h1 className="font-maru font-bold text-lg mb-1">利用規約</h1>
        <p className="text-xs mb-6" style={{ color: COLORS.inkSoft }}>制定日：2026年9月22日</p>

        <p className="mb-6">
          この利用規約（以下「本規約」）は、ゆずリス（以下「本サービス」）の
          利用条件を定めるものです。本サービスを利用した時点で、本規約に
          同意したものとみなします。なお本サービスは現在開発段階（PoC/MVP）であり、
          予告なく内容の変更・停止を行う場合があります。
        </p>

        <Section title="1. サービスの内容">
          本サービスは、不要になったものを友人・知人に無償で譲るためのリストを
          作成・共有できるサービスです。<b>金銭の授受を伴う売買を目的としたものではありません。</b>
        </Section>

        <Section title="2. 譲渡・受け渡しについて">
          <ul className="list-disc pl-5 space-y-1">
            <li>受け渡しの方法・日時などは、出品者と希望者の間で直接調整していただきます。</li>
            <li>
              運営者は受け渡しの場に立ち会わず、当事者間で生じたトラブル
              （破損、渡し忘れ、連絡が取れなくなった等）について一切の責任を負いません。
            </li>
          </ul>
        </Section>

        <Section title="3. 禁止事項">
          <ul className="list-disc pl-5 space-y-1">
            <li>虚偽の商品情報を掲載すること</li>
            <li>法令に違反する物品・危険物の掲載</li>
            <li>本サービスを利用した金銭のやり取りや転売目的の利用</li>
            <li>第三者への迷惑行為・なりすまし</li>
            <li>本サービスの運営を妨げる行為</li>
          </ul>
        </Section>

        <Section title="4. 免責事項">
          <ul className="list-disc pl-5 space-y-1">
            <li>運営者は本サービスの内容の正確性・安全性について保証しません。</li>
            <li>通信障害やサーバー障害等により生じた損害について、運営者は責任を負いません。</li>
            <li>運営者は、予告なく本サービスの内容を変更・停止・終了できるものとします。</li>
          </ul>
        </Section>

        <Section title="5. お問い合わせ">
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

        <Section title="6. 規約の変更">
          本規約は必要に応じて変更される場合があります。変更後は本ページにて公表します。
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
