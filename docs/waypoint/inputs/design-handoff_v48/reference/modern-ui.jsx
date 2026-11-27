// modern-ui.jsx — 모던 리디자인 공유 토큰 + 공용 컴포넌트.
// 모든 forin Modern - *.html 페이지가 app-modern-*.jsx 앞에 로드한다.

const ModernTokens = {
  primary: '#16B364', primaryDeep: '#0E9251', primarySoft: '#E7F8EE',
  ink: '#1B2733', text: '#48555F', faint: '#8B98A3',
  bg: '#F6F8FA', card: '#FFFFFF', line: '#EDF1F4',
  yellow: '#FFC800', yellowSoft: '#FFF6DA',
  orange: '#FF9600', orangeSoft: '#FFEFD9',
  blue: '#1CB0F6', blueSoft: '#E3F5FE',
  pink: '#F472B6', pinkSoft: '#FDEBF4',
  purple: '#8B5CF6', purpleSoft: '#F0EAFE',
  red: '#FF4B4B', redSoft: '#FFE9E9',
};
const ModernFont = "'Pretendard Variable', Pretendard, -apple-system, sans-serif";
const mcard = (extra = {}) => ({ background: ModernTokens.card, borderRadius: 20, boxShadow: '0 1px 2px rgba(27,39,51,.05), 0 4px 14px rgba(27,39,51,.05)', ...extra });

function MAvatar({ size = 52, bg = ModernTokens.primarySoft, emoji = '🧑‍⚕️', icon }) {
  return <div style={{ width: size, height: size, flexShrink: 0, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * .52, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(27,39,51,.10)' }}>{icon ? <window.MIcon name={icon} size={size * .68}/> : emoji}</div>;
}

function MNav({ active = 'home' }) {
  const M = ModernTokens, F = ModernFont;
  const tabs = [['home', 'home', '홈'], ['campus', 'hospital', '캠퍼스'], ['lab', 'book', '리뷰랩'], ['mates', 'mates', '동료'], ['me', 'person', '나']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, background: '#fff', borderTop: `1px solid ${M.line}`, display: 'flex', padding: '10px 8px 26px', zIndex: 20 }}>
      {tabs.map(([id, ic, label]) => {
        const on = id === active;
        return (
          <div key={id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 46, height: 32, borderRadius: 14, background: on ? M.primarySoft : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: on ? 'none' : 'grayscale(1) opacity(.55)' }}><window.MIcon name={ic} size={22}/></div>
            <div style={{ fontFamily: F, fontSize: 10, fontWeight: on ? 700 : 500, color: on ? M.primaryDeep : M.faint }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function MPhone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

Object.assign(window, { ModernTokens, ModernFont, mcard, MAvatar, MNav, MPhone });
