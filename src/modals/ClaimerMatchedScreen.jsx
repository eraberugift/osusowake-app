import React from 'react';
import { ChevronLeft, ChevronRight, Package, PartyPopper, MessageCircle, Truck, Gift, Coffee, BookOpen } from 'lucide-react';
import { COLORS } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { FullScreen } from '../components/ModalShell.jsx';

const STEPS = [
  { icon: MessageCircle, text: '該当者は出品者から連絡が届く' },
  { icon: Truck, text: '受け渡し方法を調整する' },
  { icon: Gift, text: '受け取って完了' },
];

const THANKS_LINKS = [
  {
    href: 'https://mall.line.me/sb/Starbucks/3669558',
    icon: Coffee,
    title: 'スタバのドリンクチケット',
    color: COLORS.accentDeep,
    bg: COLORS.accentSoft,
  },
  {
    href: 'https://eraberu-gift.com/erabugift.html',
    icon: BookOpen,
    title: '絶対に外さない勝負ギフト集',
    sub: 'アンケートで分かったみんなの勝負ギフト',
    color: COLORS.indigo,
    bg: COLORS.indigoSoft,
  },
];

// ギフトの1行（押せる行）
function ThanksLinkRow({ href, icon: Icon, title, sub, color, bg }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 border-t active:bg-stone-50 transition-colors"
      style={{ borderColor: COLORS.border }}
    >
      <span
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: bg, color }}
      >
        <Icon size={18} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold" style={{ color: COLORS.ink }}>{title}</span>
        <span className="block text-[11px] mt-0.5" style={{ color: COLORS.inkSoft }}>{sub}</span>
      </span>
      <ChevronRight size={18} className="flex-shrink-0" style={{ color: COLORS.inkSoft }} />
    </a>
  );
}

// マッチング完了画面（「これ欲しい！」の後／「連絡方法を見る」から表示）
export default function ClaimerMatchedScreen() {
  const { modalItem, setModalItem, setViewItem } = useApp();
  const close = () => setModalItem(null);
  const backToList = () => { setModalItem(null); setViewItem(null); };

  return (
    <FullScreen>
      <div className="sticky top-0 flex items-center gap-3 px-4 py-3 border-b z-10" style={{ backgroundColor: 'rgba(250,248,243,0.95)', borderColor: COLORS.border }}>
        <button onClick={backToList}><ChevronLeft size={22} /></button>
        <h2 className="font-maru font-bold text-base">マッチング完了</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-8 pb-6 text-center">
          <div
            style={{ width: 96, height: 96, backgroundColor: '#F0ECE2' }}
            className="mx-auto rounded-xl overflow-hidden mb-3"
          >
            {modalItem.image ? (
              <img src={modalItem.image} alt={modalItem.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: COLORS.inkSoft }}>
                <Package size={30} />
              </div>
            )}
          </div>
          <p className="text-sm font-bold mb-4" style={{ color: COLORS.inkSoft }}>{modalItem.name}</p>

          <PartyPopper size={64} style={{ color: COLORS.moss }} className="mx-auto mb-4" />

          <h3 className="font-maru font-bold text-2xl leading-snug mb-2" style={{ color: COLORS.ink }}>
            このアイテムは<br />マッチングしました！
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
            該当者は出品者からの連絡をお待ちください。
          </p>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FCFBF8', border: `1px solid ${COLORS.border}` }}>
            <p className="text-xs font-bold mb-3" style={{ color: COLORS.inkSoft }}>この後の流れ</p>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.text} className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: COLORS.indigoSoft, color: COLORS.indigo }}
                    >
                      {i + 1}
                    </div>
                    <Icon size={16} style={{ color: COLORS.inkSoft }} className="flex-shrink-0" />
                    <span className="text-sm" style={{ color: COLORS.ink }}>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* お礼のギフト */}
        <div className="px-4 pb-8">
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <div className="px-4 pt-4 pb-3">
              <p className="font-maru font-bold text-[15px] leading-snug" style={{ color: COLORS.ink }}>
                譲ってくれた人に、ちょっとしたお礼を
              </p>
            </div>

            {THANKS_LINKS.map((link) => (
              <ThanksLinkRow key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        <button
          onClick={backToList}
          className="w-full py-3.5 rounded-full font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.moss, color: '#fff' }}
        >
          リストに戻る
        </button>
      </div>
    </FullScreen>
  );
}
