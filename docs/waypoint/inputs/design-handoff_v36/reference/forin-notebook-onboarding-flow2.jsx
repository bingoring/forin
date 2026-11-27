// forin-notebook-onboarding-flow2.jsx — 온보딩 인터랙티브 플로우 2: "여권 발급"
// 여권 신분(ID) 페이지의 빈칸(사용 언어 → 직업 → 사진(아바타) → 이름)을
// 순차적으로 채운다. 빈칸을 채울 차례가 되면 그 칸에서 선택지가 화면 중앙으로
// 확대(zoom)되어 떠오르고, 고르면 다시 줄어들며 칸이 채워진다.
// 모두 채우면 다음 장(목적지)에서 도장 → 출국 — 기존 플로우와 동일.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const { CurlOut, CurlIn, Gutter } = window.NbOnbFX || {};
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', paper: '#FFFdf4', cream: '#F1EBDD' };

  if (!document.getElementById('nb-onb2-css')) {
    const s = document.createElement('style');
    s.id = 'nb-onb2-css';
    s.textContent = `
@keyframes nb2-zoom{0%{transform:scale(.18);opacity:0}70%{transform:scale(1.04);opacity:1}100%{transform:scale(1);opacity:1}}
.nb2-zoom{animation:nb2-zoom .42s cubic-bezier(.3,.8,.3,1) both}
@keyframes nb2-dim{from{opacity:0}to{opacity:1}}
.nb2-dim{animation:nb2-dim .3s ease both}
@keyframes nb2-fill{0%{transform:scale(1.5);opacity:0}60%{transform:scale(.95);opacity:1}100%{transform:scale(1);opacity:1}}
.nb2-fill{animation:nb2-fill .32s ease-out both}
@keyframes nb2-blink{0%,55%{opacity:1}62%,100%{opacity:.25}}
.nb2-blink{animation:nb2-blink 1.3s steps(1) infinite}
`;
    document.head.appendChild(s);
  }

  const LANGS = [
    { id: 'ko', flag: '🇰🇷', name: '한국어', code: 'KOR' },
    { id: 'ja', flag: '🇯🇵', name: '日本語', code: 'JPN' },
    { id: 'zh', flag: '🇨🇳', name: '中文', code: 'CHN' },
    { id: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', code: 'VNM' },
    { id: 'es', flag: '🇪🇸', name: 'Español', code: 'ESP' },
    { id: 'tl', flag: '🇵🇭', name: 'Filipino', code: 'PHL' },
  ];
  const JOBS = [
    { id: 'rn', icon: 'stetho', name: '간호사', code: 'RN', soon: false },
    { id: 'ho', icon: 'bell', name: '호텔리어', code: 'HTL', soon: true },
    { id: 'ba', icon: 'coffee', name: '바리스타 · 서비스직', code: 'SVC', soon: true },
    { id: 'en', icon: 'gear', name: '엔지니어', code: 'ENG', soon: true },
  ];
  const AVATARS = [
    { hair: 'bob', hairColor: 'darkbrown', outfit: 'scrubPocket', outfitColor: 'mint' },
    { hair: 'ponytail', hairColor: 'brown', outfit: 'scrubPocket', outfitColor: 'sky' },
    { hair: 'short', hairColor: 'black', outfit: 'scrubPocket', outfitColor: 'navy' },
    { hair: 'bun', hairColor: 'ash', outfit: 'labCoat', outfitColor: 'teal' },
    { hair: 'curlyShort', hairColor: 'darkbrown', outfit: 'scrubPocket', outfitColor: 'lilac' },
    { hair: 'part', hairColor: 'brown', outfit: 'labCoat', outfitColor: 'burgundy' },
  ];
  const DESTS = [
    { id: 'usa', flag: '🇺🇸', name: '미국', sub: 'NCLEX-RN · EN-US', code: 'USA' },
    { id: 'aus', flag: '🇦🇺', name: '호주', sub: 'OBA · EN-AU', code: 'AUS' },
    { id: 'can', flag: '🇨🇦', name: '캐나다', sub: 'NCLEX · EN-CA', code: 'CAN' },
    { id: 'gbr', flag: '🇬🇧', name: '영국', sub: 'NMC · EN-GB', code: 'GBR' },
  ];

  const Ava = ({ p, size = 76, fill }) => window.NbAvatar
    ? (fill
        ? <div style={{ width: '100%', aspectRatio: '64/70', overflow: 'hidden' }}><window.NbAvatar size={size} eyes="dot" mouth="smile" bg="plain" {...p} style={{ width: '100%', height: '100%' }}/></div>
        : <window.NbAvatar size={size} eyes="dot" mouth="smile" bg="plain" {...p}/>)
    : <NbIcon name="me" size={size * 0.6}/>;

  // 랜덤 아바타 조합 — 공용 풀에서 무작위 추출
  const randAva = () => {
    const A = window.NbAvatarAssets;
    if (!A) return AVATARS[0];
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return {
      skin: r(A.skins),
      hair: r(A.hairs.filter(h => h !== 'none')),
      hairColor: r(A.hairColors),
      outfit: r(['scrubV', 'scrubPocket', 'labCoat', 'cardigan', 'tee', 'suit'].filter(o => A.outfits.includes(o))),
      outfitColor: r(A.outfitColors),
    };
  };

  // ID 페이지의 한 칸 — 라벨(모노) + 값/빈칸
  function Field({ label, filled, active, onClick, children, h = 34 }) {
    return (
      <div onClick={onClick} style={{ cursor: filled ? 'pointer' : 'default' }}>
        <div style={{ fontFamily: MONO, fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: c.soft }}>{label}</div>
        <div style={{ minHeight: h, marginTop: 2, borderBottom: `1.6px ${filled ? 'solid' : 'dashed'} ${active ? '#C9A227' : filled ? 'rgba(62,54,43,.5)' : 'rgba(62,54,43,.28)'}`, display: 'flex', alignItems: 'center', background: active ? 'rgba(233,196,90,.14)' : 'transparent', transition: 'background .3s' }}>
          {filled
            ? <div className="nb2-fill" style={{ minWidth: 0 }}>{children}</div>
            : active
              ? <span className="nb2-blink" style={{ fontFamily: HW, fontSize: 15, color: '#C9A227' }}>여기를 채워요 ✎</span>
              : <span style={{ fontFamily: HW, fontSize: 14, color: 'rgba(154,143,124,.55)' }}>—</span>}
        </div>
      </div>
    );
  }

  // 중앙 확대 선택지 오버레이
  function Picker({ title, origin, onSkipHint, children }) {
    return (
      <div className="nb2-dim" style={{ position: 'absolute', inset: 0, background: 'rgba(62,54,43,.28)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 26px' }}>
        <div className="nb2-zoom" style={{ width: '100%', transformOrigin: origin }}>
          <NbPaper rot={-0.4} style={{ padding: '15px 16px 17px', boxShadow: '0 10px 34px rgba(62,54,43,.35)' }}>
            <div style={{ fontFamily: HW, fontSize: 20, color: c.ink }}>{title}</div>
            {children}
            {onSkipHint && <div style={{ fontFamily: HW, fontSize: 12, color: c.soft, marginTop: 10, textAlign: 'center' }}>{onSkipHint}</div>}
          </NbPaper>
        </div>
      </div>
    );
  }

  function OnbFlow2() {
    const [step, setStep] = React.useState(0);          // 0 신분 페이지 · 1 목적지 · 2 닫힘
    const [turning, setTurning] = React.useState(null);
    const [lang, setLang] = React.useState(null);
    const [job, setJob] = React.useState(null);
    const [ava, setAva] = React.useState(null);
    const [avaOpts, setAvaOpts] = React.useState(AVATARS);
    const [name, setName] = React.useState('');
    const [nameDone, setNameDone] = React.useState(false);
    const [picker, setPicker] = React.useState(null);   // 'lang'|'job'|'ava'|'name'|null
    const [dest, setDest] = React.useState(null);
    const [stamping, setStamping] = React.useState(false);
    const fields = [lang, job, ava, nameDone && name.trim()];
    const nextEmpty = fields.findIndex(v => !v);
    const allDone = nextEmpty === -1;
    // 다음 빈칸의 픽커를 자동으로 띄움 (칸 채움 애니메이션 후)
    React.useEffect(() => {
      if (step !== 0 || picker || allDone) return;
      const t = setTimeout(() => setPicker(['lang', 'job', 'ava', 'name'][nextEmpty]), nextEmpty === 0 ? 900 : 620);
      return () => clearTimeout(t);
    }, [picker, nextEmpty, step, allDone]);
    const go = (n) => { setTurning(step); setStep(n); setTimeout(() => setTurning(null), 1320); };
    React.useEffect(() => {
      if (step === 2) { const t = setTimeout(() => { setStep(0); setLang(null); setJob(null); setAva(null); setName(''); setNameDone(false); setDest(null); }, 2300); return () => clearTimeout(t); }
    }, [step]);

    // ── 신분(ID) 페이지 ──
    const pageID = (
      <div className="nb-page" key="q0">
        <Gutter/>
        <div style={{ padding: '16px 24px 0 36px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: 3, color: c.soft }}>PASSPORT · forin</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: c.soft }}>TYPE P</span>
          </div>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, marginTop: 10, lineHeight: 1.25 }}>여권을 발급할게요 —<br/>빈칸을 채워주세요</div>
        </div>
        {/* ID 카드 영역 */}
        <div style={{ margin: '15px 24px 0 36px', border: `1.6px solid rgba(62,54,43,.4)`, background: 'rgba(255,253,244,.6)', padding: '14px 14px 12px', position: 'relative' }}>
          <div style={{ position: 'absolute', right: 10, top: 10, fontFamily: MONO, fontSize: 8, fontWeight: 700, color: 'rgba(154,143,124,.6)', letterSpacing: 1 }}>NO. FR-2026-0901</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {/* 사진 칸 */}
            <div onClick={() => ava && setPicker('ava')} style={{ width: 96, height: 118, border: `1.6px ${ava ? 'solid' : 'dashed'} ${picker === null && nextEmpty === 2 ? '#C9A227' : 'rgba(62,54,43,.4)'}`, background: ava ? '#FDFAF0' : 'rgba(62,54,43,.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: ava ? 'pointer' : 'default' }}>
              {ava
                ? <div className="nb2-fill"><Ava p={ava} size={86}/></div>
                : <React.Fragment>
                    <NbIcon name="me" size={30}/>
                    <div style={{ fontFamily: MONO, fontSize: 7.5, fontWeight: 700, color: c.soft, marginTop: 6, letterSpacing: 1 }}>PHOTO</div>
                  </React.Fragment>}
            </div>
            {/* 오른쪽 필드들 */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field label="NATIVE LANGUAGE · 사용 언어" filled={!!lang} active={!picker && nextEmpty === 0} onClick={() => lang && setPicker('lang')}>
                {lang && <span style={{ fontFamily: HW, fontSize: 18, color: c.ink, whiteSpace: 'nowrap' }}>{lang.flag} {lang.name} <span style={{ fontFamily: MONO, fontSize: 10, color: c.soft }}>{lang.code}</span></span>}
              </Field>
              <Field label="OCCUPATION · 직업" filled={!!job} active={!picker && nextEmpty === 1} onClick={() => job && setPicker('job')}>
                {job && <span style={{ fontFamily: HW, fontSize: 18, color: c.ink, whiteSpace: 'nowrap' }}><NbIcon name={job.icon} size={16}/> {job.name} <span style={{ fontFamily: MONO, fontSize: 10, color: c.soft }}>{job.code}</span></span>}
              </Field>
              <Field label="GIVEN NAME · 이름" filled={!!(nameDone && name.trim())} active={!picker && nextEmpty === 3} onClick={() => nameDone && setPicker('name')}>
                <span style={{ fontFamily: HW, fontSize: 20, color: c.ink, whiteSpace: 'nowrap' }}>{name}</span>
              </Field>
            </div>
          </div>
          {/* MRZ */}
          <div style={{ marginTop: 13, borderTop: `1.3px solid rgba(62,54,43,.25)`, paddingTop: 7, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: 'rgba(62,54,43,.45)', letterSpacing: 1.4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          P{'<'}FRN{(nameDone && name.trim() ? (name.trim().toUpperCase().replace(/[^A-Z]/g, '') || 'LEARNER') : '<<<<<<<')}{'<<'}{(job ? job.code : '<<<')}{'<<<<<<<<'}<br/>
          {(lang ? lang.code : '<<<')}{'2026090<<<<<<<<<<<<<<<<<<<02'}
          </div>
        </div>
        {/* 진행 안내 */}
        <div style={{ padding: '14px 24px 0 36px' }}>
          {allDone
            ? <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>발급 준비 완료!</b> 칸을 누르면 다시 고칠 수 있어요.</NbMemo>
            : <NbMemo rot={0.3}>{['사용하는 언어를 골라요', '직업을 골라요', '여권 사진을 골라요', '이름을 적어요'][nextEmpty]} · {fields.filter(Boolean).length}/4</NbMemo>}
        </div>
        <div style={{ position: 'absolute', left: 36, right: 24, bottom: 34 }}>
          <div onClick={() => allDone && go(1)} style={{ opacity: allDone ? 1 : .45, pointerEvents: allDone ? 'auto' : 'none' }}>
            <NbButton variant="ink" size="lg" full>다음 장 넘기기 ›</NbButton>
          </div>
        </div>
        {/* ── 확대 픽커들 ── */}
        {picker === 'lang' && (
          <Picker title="어떤 언어를 쓰시나요?" origin="75% 22%">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 12 }}>
              {LANGS.map((l, i) => (
                <div key={l.id} onClick={() => { setLang(l); setPicker(null); }} style={{ border: `1.5px solid ${lang && lang.id === l.id ? '#C9A227' : 'rgba(62,54,43,.3)'}`, background: lang && lang.id === l.id ? 'rgba(233,196,90,.14)' : '#FDFAF0', padding: '9px 6px', textAlign: 'center', cursor: 'pointer', transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)` }}>
                  <div style={{ fontSize: 20 }}>{l.flag}</div>
                  <div style={{ fontFamily: HW, fontSize: 15.5, color: c.ink, marginTop: 2, whiteSpace: 'nowrap' }}>{l.name}</div>
                </div>
              ))}
            </div>
          </Picker>
        )}
        {picker === 'job' && (
          <Picker title="어떤 일을 하시나요?" origin="75% 40%">
            <div style={{ marginTop: 6 }}>
              {JOBS.map((j, i) => (
                <div key={j.id} onClick={() => { if (!j.soon) { setJob(j); setPicker(null); } }} style={{ display: 'flex', alignItems: 'center', gap: 11, border: `1.5px solid ${job && job.id === j.id ? '#C9A227' : 'rgba(62,54,43,.3)'}`, background: j.soon ? 'rgba(62,54,43,.04)' : '#FDFAF0', opacity: j.soon ? .55 : 1, padding: '10px 12px', marginTop: 9, cursor: j.soon ? 'default' : 'pointer', transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
                  <NbIcon name={j.icon} size={24}/>
                  <span style={{ fontFamily: HW, fontSize: 17, color: c.ink, flex: 1 }}>{j.name}</span>
                  {j.soon ? <NbTag color={c.soft} rot={2}>준비중</NbTag> : <NbCheck done={!!(job && job.id === j.id)}/>}
                </div>
              ))}
            </div>
          </Picker>
        )}
        {picker === 'ava' && (
          <Picker title="여권 사진을 골라주세요" origin="18% 40%" onSkipHint="나중에 프로필에서 더 자세히 꾸밀 수 있어요">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginTop: 12 }}>
              {avaOpts.map((p, i) => (
                <div key={i} onClick={() => { setAva(p); setPicker(null); }} style={{ border: `1.5px solid ${ava === p ? '#C9A227' : 'rgba(62,54,43,.3)'}`, background: '#FDFAF0', padding: 4, cursor: 'pointer', transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`, lineHeight: 0 }}>
                  <Ava p={p} fill/>
                </div>
              ))}
            </div>
            <div onClick={() => setAvaOpts(Array.from({ length: 6 }, randAva))} style={{ marginTop: 12 }}>
              <NbButton variant="paper" size="md" full><NbIcon name="dice" size={17}/> 다른 사진 뽑기</NbButton>
            </div>
          </Picker>
        )}
        {picker === 'name' && (
          <Picker title="여권에 쓸 이름을 적어주세요" origin="75% 58%" onSkipHint="영문 이름을 권해요 — 명찰에 그대로 새겨져요">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
              <span style={{ fontFamily: HW, fontSize: 16, color: c.soft }}>NAME</span>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { setNameDone(true); setPicker(null); } }} placeholder="예) Minji" maxLength={14} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', borderBottom: '2px solid rgba(62,54,43,.5)', fontFamily: HW, fontSize: 24, color: c.ink, padding: '2px 4px', textAlign: 'center' }}/>
            </div>
            <div onClick={() => { if (name.trim()) { setNameDone(true); setPicker(null); } }} style={{ marginTop: 16, opacity: name.trim() ? 1 : .45, pointerEvents: name.trim() ? 'auto' : 'none' }}>
              <NbButton variant="yellow" size="md" full>이렇게 적을게요 ✎</NbButton>
            </div>
          </Picker>
        )}
      </div>
    );

    // ── 목적지 페이지 (도장 → 출국) ──
    const D = DESTS.find(d => d.id === dest) || DESTS[0];
    const pageDest = (
      <div className="nb-page" key="q1">
        <Gutter/>
        <div style={{ padding: '16px 24px 0 36px' }}>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, lineHeight: 1.25 }}>{name.trim() || 'Learner'} 님,<br/>어디로 떠나나요?</div>
          <div style={{ fontSize: 11.5, color: c.soft, marginTop: 3 }}>목적지에 맞춰 표현·억양·면허 준비가 달라져요</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, padding: '16px 24px 0 36px' }}>
          {DESTS.map((d, i) => (
            <div key={d.id} onClick={() => setDest(d.id)}>
              <NbPaper rot={i % 2 ? 0.5 : -0.5} style={{ padding: '14px 6px 11px', textAlign: 'center', cursor: 'pointer', ...(dest === d.id ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}), ...(dest && dest !== d.id ? { opacity: .7 } : {}) }}>
                <div style={{ fontSize: 25 }}>{d.flag}</div>
                <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 3 }}>{d.name}</div>
                <div style={{ fontSize: 9.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{d.sub}</div>
              </NbPaper>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 24px 0 36px', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {stamping && (
            <div className="nb-stamped" key={dest} style={{ textAlign: 'center' }}>
              <div style={{ width: 108, height: 108, margin: '0 auto', borderRadius: '50%', border: `3.5px double ${c.blue}`, color: c.blue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(241,235,221,.6)' }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2 }}>ADMITTED</div>
                <div style={{ fontFamily: HW, fontSize: 27, lineHeight: 1.05 }}>{D.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, marginTop: 2 }}>SEP 01 2026 · {D.code}</div>
              </div>
              <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 7 }}>쾅! 출국합니다</div>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', left: 36, right: 24, bottom: 34 }}>
          <div onClick={() => { if (!dest || stamping) return; setStamping(true); setTimeout(() => { setStamping(false); setStep(2); }, 1150); }} style={{ opacity: dest ? 1 : .45, pointerEvents: dest ? 'auto' : 'none' }}>
            <NbButton variant="ink" size="lg" full>출국하기 ✈</NbButton>
          </div>
        </div>
      </div>
    );

    const backCover = (
      <div style={{ position: 'absolute', inset: 0, background: '#2E4636' }}>
        <div style={{ position: 'absolute', inset: '26px 22px', border: '1.6px solid rgba(212,180,106,.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', border: '2px solid #D4B46A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="plane" size={40} color="#D4B46A"/>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#D4B46A', marginTop: 20 }}>BON VOYAGE</div>
          <div style={{ fontFamily: HW, fontSize: 19, color: 'rgba(243,230,200,.75)', marginTop: 6 }}>{name.trim() || 'Learner'} 님의 여권이 발급됐어요</div>
        </div>
      </div>
    );
    const pageClosing = (
      <div className="nb-page" key="q2">
        {pageDest}
        <CurlIn>{backCover}</CurlIn>
      </div>
    );

    const pages = [pageID, pageDest, pageClosing];
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.cream, borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="온보딩 여권 발급 플로우">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink, position: 'relative', zIndex: 5 }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          {pages[step]}
          {turning != null && (
            <React.Fragment key={'turn' + turning}>
              <div className="nb-sweep" style={{ zIndex: 11 }}/>
              <CurlOut>{pages[turning]}</CurlOut>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { OnbFlow2 });
})();
