// interior-clinics.jsx — Data-driven outpatient-clinic departments.
//
// Outpatient clinics (내과/외과/정형외과/피부과 …) share one realistic floor
// plan: reception + waiting (front), a row of exam rooms (middle), and a
// procedure/treatment room (back) whose equipment is department-specific.
//
// Adding a new department = add one config to CLINIC_DEPTS and (optionally) a
// signature prop. The campus building + design-canvas artboard pick it up.
//
// Relies on shared atoms from interior-shared.jsx (IWall/IDoor/IReception/
// IBed/IMonitor/IChair/ICabinet/IPlant/IHotspot/BayLabel/INpc) + a few new
// signature props defined here.

(function () {
  const C = IP.ink;
  const T = window.ITILE || 16;

  // ═══════════════════════════════════════════════════════════════════
  //  SIGNATURE PROPS (compact 2.5D SVG, tile-positioned)
  // ═══════════════════════════════════════════════════════════════════

  // Ultrasound cart — screen + probe + keyboard cart (Internal Medicine)
  function UltrasoundCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.4, height: T * 2.4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 22 38" width={T * 1.4} height={T * 2.4} shapeRendering="crispEdges">
          {/* monitor */}
          <rect x="3" y="0" width="16" height="12" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <rect x="4" y="1" width="14" height="9" fill="#0F1A24"/>
          {/* fan-shaped ultrasound sweep */}
          <path d="M 11 2 L 6 9 L 16 9 Z" fill="#15314A"/>
          <path d="M 11 2 L 8 9 L 14 9 Z" fill="#22506E"/>
          <rect x="10" y="4" width="2" height="2" fill="#A7F3D0"/>
          {/* top face */}
          <path d="M 4 12 L 18 12 L 19 14 L 3 14 Z" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* keyboard body */}
          <rect x="2" y="14" width="18" height="6" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <rect x="4" y="16" width="14" height="2" fill="#94A3B8"/>
          {/* probe holder + probe */}
          <rect x="0" y="15" width="2" height="2" fill="#6B7280"/>
          <rect x="-1" y="17" width="2" height="5" fill="#E5E7EB" stroke={C} strokeWidth=".3"/>
          {/* cart column + base */}
          <rect x="9" y="20" width="4" height="12" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="22" width="16" height="4" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="5" cy="34" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="17" cy="34" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // X-ray view box / lightbox on wall (Orthopedics)
  function XrayViewbox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 2, height: T * 1.4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 32 22" width={T * 2} height={T * 1.4} shapeRendering="crispEdges">
          <rect x="1" y="1" width="30" height="20" fill="#E5E7EB" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="3" width="12" height="16" fill="#1E3A5F"/>
          <rect x="17" y="3" width="12" height="16" fill="#1E3A5F"/>
          {/* bone/femur silhouette (lit film) */}
          <rect x="7" y="4" width="4" height="14" fill="#BFD3E6"/>
          <ellipse cx="9" cy="5" rx="3" ry="2" fill="#D8E6F2"/>
          <ellipse cx="9" cy="17" rx="3" ry="2" fill="#D8E6F2"/>
          {/* rib-ish lines on right film */}
          {[5,8,11,14].map((ry,i)=><rect key={i} x="19" y={ry} width="9" height="1.5" fill="#9DB8D2"/>)}
          {/* clips */}
          <rect x="9" y="1" width="3" height="2" fill="#6B7280"/>
          <rect x="22" y="1" width="3" height="2" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // Cast / supply cart with plaster rolls (Orthopedics)
  function CastCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.4, height: T * 1.6, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 22 26" width={T * 1.4} height={T * 1.6} shapeRendering="crispEdges">
          <path d="M 2 2 L 20 2 L 21 4 L 1 4 Z" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="4" width="20" height="16" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          {/* plaster rolls */}
          <ellipse cx="6" cy="8" rx="3" ry="2" fill="#fff" stroke={C} strokeWidth=".4"/>
          <ellipse cx="14" cy="8" rx="3" ry="2" fill="#FDE9D2" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="12" width="16" height="2" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="15" width="16" height="2" fill="#FDE9D2" stroke={C} strokeWidth=".3"/>
          <ellipse cx="4" cy="24" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="18" cy="24" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // Crutches leaning (Orthopedics)
  function Crutches({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 6, width: T, height: T * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 12 34" width={T} height={T * 2} shapeRendering="crispEdges">
          {[2,6].map((ox,i)=>(
            <g key={i}>
              <rect x={ox} y="2" width="3" height="2" fill="#E8DCC0" stroke={C} strokeWidth=".3"/>
              <rect x={ox+1} y="4" width="1" height="26" fill="#C8A876" stroke={C} strokeWidth=".3"/>
              <rect x={ox-0.5} y="12" width="4" height="1.5" fill="#A88862"/>
              <rect x={ox} y="30" width="3" height="2" fill="#4B5563"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // Dermatoscope exam lamp on articulated arm (Dermatology)
  function DermLamp({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 1.3, height: T * 2.2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 20 36" width={T * 1.3} height={T * 2.2} shapeRendering="crispEdges">
          {/* magnifier ring head */}
          <circle cx="6" cy="6" r="5" fill="none" stroke="#94A3B8" strokeWidth="1.5"/>
          <circle cx="6" cy="6" r="3.5" fill="#D4F0F8" opacity=".7"/>
          <circle cx="6" cy="6" r="3.5" fill="none" stroke={C} strokeWidth=".4"/>
          {/* ring light dots */}
          {[2,5,8,5].map((d,i)=><circle key={i} cx={6+3*Math.cos(i*1.57)} cy={6+3*Math.sin(i*1.57)} r=".6" fill="#FEF9C3"/>)}
          {/* arm */}
          <rect x="10" y="5" width="6" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".3" transform="rotate(20 10 6)"/>
          <rect x="15" y="6" width="2" height="14" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* base */}
          <rect x="11" y="20" width="4" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <ellipse cx="13" cy="32" rx="6" ry="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // Laser / phototherapy unit (Dermatology)
  function LaserUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.2, height: T * 2.2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 18 36" width={T * 1.2} height={T * 2.2} shapeRendering="crispEdges">
          <path d="M 2 1 L 16 1 L 17 3 L 1 3 Z" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="3" width="16" height="14" fill="#E2E8F0" stroke={C} strokeWidth=".5"/>
          {/* touchscreen */}
          <rect x="3" y="5" width="12" height="7" fill="#0F1A24" stroke={C} strokeWidth=".3"/>
          <rect x="4" y="6" width="10" height="2" fill="#A78BFA"/>
          <rect x="4" y="9" width="7" height="1.5" fill="#22D3EE"/>
          {/* handpiece on holster */}
          <rect x="14" y="14" width="3" height="2" fill="#1F2937"/>
          <rect x="15" y="16" width="2" height="6" fill="#374151" stroke={C} strokeWidth=".3"/>
          {/* body + base */}
          <rect x="1" y="17" width="16" height="13" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="19" width="12" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="4" cy="32" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="14" cy="32" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // Doctor's rolling stool
  function ExamStool({ x, y, color = '#4B5563' }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T} shapeRendering="crispEdges">
          <ellipse cx="6" cy="3" rx="5" ry="2.5" fill={color} stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="2.4" rx="4" ry="1.6" fill="#6B7280"/>
          <rect x="5" y="4" width="2" height="4" fill="#9CA3AF"/>
          {[3,6,9].map((lx,i)=><rect key={i} x={lx} y="8" width="1.5" height="3" fill="#6B7280" transform={`rotate(${(i-1)*25} ${lx} 8)`}/>)}
        </svg>
      </div>
    );
  }

  // Wall-mounted skincare / sample shelf (Dermatology)
  function SkincareShelf({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox={`0 0 ${w*16} 12`} width={T * w} height={T - 4} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="1" y="1" width={w*16-2} height="10" fill="#F0E6EA" stroke={C} strokeWidth=".5"/>
          <rect x="1" y="6" width={w*16-2} height="1.5" fill={C} opacity=".25"/>
          {Array.from({length: w*2}).map((_,i)=>(
            <rect key={i} x={3+i*7} y="2" width="3" height="4" fill={['#FBCFE8','#A7F3D0','#BAE6FD','#FDE68A'][i%4]} stroke={C} strokeWidth=".3"/>
          ))}
          {Array.from({length: w*2}).map((_,i)=>(
            <rect key={'b'+i} x={3+i*7} y="7.5" width="3" height="3" fill={['#DDD6FE','#FED7AA'][i%2]} stroke={C} strokeWidth=".3"/>
          ))}
        </svg>
      </div>
    );
  }

  // Anatomical skeleton / bone model on stand (Orthopedics)
  function BoneModel({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 8, width: T - 4, height: T * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 12 32" width={T - 4} height={T * 2} shapeRendering="crispEdges">
          {/* skull */}
          <circle cx="6" cy="4" r="3" fill="#F3F0E6" stroke={C} strokeWidth=".4"/>
          <rect x="4.5" y="3.5" width="1" height="1" fill={C}/>
          <rect x="6.5" y="3.5" width="1" height="1" fill={C}/>
          {/* spine */}
          <rect x="5" y="7" width="2" height="8" fill="#F3F0E6" stroke={C} strokeWidth=".3"/>
          {/* ribs */}
          {[8,10,12].map((ry,i)=><ellipse key={i} cx="6" cy={ry} rx="3" ry="1" fill="none" stroke="#E8E2D2" strokeWidth=".6"/>)}
          {/* stand */}
          <rect x="5" y="15" width="2" height="12" fill="#9CA3AF"/>
          <ellipse cx="6" cy="28" rx="4" ry="1.5" fill="#6B7280" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // Modern reception desk — long counter, white top + wood front, multiple
  // stations, sign band, flower vase. Replaces the plain IReception look.
  function ClinicReception({ x, y, w = 6, tone = '#0E7490', label = '접수' }) {
    const px = w * T;
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: px, height: T * 2.4, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox={`0 0 ${w*16} 38`} width={px} height={T * 2.4} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* back signage band on wall */}
          <rect x="3" y="0" width={w*16-6} height="6" fill={tone} stroke={C} strokeWidth=".5"/>
          <rect x="5" y="1.5" width={w*16-10} height="3" fill={mixC(tone,'#FFFFFF',0.5)}/>
          {/* white counter top */}
          <rect x="1" y="8" width={w*16-2} height="6" fill="#FFFFFF" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="9" width={w*16-4} height="1.5" fill="#F1F5F9"/>
          {/* dark transaction shelf lip */}
          <rect x="1" y="13.5" width={w*16-2} height="2" fill="#1F2937"/>
          {/* wood lower front */}
          <rect x="1" y="15" width={w*16-2} height="20" fill="#C8A165" stroke={C} strokeWidth=".6"/>
          <rect x="1" y="15" width={w*16-2} height="1.5" fill="#D9B988"/>
          {/* wood grain seams */}
          {Array.from({length: w}).map((_,i)=>(
            <rect key={i} x={6+i*16} y="16" width=".7" height="18" fill="#A9854F" opacity=".6"/>
          ))}
          {/* base kickplate */}
          <rect x="1" y="34" width={w*16-2} height="2" fill="#8A6A3C"/>
          {/* monitors on the counter (one per ~2 tiles) */}
          {Array.from({length: Math.max(2, Math.floor(w/2))}).map((_,i)=>{
            const mx = 8 + i * (((w*16)-16) / Math.max(1, Math.floor(w/2)-1));
            return (
              <g key={'m'+i}>
                <rect x={mx} y="4" width="9" height="6" fill="#1F2937" stroke={C} strokeWidth=".4"/>
                <rect x={mx+1} y="5" width="7" height="4" fill="#0F1A24"/>
                <rect x={mx+1.5} y="5.6" width="6" height="1" fill={mixC(tone,'#7DD3FC',0.4)}/>
                <rect x={mx+3.5} y="10" width="2" height="1.5" fill="#374151"/>
              </g>
            );
          })}
          {/* flower vase at left end */}
          <ellipse cx="6" cy="8" rx="2.5" ry="1.2" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          <rect x="4.5" y="3" width="3" height="5" fill="#A7C7E7" opacity=".7"/>
          <circle cx="5" cy="3" r="1.6" fill="#FACC15"/>
          <circle cx="7" cy="2.5" r="1.6" fill="#F9A8B4"/>
          <circle cx="6" cy="4" r="1.4" fill="#FB923C"/>
        </svg>
        {label && (
          <div style={{ position: 'absolute', left: '50%', top: -14, transform: 'translateX(-50%)', background: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C, whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${C}`, zIndex: 5 }}>{label}</div>
        )}
      </div>
    );
  }

  function mixC(a, b, t) {
    const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
    return '#' + [Math.round(ar+(br-ar)*t),Math.round(ag+(bg-ag)*t),Math.round(ab+(bb-ab)*t)].map(v=>v.toString(16).padStart(2,'0')).join('');
  }


  // cfg = {
  //   code, deptCode, deptColor, floor, accent,
  //   mission, missionUrgent,
  //   chairColor, examLabels:[3], procedureLabel,
  //   renderProcedure(), renderExamExtra?(),
  //   staff: hair palette helpers handled inline
  // }
  function ClinicInterior({ cfg }) {
    const COLS = 22, ROWS = 24;

    const regions = [
      { id: 'reception', name: '접수·대기', icon: '🪑', bounds: { x: 0, y: 0,  w: 22, h: 9 } },
      { id: 'exam',      name: '진료실',    icon: '🩺', bounds: { x: 0, y: 8,  w: 22, h: 9 } },
      { id: 'procedure', name: cfg.procedureLabel || '처치실', icon: cfg.procedureIcon || '💉', bounds: { x: 0, y: 16, w: 22, h: 8 } },
    ];
    const rooms = [
      { id: 'reception', name: '접수 데스크', sub: '대기·접수', icon: '🪑', color: cfg.accent, x: 4, y: 4 },
      { id: 'exam1', name: cfg.examLabels[0], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 3,  y: 12, questCount: 1 },
      { id: 'exam2', name: cfg.examLabels[1], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 10, y: 12 },
      { id: 'exam3', name: cfg.examLabels[2], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 17, y: 12, questCount: 1 },
      { id: 'procedure', name: cfg.procedureLabel || '처치실', sub: cfg.procedureSub || '', icon: cfg.procedureIcon || '💉', color: cfg.accent, x: 11, y: 20, questCount: 1 },
    ];

    return (
      <InteriorScreen
        label={cfg.label} deptCode={cfg.deptCode} deptColor={cfg.deptColor}
        cols={COLS} rows={ROWS} floor={cfg.floor}
        playerStart={{ x: 11, y: 6 }}
        rooms={rooms} regions={regions}
        missionText={cfg.mission} missionUrgent={cfg.missionUrgent}
        render={() => (
          <>
            {/* ── OUTER WALLS ── */}
            <IWall x={0} y={0} w={9} h={1}/>
            <IDoor x={9} y={0} w={2} h={1} kind="auto" label="↓ 캠퍼스로"/>
            <IWall x={11} y={0} w={11} h={1}/>
            <IWall x={0}  y={1}  w={1} h={22}/>
            <IWall x={21} y={1}  w={1} h={22}/>
            <IWall x={0}  y={23} w={22} h={1}/>

            {/* ════ RECEPTION + WAITING (y1-7) ════ */}
            <BayLabel x={1} y={1} text={`${cfg.code} · RECEPTION`}/>
            <ClinicReception x={1} y={2} w={6} tone={cfg.deptColor} label="접수"/>
            <INpc x={3} y={4.5} kind="nurse" shirt={cfg.accent}/>
            <INpc x={5} y={4.5} kind="nurse" shirt={cfg.accent}/>
            {/* signage / plants */}
            <IPlant x={1} y={6}/>
            <IPlant x={20} y={2}/>
            {/* waiting chairs (two rows) */}
            {[14,16,18,20].map((cx,i)=>(
              <IChair key={'a'+i} x={cx} y={3} color={cfg.chairColor} facing="down"/>
            ))}
            {[14,16,18,20].map((cx,i)=>(
              <IChair key={'b'+i} x={cx} y={6} color={cfg.chairColor} facing="up"/>
            ))}
            {/* waiting patients */}
            <INpc x={14} y={3.5} kind="patient"/>
            <INpc x={16} y={6.5} kind="visitor"/>
            <INpc x={18} y={3.5} kind="patient"/>
            <IHotspot x={16} y={6} kind="info" label="접수 안내"/>
            {/* department-specific waiting-area flavor */}
            {cfg.waitingDecor && cfg.waitingDecor()}

            {/* ════ DIVIDER y8 ════ */}
            <IWall x={1}  y={8} w={6} h={1}/>
            <IDoor x={7}  y={8} w={1} h={1} kind="wood"/>
            <IWall x={8}  y={8} w={6} h={1}/>
            <IDoor x={14} y={8} w={1} h={1} kind="wood"/>
            <IWall x={15} y={8} w={6} h={1}/>

            {/* ════ EXAM ROOMS (y9-15) — 3 rooms ════ */}
            {/* vertical dividers */}
            <IWall x={7}  y={9} w={1} h={2}/>
            <IDoor x={7}  y={11} w={1} h={2} kind="wood"/>
            <IWall x={7}  y={13} w={1} h={3}/>
            <IWall x={14} y={9} w={1} h={2}/>
            <IDoor x={14} y={11} w={1} h={2} kind="wood"/>
            <IWall x={14} y={13} w={1} h={3}/>

            {[0,1,2].map(i => {
              const ox = i * 7 + 1;               // room left edge: 1, 8, 15
              const hair = ['#3C2A18','#5C3A1A','#1F2937'][i];
              return (
                <React.Fragment key={i}>
                  <BayLabel x={ox} y={9} text={cfg.examLabels[i]} highlight={i === 0}/>
                  <IBed x={ox} y={10} variant="ward" label={i === 0 ? 'EXAM' : undefined}/>
                  <ExamStool x={ox + 3} y={11}/>
                  <ICabinet x={ox + 3} y={10} w={2} variant={cfg.cabinet || 'supply'}/>
                  <INpc x={ox + 1} y={13.5} kind="doctor" hair={hair}/>
                  <INpc x={ox + 3} y={13.5} kind="patient"/>
                  {/* department-specific exam-room flavor */}
                  {cfg.examDecor && cfg.examDecor(i, ox)}
                  {(i === 0 || i === 2) && <IHotspot x={ox + 1} y={13} kind="quest" label="진료"/>}
                </React.Fragment>
              );
            })}

            {/* ════ DIVIDER y16 ════ */}
            <IWall x={1}  y={16} w={9}  h={1}/>
            <IDoor x={10} y={16} w={2}  h={1} kind="wood" label={`→ ${cfg.procedureLabel || '처치실'}`}/>
            <IWall x={12} y={16} w={9}  h={1}/>

            {/* ════ PROCEDURE / TREATMENT (y17-22) — dept-specific ════ */}
            <BayLabel x={1} y={17} text={(cfg.procedureLabel || '처치실').toUpperCase()} highlight/>
            {cfg.renderProcedure()}
          </>
        )}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DEPARTMENT CONFIGS  — add new departments here
  // ═══════════════════════════════════════════════════════════════════

  // 내과 · Internal Medicine
  function ScreenInteriorInternal() {
    return <ClinicInterior cfg={{
      label: '06f Interior · INTERNAL', code: 'IM', deptCode: '내과 Internal · 6F', deptColor: '#0E7490',
      floor: 'internal', accent: '#A7E3D0', chairColor: '#BBF7D0', cabinet: 'drug',
      examLabels: ['진료실 1', '진료실 2', '진료실 3'],
      procedureLabel: '검사실', procedureIcon: '🫀', procedureSub: '심전도·초음파',
      mission: '진료실 1 · 만성질환 환자 문진 (혈압·복약 확인)',
      waitingDecor: () => (
        <>
          {/* self-service BP station + health poster — 내과 vibe */}
          <window.BPCuff x={11} y={2}/>
          <window.Whiteboard x={12} y={1} w={2}/>
          <window.IChair x={12} y={3} color="#BBF7D0" facing="down"/>
          <window.INpc x={12} y={3.5} kind="patient"/>
        </>
      ),
      examDecor: (i, ox) => <window.BPCuff x={ox} y={9}/>,
      renderProcedure: () => (
        <>
          <UltrasoundCart x={2} y={18}/>
          <IBed x={5} y={18} variant="ward" occupied label="ECG"/>
          <window.EKG x={8} y={18}/>
          <IMonitor x={9} y={20} beep/>
          <window.BPCuff x={3} y={21}/>
          <ICabinet x={15} y={18} w={4} variant="drug" label="MEDS"/>
          <INpc x={6} y={21} kind="nurse" hair="#7C3F00" shirt="#A7E3D0"/>
          <INpc x={9} y={21.5} kind="doctor" hair="#1F2937"/>
          <IHotspot x={6} y={20.5} kind="quest" label="심전도 안내"/>
          <IPlant x={20} y={21}/>
        </>
      ),
    }}/>;
  }

  // 외과 · General Surgery (minor procedures / outpatient surgery)
  function ScreenInteriorSurgery() {
    return <ClinicInterior cfg={{
      label: '06g Interior · SURGERY', code: 'GS', deptCode: '외과 Surgery · 3F', deptColor: '#2563EB',
      floor: 'surgery', accent: '#A8DCEC', chairColor: '#BAE6FD', cabinet: 'sterile',
      examLabels: ['외래 1', '외래 2', '상처 드레싱'],
      procedureLabel: '소수술실', procedureIcon: '🔪', procedureSub: '국소마취 처치',
      mission: '소수술실 · 봉합 처치 보조 + 멸균 기구 패스',
      missionUrgent: false,
      waitingDecor: () => (
        <>
          {/* sterile supply + gurney waiting bay — 외과 vibe */}
          <window.Gurney x={11} y={2}/>
          <window.ICabinet x={12} y={1} w={2} variant="sterile" label="STERILE"/>
          <window.HandSanitizer x={11} y={5}/>
        </>
      ),
      examDecor: (i, ox) => <window.ICabinet x={ox} y={9} w={2} variant="sterile"/>,
      renderProcedure: () => (
        <>
          <window.SurgicalLight x={4} y={16}/>
          <IBed x={4} y={18} variant="or" occupied label="MINOR OP"/>
          <window.InstrumentTray x={8} y={19}/>
          <IMonitor x={2} y={18} beep/>
          <IIV x={7} y={18}/>
          <ICabinet x={15} y={18} w={4} variant="sterile" label="STERILE"/>
          <window.SharpsContainer x={19} y={21}/>
          <INpc x={5} y={21} kind="surgeon" hair="#1F2937"/>
          <INpc x={8} y={21.5} kind="nurse" hair="#3C2A18" shirt="#A8DCEC"/>
          <IHotspot x={8} y={21} kind="quest" label="기구 패스"/>
        </>
      ),
    }}/>;
  }

  // 정형외과 · Orthopedics
  function ScreenInteriorOrtho() {
    return <ClinicInterior cfg={{
      label: '06h Interior · ORTHO', code: 'OS', deptCode: '정형외과 Ortho · 3F', deptColor: '#B45309',
      floor: 'ortho', accent: '#FDE9C8', chairColor: '#FED7AA', cabinet: 'supply',
      examLabels: ['진료실 1', '진료실 2', '깁스실'],
      procedureLabel: '캐스팅·재활', procedureIcon: '🦴', procedureSub: '깁스·물리치료',
      mission: '깁스실 · 발목 캐스팅 후 목발 사용법 설명',
      waitingDecor: () => (
        <>
          {/* X-ray viewbox on wall + parked wheelchair + crutches — 정형외과 vibe */}
          <XrayViewbox x={11} y={1}/>
          <window.Wheelchair x={11} y={4}/>
          <Crutches x={13} y={4}/>
        </>
      ),
      examDecor: (i, ox) => <BoneModel x={ox + 5} y={10}/>,
      renderProcedure: () => (
        <>
          <XrayViewbox x={2} y={17}/>
          <IBed x={2} y={19} variant="ward" occupied label="CAST"/>
          <CastCart x={6} y={19}/>
          <Crutches x={9} y={18}/>
          <BoneModel x={19} y={17}/>
          <ICabinet x={14} y={18} w={4} variant="supply" label="ORTHO"/>
          <INpc x={4} y={21.5} kind="doctor" hair="#5C3A1A"/>
          <INpc x={7} y={21.5} kind="patient"/>
          <IHotspot x={7} y={21} kind="quest" label="목발 설명"/>
          <IPlant x={20} y={21}/>
        </>
      ),
    }}/>;
  }

  // 피부과 · Dermatology
  function ScreenInteriorDerm() {
    return <ClinicInterior cfg={{
      label: '06i Interior · DERM', code: 'DM', deptCode: '피부과 Derm · 2F', deptColor: '#DB2777',
      floor: 'derm', accent: '#FBCFE8', chairColor: '#FBCFE8', cabinet: 'supply',
      examLabels: ['진료실 1', '진료실 2', '레이저실'],
      procedureLabel: '시술실', procedureIcon: '✨', procedureSub: '레이저·광치료',
      mission: '시술실 · 레이저 시술 전 주의사항 안내',
      waitingDecor: () => (
        <>
          {/* product display shelf + skincare samples + mirror — 피부과 vibe */}
          <SkincareShelf x={11} y={1} w={3}/>
          <SkincareShelf x={11} y={5} w={3}/>
          <window.IPlant x={11} y={3}/>
        </>
      ),
      examDecor: (i, ox) => <DermLamp x={ox + 4} y={10}/>,
      renderProcedure: () => (
        <>
          <DermLamp x={2} y={17}/>
          <IBed x={4} y={18} variant="ward" occupied label="LASER"/>
          <LaserUnit x={8} y={18}/>
          <SkincareShelf x={14} y={17} w={4}/>
          <ICabinet x={15} y={19} w={4} variant="supply" label="DERM"/>
          <ExamStool x={6} y={21} color="#BE185D"/>
          <INpc x={5} y={21} kind="doctor" hair="#1F2937"/>
          <INpc x={9} y={21.5} kind="patient"/>
          <IHotspot x={9} y={21} kind="quest" label="시술 안내"/>
          <IPlant x={20} y={21}/>
        </>
      ),
    }}/>;
  }

  Object.assign(window, {
    // signature props
    UltrasoundCart, XrayViewbox, CastCart, Crutches, DermLamp, LaserUnit,
    ExamStool, SkincareShelf, BoneModel, ClinicReception,
    // engine + screens
    ClinicInterior,
    ScreenInteriorInternal, ScreenInteriorSurgery, ScreenInteriorOrtho, ScreenInteriorDerm,
  });
})();
