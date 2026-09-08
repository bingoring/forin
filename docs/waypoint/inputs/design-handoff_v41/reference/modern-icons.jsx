// modern-icons.jsx — forin 자체 아이콘 시스템 (플랫 · 통통한 라운드 · 카와이 점눈).
// 참조 그림풍: 외곽선 없는 플랫 실루엣 + 2톤 셰이딩 + 점눈/글린트.
// 이모지를 쓰던 모든 자리는 <MIcon name="..."/>로 대체한다. viewBox 48.

(function () {
  const INK = '#4E4668';
  const Eyes = ({ x1 = 19, x2 = 29, y = 22, r = 2.4 }) => (
    <g>
      <circle cx={x1} cy={y} r={r} fill={INK}/><circle cx={x2} cy={y} r={r} fill={INK}/>
      <circle cx={x1 + .9} cy={y - .9} r={.8} fill="#fff"/><circle cx={x2 + .9} cy={y - .9} r={.8} fill="#fff"/>
    </g>
  );

  const ICONS = {
    // ── 내비게이션 ──
    home: (<g><path d="M24 6 L45 24 Q46 26 43 26 H5 Q2 26 3 24 Z" fill="#16B364"/><rect x="8" y="24" width="32" height="18" rx="5" fill="#F5EFE6"/><rect x="19" y="29" width="10" height="13" rx="4" fill="#F7941D"/><circle cx="27" cy="36" r="1.2" fill="#C97B16"/></g>),
    hospital: (<g><rect x="9" y="10" width="30" height="32" rx="6" fill="#DDEBF5"/><rect x="9" y="10" width="30" height="7" rx="3.5" fill="#1CB0F6"/><rect x="21" y="21" width="6" height="16" rx="2" fill="#D64550"/><rect x="16" y="26" width="16" height="6" rx="2" fill="#D64550"/></g>),
    book: (<g><rect x="9" y="8" width="30" height="32" rx="5" fill="#8D7BC4"/><rect x="9" y="8" width="7" height="32" rx="3.5" fill="#6C5CA8"/><rect x="34" y="10" width="3" height="28" rx="1.5" fill="#F5EFE6"/><path d="M26 18 l1.8 3.7 4 .6 -2.9 2.8 .7 4 -3.6-1.9 -3.6 1.9 .7-4 -2.9-2.8 4-.6 Z" fill="#FFD54D"/></g>),
    mates: (<g><circle cx="30" cy="24" r="11" fill="#1CB0F6"/><circle cx="35" cy="22" r="1.8" fill={INK}/><path d="M31 27 q3 2.4 6 0" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round"/><circle cx="18" cy="26" r="12" fill="#FDBA3B"/><Eyes x1={14} x2={22} y={24} r={2.2}/><path d="M15 30 q3 2.6 6 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round"/></g>),
    person: (<g><circle cx="24" cy="17" r="10" fill="#FDBA3B"/><Eyes x1={20} x2={28} y={16} r={2}/><path d="M20 21 q4 3 8 0" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M10 44 Q10 30 24 30 Q38 30 38 44 Z" fill="#1CB0F6"/></g>),
    // ── 캐릭터/아바타 ──
    nurse: (<g><circle cx="24" cy="27" r="14" fill="#FFDCB8"/><path d="M10 26 Q10 12 24 12 Q38 12 38 26 L38 22 Q38 18 34 17 Q28 15 24 15 Q20 15 14 17 Q10 18 10 22 Z" fill="#5B4636"/><rect x="14" y="6" width="20" height="9" rx="4" fill="#fff"/><rect x="22" y="7.5" width="4" height="6" rx="1" fill="#D64550"/><rect x="20.5" y="9" width="7" height="3" rx="1" fill="#D64550"/><Eyes x1={19} x2={29} y={27}/><path d="M20 32 q4 3 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="14.5" cy="30" r="2.4" fill="#F9AFA0" opacity=".7"/><circle cx="33.5" cy="30" r="2.4" fill="#F9AFA0" opacity=".7"/></g>),
    mentor: (<g><circle cx="24" cy="27" r="14" fill="#F3C9A5"/><path d="M10 27 Q9 12 24 12 Q39 12 38 27 L36 20 Q30 16 24 16 Q18 16 12 20 Z" fill="#3E3547"/><rect x="14" y="6" width="20" height="9" rx="4" fill="#1CB0F6"/><Eyes x1={19} x2={29} y={27}/><path d="M20 32 q4 3 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round"/></g>),
    // ── 감정 얼굴 (대화 무대) ──
    emo_angry: (<g><circle cx="24" cy="24" r="17" fill="#F55D5D"/><path d="M14 16 l7 3.4 M34 16 l-7 3.4" stroke="#7A1E1E" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="24" r="2.5" fill="#5A1414"/><circle cx="30" cy="24" r="2.5" fill="#5A1414"/><path d="M18 33 q6 -4 12 0" stroke="#7A1E1E" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M38 10 l3-3 M40 15 l4-1" stroke="#F7941D" strokeWidth="2" strokeLinecap="round"/></g>),
    emo_anxious: (<g><circle cx="24" cy="24" r="17" fill="#FDBA3B"/><path d="M14 17 q3-2.4 6-1 M34 17 q-3-2.4 -6-1" stroke="#8A5A00" strokeWidth="2.2" strokeLinecap="round" fill="none"/><circle cx="18" cy="24" r="2.5" fill={INK}/><circle cx="30" cy="24" r="2.5" fill={INK}/><path d="M18 32 q3 -2 6 0 q3 2 6 0" stroke="#8A5A00" strokeWidth="2.2" fill="none" strokeLinecap="round"/><path d="M39 20 q3 4 0 6 q-3 -2 0 -6" fill="#7EC8F5"/></g>),
    emo_relieved: (<g><circle cx="24" cy="24" r="17" fill="#5ECF8B"/><path d="M14 23 q4 -4 8 0 M26 23 q4 -4 8 0" stroke="#136B3B" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M18 30 q6 5 12 0" stroke="#136B3B" strokeWidth="2.4" fill="none" strokeLinecap="round"/><circle cx="13" cy="28" r="2.6" fill="#F9AFA0" opacity=".75"/><circle cx="35" cy="28" r="2.6" fill="#F9AFA0" opacity=".75"/></g>),
    emo_pain: (<g><circle cx="24" cy="24" r="17" fill="#F49BC1"/><path d="M15 21 l5 5 M20 21 l-5 5 M28 21 l5 5 M33 21 l-5 5" stroke="#8E2F5C" strokeWidth="2.2" strokeLinecap="round"/><path d="M18 33 q3 -2 6 0 q3 2 6 0" stroke="#8E2F5C" strokeWidth="2.2" fill="none" strokeLinecap="round"/></g>),
    // ── 기능 아이콘 ──
    mic: (<g><rect x="17" y="6" width="14" height="24" rx="7" fill="#D64550"/><rect x="17" y="6" width="14" height="12" rx="6" fill="#F55D5D"/><path d="M11 24 q0 13 13 13 q13 0 13 -13" stroke="#6C5CA8" strokeWidth="3.4" fill="none" strokeLinecap="round"/><rect x="22" y="37" width="4" height="5" rx="2" fill="#6C5CA8"/><rect x="16" y="42" width="16" height="3.5" rx="1.75" fill="#6C5CA8"/></g>),
    bulb: (<g><path d="M14 8 l-3-3 M34 8 l3-3 M9 18 h-4 M43 18 h-4" stroke="#F7941D" strokeWidth="2.4" strokeLinecap="round"/><circle cx="24" cy="19" r="12" fill="#FFD54D"/><Eyes x1={20} x2={28} y={18} r={1.9}/><path d="M21 23 q3 2.2 6 0" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round"/><rect x="19" y="31" width="10" height="5" rx="2" fill="#C9CDD6"/><rect x="20.5" y="37" width="7" height="4" rx="2" fill="#AEB4BE"/></g>),
    keyboard: (<g><rect x="6" y="14" width="36" height="20" rx="5" fill="#6C5CA8"/><g fill="#F5EFE6">{[10,16,22,28,34].map((x,i)=><rect key={i} x={x} y="18" width="4" height="4" rx="1.2"/>)}{[10,16,22,28,34].map((x,i)=><rect key={'b'+i} x={x} y="24" width={x===22?10:4} height="4" rx="1.2"/>)}</g></g>),
    flame: (<g><path d="M24 4 Q30 12 34 18 Q38 25 34 33 Q30 41 24 41 Q18 41 14 33 Q10 25 14 18 Q18 12 24 4 Z" fill="#F7941D"/><path d="M24 18 Q28 24 29 29 Q30 35 24 36 Q18 35 19 29 Q20 24 24 18 Z" fill="#FFD54D"/><circle cx="21.5" cy="29" r="1.7" fill={INK}/><circle cx="26.5" cy="29" r="1.7" fill={INK}/><path d="M21.5 32.5 q2.5 2 5 0" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round"/></g>),
    chat: (<g><path d="M6 20 Q6 8 24 8 Q42 8 42 20 Q42 32 24 32 H16 L9 38 L11 30 Q6 27 6 20 Z" fill="#16B364"/><circle cx="16" cy="20" r="2.4" fill="#fff"/><circle cx="24" cy="20" r="2.4" fill="#fff"/><circle cx="32" cy="20" r="2.4" fill="#fff"/></g>),
    map: (<g><path d="M8 12 L20 8 L28 12 L40 8 V36 L28 40 L20 36 L8 40 Z" fill="#A9E8C6"/><path d="M20 8 L28 12 V40 L20 36 Z" fill="#7ED9A7"/><circle cx="24" cy="22" r="6" fill="#D64550"/><circle cx="24" cy="22" r="2.4" fill="#fff"/></g>),
    clipboard: (<g><rect x="10" y="8" width="28" height="34" rx="5" fill="#FDBA3B"/><rect x="14" y="14" width="20" height="24" rx="3" fill="#fff"/><rect x="18" y="4" width="12" height="7" rx="3" fill="#8D7BC4"/><path d="M17 21 l2.5 2.5 4-4.5" stroke="#16B364" strokeWidth="2.2" fill="none" strokeLinecap="round"/><rect x="26" y="20" width="7" height="2.4" rx="1.2" fill="#C9CDD6"/><rect x="17" y="28" width="16" height="2.4" rx="1.2" fill="#C9CDD6"/><rect x="17" y="33" width="11" height="2.4" rx="1.2" fill="#C9CDD6"/></g>),
    medal: (<g><path d="M16 4 h6 l3 10 -6 2 Z" fill="#D64550"/><path d="M32 4 h-6 l-3 10 6 2 Z" fill="#8D7BC4"/><circle cx="24" cy="29" r="13" fill="#FFD54D"/><circle cx="24" cy="29" r="9" fill="#F7941D"/><path d="M24 23 l1.9 3.8 4.2 .6 -3 3 .7 4.2 -3.8-2 -3.8 2 .7-4.2 -3-3 4.2-.6 Z" fill="#fff"/></g>),
    moon: (<g><path d="M30 4 Q18 8 18 20 Q18 32 30 34 Q22 38 15 33 Q7 27 9 17 Q11 8 21 5 Q26 3 30 4 Z" fill="#FFD54D"/><path d="M34 12 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4-3.4 -3.4-1.4 3.4-1.4 Z" fill="#F7941D"/><path d="M24 34 q2-5 8-5 q6 0 7 5 q4 0 4 4 q0 4 -5 4 h-14 q-5 0 -5-4 q0-4 5-4 Z" fill="#6E6A85"/></g>),
    sun: (<g>{[0,45,90,135,180,225,270,315].map((a,i)=><rect key={i} x="22.5" y="3" width="3" height="7" rx="1.5" fill="#F7941D" transform={`rotate(${a} 24 24)`}/>)}<circle cx="24" cy="24" r="11" fill="#FDBA3B"/><Eyes x1={20} x2={28} y={23} r={1.9}/><path d="M21 28 q3 2.4 6 0" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round"/></g>),
    speaker: (<g><path d="M8 19 h7 l9-8 v26 l-9-8 H8 Z" fill="#6C5CA8"/><path d="M30 17 q4 7 0 14 M35 13 q7 11 0 22" stroke="#F7941D" strokeWidth="3" fill="none" strokeLinecap="round"/></g>),
    target: (<g><circle cx="24" cy="24" r="16" fill="#D64550"/><circle cx="24" cy="24" r="10.5" fill="#fff"/><circle cx="24" cy="24" r="5" fill="#D64550"/></g>),
    star: (<g><path d="M24 4 l5.6 11.4 12.6 1.8 -9.1 8.9 2.1 12.5 -11.2-5.9 -11.2 5.9 2.1-12.5 -9.1-8.9 12.6-1.8 Z" fill="#FFD54D"/><circle cx="20" cy="22" r="1.9" fill={INK}/><circle cx="28" cy="22" r="1.9" fill={INK}/><path d="M21 26 q3 2.4 6 0" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round"/></g>),
    party: (<g><path d="M8 40 L18 16 Q20 14 22 16 L32 26 Q34 28 32 30 L8 40 Z" fill="#8D7BC4"/><path d="M12 36 L15 27 L21 33 Z" fill="#F7941D"/><circle cx="30" cy="10" r="2.4" fill="#D64550"/><circle cx="40" cy="16" r="2.4" fill="#16B364"/><circle cx="38" cy="30" r="2.4" fill="#FFD54D"/><path d="M33 18 q4 -6 8 -8" stroke="#FDBA3B" strokeWidth="2" fill="none" strokeLinecap="round"/></g>),
    check: (<g><circle cx="24" cy="24" r="17" fill="#16B364"/><path d="M15 24 l6 6 12-12" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>),
    clock: (<g><circle cx="24" cy="24" r="16" fill="#F5EFE6"/><circle cx="24" cy="24" r="16" fill="none" stroke="#6C5CA8" strokeWidth="4"/><path d="M24 15 v9 l6 4" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round"/></g>),
  };

  function MIcon({ name, size = 20, style }) {
    return <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: 'block', flexShrink: 0, ...style }}>{ICONS[name] || ICONS.star}</svg>;
  }

  Object.assign(window, { MIcon, MICONS: ICONS });
})();
