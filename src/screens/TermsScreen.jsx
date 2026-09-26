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
        <p className="text-xs mb-6" style={{ color: COLORS.inkSoft }}>
          制定日：2026年9月22日<br />
          改定日：2026年9月26日
        </p>

        <p className="mb-6">
          この利用規約（以下「本規約」）は、ゆずリス（以下「本サービス」）の
          利用条件を定めるものです。本サービスを利用した時点で、本規約に
          同意したものとみなします。なお本サービスは現在開発段階（PoC/MVP）であり、
          予告なく内容の変更・停止を行う場合があります。
        </p>

        <Section title="1. サービスの内容">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              本サービスは、不要になったものを友人・知人に譲るためのリストを
              作成・共有できるサービスです。無償・有償のどちらの譲渡にもご利用いただけます。
            </li>
            <li>
              運営者は、譲り合いのための場を提供するのみであり、
              <b>出品者と希望者の間の譲渡・売買の当事者にはなりません。</b>
            </li>
          </ul>
        </Section>

        <Section title="2. 譲渡・受け渡し・代金について">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              受け渡しの方法・日時、代金の有無・金額・支払い方法などは、
              出品者と希望者の間で直接決めていただきます。
            </li>
            <li>
              <b>代金のやり取りは、当事者間で直接行ってください。</b>
              運営者は、代金の受け取り・預かり・支払いの代行を行いません。
            </li>
            <li>物品の状態や取引の内容は、当事者の責任で事前に確認してください。</li>
            <li>
              当事者間で生じたトラブル（破損、代金の未払い、渡し忘れ、連絡が取れなくなった等）は、
              当事者間で解決していただきます。運営者は原則として関与しません。
            </li>
          </ul>
        </Section>

        <Section title="3. 禁止事項">
          <ul className="list-disc pl-5 space-y-1">
            <li>虚偽の商品情報を掲載すること</li>
            <li>法令に違反する物品・危険物の掲載</li>
            <li>
              法令により個人による販売が制限・禁止されている物品を有償で譲ること
              （例：酒類、医薬品・医療機器、たばこ、チケットの不正転売、動物〈生体〉など）
            </li>
            <li>偽ブランド品・盗品など、他人の権利を侵害する物品の掲載</li>
            <li>仕入れた物品を継続的に販売するなど、事業として本サービスを利用すること</li>
            <li>相手をだます行為、代金の未払い、受け取った物品の持ち逃げなどの不誠実な行為</li>
            <li>第三者への迷惑行為・なりすまし</li>
            <li>本サービスの運営を妨げる行為</li>
          </ul>
          <p className="mt-2">
            運営者は、これらに当たると判断した掲載について、予告なく削除などの対応を行う場合があります。
          </p>
        </Section>

        <Section title="4. 免責事項">
          <ul className="list-disc pl-5 space-y-1">
            <li>運営者は本サービスの内容の正確性・安全性について保証しません。</li>
            <li>
              当事者間の譲渡・売買やトラブルにより生じた損害について、運営者は責任を負いません。
            </li>
            <li>通信障害やサーバー障害等により生じた損害について、運営者は責任を負いません。</li>
            <li>運営者は、予告なく本サービスの内容を変更・停止・終了できるものとします。</li>
            <li>
              ただし、運営者の故意または重大な過失により生じた損害については、この限りではありません。
            </li>
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
