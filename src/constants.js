export const COLORS = {
  bg: '#FDFBF9',
  card: '#FFFFFF',
  ink: '#2E2A26',
  inkSoft: '#9C9389',
  border: '#EFE7DF',
  accent: '#E2795D',
  accentDeep: '#C25F45',
  accentSoft: '#FBE7E0',
  indigo: '#3A5169',
  indigoSoft: '#E7ECF1',
  moss: '#5B8A72',
  mossSoft: '#E6F1EA',
  line: '#06C755',
};

export const CONDITIONS = ['美品', '目立つ傷なし', '使用感あり'];

export const GLOBAL_STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
    .font-maru { font-family: 'M PLUS Rounded 1c', sans-serif; }
    .font-kaku { font-family: 'Zen Kaku Gothic New', sans-serif; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    html { overflow-y: scroll; scrollbar-gutter: stable; }
    @media (max-width: 767px) { input, textarea, select { font-size: 16px !important; } }
  `;
