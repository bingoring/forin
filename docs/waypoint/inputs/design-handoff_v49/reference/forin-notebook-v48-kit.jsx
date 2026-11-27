// forin-notebook-v48-kit.jsx — 개정 지시서 §2 공통 신호 키트 (홈 v47 풍)
// 지금 할 것 = 노란 ▶ 원 + 숨 쉬는 후광(Go) · 진행 중 = 노란 링(Ring) · 끝냈다 = 초록 이중선 + 체크 톡(Done)
// 아직 못 한다 = 점선 원 + 자물쇠, 흐림(Locked) · 새로 온 것 = 빨간 숫자 원, 처음 한 번 흔들림(NewDot)
// 누를 수 있다 = 잉크 테두리 + 하드 그림자, 눌리면 아래 2~3px·-1° (.v48-press) · 펼침 = ⌄ + 아래에서 톡(.v48-pop)
(function () {
  const NbIcon = window.NbIcon;
  const K = { ink: '#3E362B', paper: '#FFFdf4', yellow: '#F9E37B', green: '#5F8D5A', red: '#C75146', soft: '#9A8F7C' };
  if (!document.getElementById('v48-kit-css')) {
    const s = document.createElement('style');
    s.id = 'v48-kit-css';
    s.textContent = `
@keyframes v48-breathe{0%,100%{box-shadow:0 0 0 0 rgba(249,227,123,.0),2px 3px 0 rgba(62,54,43,.25)}50%{box-shadow:0 0 0 7px rgba(249,227,123,.55),2px 3px 0 rgba(62,54,43,.25)}}
.v48-go{animation:v48-breathe 2.4s ease-in-out infinite;transition:transform .12s}
.v48-go:active,.v48-press:active{transform:translate(2px,3px) rotate(-1deg)!important}
.v48-press{transition:transform .12s;cursor:pointer}
.v48-lift{transition:transform .14s;cursor:pointer}.v48-lift:active{transform:translateY(-3px) rotate(-2deg)!important}
@keyframes v48-pop{0%{transform:translateY(12px);opacity:0}100%{transform:none;opacity:1}}
.v48-pop{animation:v48-pop .32s cubic-bezier(.3,.7,.3,1) both}
@keyframes v48-stamp{0%{transform:scale(1.15) rotate(var(--r,-8deg))}100%{transform:scale(1) rotate(var(--r,-8deg))}}
.v48-done{animation:v48-stamp .35s ease-out both}
@keyframes v48-wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}}
.v48-wiggle{animation:v48-wiggle .7s ease-in-out .4s 1 both}
@keyframes v48-tap{0%,100%{transform:translateY(0)}50%{transform:translateY(5px) scale(.94)}}
.v48-tap{animation:v48-tap 1s ease-in-out infinite}
`;
    document.head.appendChild(s);
  }
  const Tri = ({ s }) => <svg viewBox="0 0 24 24" width={s} height={s}><path d="M8.5 5.5 L18.5 12 L8.5 18.5 Z" fill={K.ink} stroke={K.ink} strokeWidth="2" strokeLinejoin="round"/></svg>;
  // 지금 할 것 — 노란 ▶ 원 + 숨 쉬는 후광
  function Go({ size = 44, style }) {
    return <div className="v48-go" style={{ width: size, height: size, borderRadius: '50%', background: K.yellow, border: `2px solid ${K.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', ...style }}><Tri s={size * .5}/></div>;
  }
  // 홈 '이어서' 바 — 잉크 바 + 노란 ▶ (화면당 하나)
  function GoBar({ left, children, style }) {
    return (
      <div className="v48-press" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: K.ink, borderRadius: 6, transform: 'rotate(-0.5deg)', ...style }}>
        {left}<div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        <div className="v48-go" style={{ width: 46, height: 46, borderRadius: '50%', background: K.yellow, border: `2px solid ${K.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Tri s={23}/></div>
      </div>
    );
  }
  // 진행 중 — 노란 링
  function Ring({ pct, size = 46, children, stroke = K.yellow }) {
    const r = 21;
    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg viewBox="0 0 50 50" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
          <circle cx="25" cy="25" r={r} fill={K.paper} stroke="rgba(62,54,43,.14)" strokeWidth="4.5"/>
          <circle cx="25" cy="25" r={r} fill="none" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * r * pct} 999`} transform="rotate(-90 25 25)"/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      </div>
    );
  }
  // 끝냈다 — 초록 이중선 + 체크 (쾅)
  function Done({ size = 34, rot = -10, icon }) {
    return (
      <div className="v48-done" style={{ '--r': rot + 'deg', position: 'relative', width: size, height: size, borderRadius: '50%', border: `2.5px double ${K.green}`, background: 'rgba(95,141,90,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon ? <NbIcon name={icon} size={size * .55}/> : <NbIcon name="check" size={size * .55}/>}
        {icon && <span style={{ position: 'absolute', right: -4, bottom: -4 }}><NbIcon name="check" size={size * .42}/></span>}
      </div>
    );
  }
  // 아직 못 한다 — 점선 원 + 자물쇠
  function Locked({ size = 34, icon }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', border: '1.6px dashed rgba(62,54,43,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: .55, flexShrink: 0 }}>
        <NbIcon name={icon || 'lock'} size={size * .5}/>
        {icon && <span style={{ position: 'absolute', right: -3, bottom: -3 }}><NbIcon name="lock" size={size * .38}/></span>}
      </div>
    );
  }
  // 아이콘 원 (귀엽게 ±3~6°)
  function IconDot({ name, size = 40, bg = K.paper, rot = -4, border = K.ink, style }) {
    return <div style={{ width: size, height: size, borderRadius: '50%', border: `1.7px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${rot}deg)`, flexShrink: 0, ...style }}><NbIcon name={name} size={size * .58}/></div>;
  }
  // 새로 온 것 — 빨간 숫자 원 (처음 한 번 흔들림)
  function NewDot({ n, style }) {
    return <span className="v48-wiggle" style={{ position: 'absolute', right: -7, top: -6, minWidth: 18, height: 18, borderRadius: 99, background: K.red, color: '#fff', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: `2px solid ${K.paper}`, ...style }}>{n}</span>;
  }
  // 알약 (아이콘 + 숫자)
  function Pill({ icon, n, style }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 11px 4px 7px', background: K.paper, border: `1.6px solid ${K.ink}`, borderRadius: 99, ...style }}>
        <NbIcon name={icon} size={19}/><span style={{ fontFamily: '"Gaegu",cursive', fontSize: 19, color: K.ink, lineHeight: 1 }}>{n}</span>
      </div>
    );
  }
  const Chev = ({ open }) => <span style={{ fontFamily: '"Gaegu",cursive', fontSize: 18, color: K.soft, display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>⌄</span>;
  window.V48 = { Go, GoBar, Ring, Done, Locked, IconDot, NewDot, Pill, Chev };
})();
