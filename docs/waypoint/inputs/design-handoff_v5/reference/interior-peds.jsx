// interior-peds.jsx — Pediatrics, expanded to 30×38. Warm + playful.

function ScreenInteriorPeds() {
  const COLS = 30, ROWS = 38;

  const regions = [
    { id: 'welcome', name: '환영·대기실', icon: '🌈', bounds: { x: 0,  y: 0,  w: 30, h: 12 } },
    { id: 'ward',    name: '소아 병동',   icon: '🛏', bounds: { x: 0,  y: 11, w: 16, h: 15 } },
    { id: 'play',    name: '놀이방',       icon: '🎠', bounds: { x: 15, y: 11, w: 15, h: 15 } },
    { id: 'exam',    name: '진료실',       icon: '🩺', bounds: { x: 0,  y: 25, w: 10, h: 13 } },
    { id: 'vax',     name: '예방접종실',   icon: '💉', bounds: { x: 9,  y: 25, w: 12, h: 13 } },
    { id: 'pickup',  name: '약 픽업창',   icon: '💊', bounds: { x: 20, y: 25, w: 10, h: 13 } },
  ];

  const rooms = [
    { id: 'welcome', name: '환영 데스크', sub: '접수',     icon: '🌈', color: '#FBCFE8', x: 15, y: 5 },
    { id: 'wait',    name: '대기실',      sub: '풍선·벽화', icon: '🎈', color: '#FEF08A', x: 5, y: 8, questCount: 1 },
    { id: 'ward',    name: '소아 병동',   sub: '크립 4개', icon: '🛏', color: '#FBCFE8', x: 6, y: 17, questCount: 1 },
    { id: 'play',    name: '놀이방',       sub: '슬라이드·블록', icon: '🎠', color: '#FED7AA', x: 22, y: 18, questCount: 1 },
    { id: 'exam',    name: '진료실',       sub: '문진·체크', icon: '🩺', color: '#BAE6FD', x: 4, y: 30, questCount: 1 },
    { id: 'vax',     name: '예방접종실',   sub: '백신 냉장고', icon: '💉', color: '#A7F3D0', x: 14, y: 30, questCount: 1 },
    { id: 'pickup',  name: '약 픽업창',   sub: '소아 처방', icon: '💊', color: '#DDD6FE', x: 25, y: 31 },
  ];

  return (
    <InteriorScreen
      label="06c Interior · PEDS" deptCode="소아과 · 4F" deptColor="#3B82F6"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 15, y: 17 }}
      rooms={rooms}
      regions={regions}
      missionText="놀이방에서 우는 아이 달래기 — Mia (4세)"
      render={() => (
        <>
          {/* OUTER WALLS */}
          <IWall x={0}  y={0} w={13} h={1}/>
          <IDoor x={13} y={0} w={2}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={15} y={0} w={15} h={1}/>
          <IWall x={0}  y={1}  w={1}  h={36}/>
          <IWall x={29} y={1}  w={1}  h={36}/>
          <IWall x={0}  y={37} w={30} h={1}/>

          {/* DIVIDER y=11 between welcome and ward/play */}
          <IWall x={1}  y={11} w={8}  h={1}/>
          <IDoor x={9}  y={11} w={2}  h={1} kind="wood"/>
          <IWall x={11} y={11} w={4}  h={1}/>
          <IDoor x={15} y={11} w={2}  h={1} kind="wood" label="→ PLAY"/>
          <IWall x={17} y={11} w={12} h={1}/>

          {/* DIVIDER y=25 between ward/play and treatment row */}
          <IWall x={1}  y={25} w={7}  h={1}/>
          <IDoor x={8}  y={25} w={2}  h={1} kind="wood"/>
          <IWall x={10} y={25} w={9}  h={1}/>
          <IDoor x={19} y={25} w={2}  h={1} kind="wood"/>
          <IWall x={21} y={25} w={8}  h={1}/>

          {/* ═══════ ENTRY / RECEPTION (y 1-10) ═══════ */}
          <BayLabel x={3} y={1} text="WELCOME · 4F"/>
          <IReception x={12} y={3} w={6} h={2} label="WELCOME DESK"/>
          <INpc x={13} y={6}   kind="nurse" hair="#5C3A1A" shirt="#FBCFE8"/>
          <INpc x={15} y={6}   kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <INpc x={17} y={6}   kind="doctor" hair="#9A6B3F"/>

          {/* waiting chairs (more spread out) */}
          {[2,4,6,8,21,23,25,27].map((cx,i) =>
            <IChair key={i} x={cx} y={8} color={['#FBCFE8','#BAE6FD','#FEF08A','#BBF7D0'][i%4]} facing="up"/>
          )}
          <INpc x={2} y={7.5} kind="parent" hair="#3C2A18"/>
          <INpc x={4} y={7.5} kind="child"  hair="#7C3F00"/>
          <IHotspot x={4} y={7} kind="info" label="첫 진료"/>
          <INpc x={6} y={7.5} kind="parent" hair="#9A6B3F"/>
          <INpc x={21} y={7.5} kind="parent" hair="#5C3A1A"/>
          <INpc x={23} y={7.5} kind="child"  hair="#3C2A18"/>
          <INpc x={25} y={7.5} kind="child"  hair="#7C3F00"/>

          {/* balloons */}
          <Balloon x={6}  y={2} c="#EF4444"/>
          <Balloon x={7}  y={1.5} c="#FACC15"/>
          <Balloon x={22} y={2} c="#3B82F6"/>
          <Balloon x={23} y={1.5} c="#10B981"/>
          <Balloon x={24} y={2.5} c="#FBCFE8"/>
          {/* mural */}
          <Mural x={2} y={2}/>
          <Mural x={24} y={2}/>
          {/* plants */}
          <IPlant x={1}  y={9}/>
          <IPlant x={28} y={9}/>

          {/* ═══════ WARD (cols 1-14, y 12-24) ═══════ */}
          <BayLabel x={1} y={12} text="WARD"/>

          {/* Curtain dividers between cribs */}
          <ICurtain x={4}  y={12} w={1} h={6} color="#FBCFE8"/>
          <ICurtain x={4}  y={19} w={1} h={6} color="#FBCFE8"/>
          <ICurtain x={9}  y={12} w={1} h={6} color="#BAE6FD"/>
          <ICurtain x={9}  y={19} w={1} h={6} color="#BAE6FD"/>

          {/* Cribs */}
          <PedsBed x={1} y={13} occupied stuffie="🐻"/>
          <PedsBed x={6} y={13} occupied stuffie="🦊"/>
          <PedsBed x={11} y={13} stuffie="🐰"/>
          <PedsBed x={1} y={20} stuffie="🐰"/>
          <PedsBed x={6} y={20} occupied stuffie="🐼"/>
          <PedsBed x={11} y={20} occupied stuffie="🦄"/>

          {/* IV stands */}
          <IIV x={3} y={14}/>
          <IIV x={8} y={14}/>
          <IIV x={8} y={21}/>
          <IIV x={13} y={21}/>

          {/* monitors */}
          <IMonitor x={1} y={17} beep/>
          <IMonitor x={6} y={17}/>
          <IMonitor x={11} y={17}/>

          {/* parents bedside */}
          <INpc x={2} y={16} kind="parent" hair="#3C2A18"/>
          <INpc x={7} y={16} kind="parent" hair="#9A6B3F"/>
          <INpc x={7} y={22} kind="parent" hair="#3C2A18"/>
          <INpc x={12} y={22} kind="parent" hair="#7C3F00"/>

          {/* nurse on rounds */}
          <INpc x={13} y={16} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <IHotspot x={13} y={15} kind="quest" label="투약 안내"/>

          {/* ═══════ PLAY ROOM (cols 16-28, y 12-24) ═══════ */}
          <BayLabel x={16} y={12} text="PLAYROOM" highlight/>
          {/* play mat (bigger now) */}
          <div style={{ position: 'absolute', left: 16 * ITILE + 2, top: 13 * ITILE + 2,
            width: 12 * ITILE - 4, height: 10 * ITILE - 4,
            background: '#FED7AA', border: `2px dashed ${IP.ink}55` }}/>
          {/* toy chest */}
          <ToyChest x={16} y={13}/>
          {/* blocks */}
          <Blocks x={20} y={14}/>
          {/* slide */}
          <SmallSlide x={23} y={13}/>
          {/* rocking horse */}
          <RockingHorse x={18} y={19}/>
          {/* child crying (key quest) */}
          <INpc x={22} y={18} kind="child" hair="#FACC15"/>
          <IHotspot x={22} y={17} kind="urgent" label="우는 아이"/>
          {/* another child playing */}
          <INpc x={25} y={17} kind="child" hair="#3C2A18"/>
          <INpc x={26} y={20} kind="child" hair="#7C3F00"/>
          {/* parent watching */}
          <INpc x={27} y={22} kind="parent" hair="#3C2A18"/>
          {/* picture book on mat */}
          <div style={{ position: 'absolute', left: 21 * ITILE, top: 22 * ITILE, width: ITILE, height: ITILE * 0.6, background: '#A78BFA', border: `1.5px solid ${IP.ink}` }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#fff', textAlign: 'center' }}>📖</div>
          </div>
          <IPlant x={28} y={23}/>

          {/* ═══════ TREATMENT ROW (y 26-36) ═══════ */}
          {/* Vertical dividers */}
          <IWall x={9}  y={26} w={1} h={3}/>
          <IDoor x={9}  y={29} w={1} h={2} kind="wood"/>
          <IWall x={9}  y={31} w={1} h={6}/>
          <IWall x={20} y={26} w={1} h={3}/>
          <IDoor x={20} y={29} w={1} h={2} kind="wood"/>
          <IWall x={20} y={31} w={1} h={6}/>

          {/* EXAM 1 (cols 1-8) */}
          <BayLabel x={1} y={26} text="EXAM 1"/>
          <IBed x={2} y={28} variant="ward" label="EXAM"/>
          <IMonitor x={5} y={28}/>
          <INpc x={3} y={32} kind="doctor" hair="#3C2A18"/>
          <INpc x={4.5} y={32} kind="parent" hair="#5C3A1A"/>
          <INpc x={5} y={33.5} kind="child"  hair="#9A6B3F"/>
          <IHotspot x={4} y={31} kind="info" label="문진"/>
          <IChair x={7} y={32} color="#BAE6FD" facing="down"/>
          <IPlant x={7} y={36}/>

          {/* VACCINATION (cols 10-19) */}
          <BayLabel x={10} y={26} text="VACCINATION"/>
          <IBed x={11} y={28} variant="ward"/>
          <ICabinet x={15} y={28} w={4} variant="drug" label="VAX"/>
          <INpc x={11} y={32} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          <IHotspot x={11} y={31} kind="quest" label="예방접종 설명"/>
          {/* fridge */}
          <Fridge x={17} y={31}/>
          {/* sharps disposal (red box) */}
          <div style={{ position: 'absolute', left: 14 * ITILE, top: 32 * ITILE, width: ITILE, height: ITILE, background: '#EF4444', border: `2px solid ${IP.ink}`, boxShadow: `2px 2px 0 0 ${IP.ink}` }}>
            <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, background: '#fff', border: `1px solid ${IP.ink}88` }}/>
            <div style={{ position: 'absolute', left: 4, bottom: 2, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: '#fff' }}>SHARPS</div>
          </div>

          {/* PHARMACY pickup window (cols 21-28) */}
          <BayLabel x={21} y={26} text="PHARMACY ↗"/>
          <ICabinet x={21} y={27} w={4} variant="drug"/>
          <IReception x={22} y={30} w={4} h={2} label="PICKUP"/>
          <INpc x={24} y={33} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          <IChair x={26} y={34} color="#FBCFE8" facing="up"/>
          <IPlant x={27} y={36}/>
        </>
      )}
    />
  );
}

function PedsBed({ x, y, occupied, stuffie }) {
  const C = IP.ink;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: ITILE * 2, height: ITILE * 3,
      filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.22))',
    }}>
      <svg viewBox="0 0 32 48" width={ITILE * 2} height={ITILE * 3} shapeRendering="crispEdges">
        {/* ── HEADBOARD top face (warm wood) ── */}
        <rect x="2" y="0" width="28" height="2" fill="#F59E0B"/>
        <rect x="3" y="0.5" width="26" height="0.7" fill="#FBBF24"/>
        {/* ── HEADBOARD body ── */}
        <rect x="2" y="2" width="28" height="6" fill="#FBBF77"/>
        {/* vertical slats on headboard */}
        {[5,9,13,17,21,25].map(sx => <rect key={sx} x={sx} y="3" width="1" height="4" fill="#D97706"/>)}
        <rect x="2" y="2"  width="28" height="0.6" fill="#FCD34D"/>
        <rect x="2" y="7.4" width="28" height="0.6" fill="#B45309"/>

        {/* ── MATTRESS TOP (soft pink sheet) ── */}
        <rect x="3" y="8" width="26" height="24" fill="#FDE4EE"/>
        {/* sheet shading (subtle gradient via stripes) */}
        <rect x="3" y="8" width="26" height="1" fill="#FFFFFF"/>
        <rect x="3" y="30" width="26" height="1.5" fill="#F0C8D9"/>

        {/* ── PILLOW (proper pixel block — no stretched-ellipse) ── */}
        <rect x="9"   y="10" width="14" height="4.5" fill="#FFFFFF"/>
        <rect x="8.3" y="11" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="22.8" y="11" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="10"  y="10.4" width="12" height="0.8" fill="#FEFEFE"/>
        <rect x="9"   y="13.4" width="14" height="1.1" fill="#E5E7EB"/>
        <rect x="15.7" y="11" width="0.5" height="3" fill="#D1D5DB" opacity=".6"/>

        {/* ── BLANKET (mint, lower 2/3 of mattress) ── */}
        <rect x="3" y="16" width="26" height="14" fill="#A7F3D0"/>
        <rect x="3" y="16" width="26" height="0.8" fill="#FFFFFF"/>
        <rect x="3" y="16.8" width="26" height="0.5" fill="#7DCEA0"/>
        {/* blanket fold lines (subtle) */}
        <rect x="10" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".4"/>
        <rect x="16" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".25"/>
        <rect x="22" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".4"/>

        {/* ── OCCUPANT (sleeping baby visible from above) ── */}
        {occupied && (
          <g>
            {/* head — round skin-tone */}
            <rect x="13" y="11" width="6" height="4" fill="#FDE1C8"/>
            <rect x="12" y="12" width="1" height="2" fill="#FDE1C8"/>
            <rect x="19" y="12" width="1" height="2" fill="#FDE1C8"/>
            {/* hair tuft */}
            <rect x="13" y="10.5" width="6" height="1" fill="#6B4423"/>
            <rect x="14" y="10" width="4" height="0.7" fill="#6B4423"/>
            {/* closed eyes (tiny dashes) */}
            <rect x="14" y="13" width="1" height="0.4" fill={C}/>
            <rect x="17" y="13" width="1" height="0.4" fill={C}/>
            {/* face outline (very light, no heavy stroke) */}
            <rect x="12.5" y="11"   width="0.4" height="4" fill={C} opacity=".5"/>
            <rect x="19.1" y="11"   width="0.4" height="4" fill={C} opacity=".5"/>
            <rect x="13"   y="14.7" width="6" height="0.4" fill={C} opacity=".5"/>
            {/* tiny body bump under blanket near top */}
            <rect x="11" y="18" width="10" height="2" fill="#7DCEA0" opacity=".5"/>
          </g>
        )}

        {/* ── MATTRESS FRONT edge (thickness) ── */}
        <rect x="3" y="32" width="26" height="2" fill="#F0C8D9"/>

        {/* ── FOOTBOARD top face ── */}
        <rect x="2" y="34" width="28" height="2" fill="#F59E0B"/>
        <rect x="3" y="34.5" width="26" height="0.7" fill="#FBBF24"/>

        {/* ── FOOTBOARD body ── */}
        <rect x="2" y="36" width="28" height="6" fill="#FBBF77"/>
        {[5,9,13,17,21,25].map(sx => <rect key={sx} x={sx} y="37" width="1" height="4" fill="#D97706"/>)}
        <rect x="2" y="36"  width="28" height="0.6" fill="#FCD34D"/>
        <rect x="2" y="41.4" width="28" height="0.6" fill="#B45309"/>

        {/* ── LEGS ── */}
        <rect x="3" y="42" width="3" height="5" fill="#7C2D12"/>
        <rect x="26" y="42" width="3" height="5" fill="#7C2D12"/>
        <rect x="3.3" y="42.3" width="1" height="4.4" fill="#9A3412"/>
        <rect x="26.3" y="42.3" width="1" height="4.4" fill="#9A3412"/>

        {/* ── SIDE RAIL bars (visible to viewer) ── */}
        <rect x="2"  y="8"  width="0.7" height="24" fill="#D97706"/>
        <rect x="29.3" y="8"  width="0.7" height="24" fill="#D97706"/>
      </svg>

      {/* stuffie at foot of bed (kept as emoji on top of svg for color punch) */}
      {stuffie && (
        <div style={{
          position: 'absolute', right: 2, bottom: ITILE * 1.1,
          fontSize: 11, lineHeight: 1,
          filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,.3))',
        }}>{stuffie}</div>
      )}
    </div>
  );
}

function Balloon({ x, y, c }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE + 4, top: y * ITILE - 4, animation: 'forinBob 1.6s ease-in-out infinite' }}>
      <svg viewBox="0 0 8 14" width="12" height="20" shapeRendering="crispEdges">
        <ellipse cx="4" cy="4" rx="3" ry="4" fill={c} stroke={IP.ink} strokeWidth=".5"/>
        <rect x="4" y="8" width="0.5" height="6" fill={IP.ink}/>
      </svg>
    </div>
  );
}

function Mural({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 4, height: ITILE * 2, background: '#FEF3C7', border: `2px solid ${IP.ink}`, padding: 2 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', right: 4, top: 1, width: 6, height: 6, background: '#FACC15', border: `1px solid ${IP.ink}`, borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', left: 8, top: 2, width: 14, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: '#86EFAC', borderTop: `1px solid ${IP.ink}`,
          clipPath: 'polygon(0 60%, 30% 30%, 60% 70%, 100% 40%, 100% 100%, 0 100%)' }}/>
        <div style={{ position: 'absolute', left: 6, bottom: 2, width: 8, height: 5, background: '#FCA5A5', border: `1px solid ${IP.ink}` }}/>
      </div>
    </div>
  );
}

function ToyChest({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 1.5, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 4, bottom: 0, background: '#8B4513', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: '#A0531C', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 1, width: 4, height: 3, background: '#FACC15' }}/>
      <div style={{ position: 'absolute', left: 4, top: 8, fontSize: 9 }}>🧸🚂</div>
    </div>
  );
}

function Blocks({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.2, height: ITILE * 0.8 }}>
      <div style={{ position: 'absolute', left: 0, top: 6, width: 6, height: 6, background: '#EF4444', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 6, top: 4, width: 6, height: 8, background: '#3B82F6', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 3, top: 0, width: 6, height: 6, background: '#FACC15', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 12, top: 6, width: 6, height: 6, background: '#10B981', border: `1px solid ${IP.ink}` }}/>
    </div>
  );
}

function SmallSlide({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <svg viewBox="0 0 32 32" width={ITILE * 2} height={ITILE * 2} shapeRendering="crispEdges">
        <path d="M2 28 L18 28 L26 8 L30 8 L30 12 L22 30 L2 30 Z" fill="#FBBF24" stroke={IP.ink} strokeWidth="1"/>
        <rect x="26" y="6" width="4" height="2" fill="#7C2D12"/>
        <rect x="24" y="6" width="2" height="22" fill="#7C2D12"/>
        <rect x="29" y="6" width="2" height="20" fill="#7C2D12"/>
        <rect x="24" y="14" width="7" height="1.5" fill="#7C2D12"/>
        <rect x="24" y="20" width="7" height="1.5" fill="#7C2D12"/>
      </svg>
    </div>
  );
}

function RockingHorse({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 1.5, animation: 'forinBob 1.4s ease-in-out infinite' }}>
      <svg viewBox="0 0 32 24" width={ITILE * 2} height={ITILE * 1.5} shapeRendering="crispEdges">
        <ellipse cx="16" cy="20" rx="14" ry="3" fill="#7C2D12" stroke={IP.ink} strokeWidth="1"/>
        <rect x="6" y="10" width="20" height="8" fill="#F9A8B4" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="22" y="4" width="6" height="8" fill="#F9A8B4" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="20" y="6" width="2" height="3" fill="#F9A8B4"/>
        <rect x="26" y="7" width="1" height="1" fill={IP.ink}/>
        <rect x="22" y="2" width="3" height="2" fill="#FACC15"/>
      </svg>
    </div>
  );
}

function Fridge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.2, height: ITILE * 2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 1, right: 1, top: '38%', height: 2, background: IP.ink }}/>
      <div style={{ position: 'absolute', right: 2, top: 4, width: 1.5, height: 6, background: IP.metalDk }}/>
      <div style={{ position: 'absolute', right: 2, bottom: 4, width: 1.5, height: 6, background: IP.metalDk }}/>
      <div style={{ position: 'absolute', left: 3, top: 18, width: 8, height: 5, background: '#BAE6FD', border: `1px solid ${IP.ink}66`, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: IP.ink, textAlign: 'center', lineHeight: '5px' }}>VAX</div>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorPeds,
  PedsBed, Balloon, Mural, ToyChest, Blocks, SmallSlide, RockingHorse,
  FridgePeds: Fridge, // distinct from pharma's Fridge
});
