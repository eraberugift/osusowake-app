import React from 'react';
import { COLORS } from '../constants.js';
import { topUrl } from '../utils.js';

const CONTACT_FORM_URL = 'https://forms.gle/899KaPCoJJngBRaH8';

// トップ・リスト画面の下部に置く、お問い合わせ／規約系リンクのまとまり
export default function LegalLinks() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap text-[11px] pt-2" style={{ color: COLORS.inkSoft }}>
      <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer" className="underline">
        お問い合わせ
      </a>
      <a href={`${topUrl()}?page=privacy`} className="underline">
        プライバシーポリシー
      </a>
      <a href={`${topUrl()}?page=terms`} className="underline">
        利用規約
      </a>
    </div>
  );
}
