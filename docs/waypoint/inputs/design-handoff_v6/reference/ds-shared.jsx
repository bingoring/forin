// ds-shared.jsx — Design System catalog helpers + unified Forin namespace.
//
// This file is the SOURCE OF TRUTH for forin's design API.
// It collects every token, primitive, character, and object into a single
// `window.Forin` namespace so the actual app code can pull from one place:
//
//   const { Bed, Monitor, tokens } = window.Forin;
//   <Bed variant="ward" occupied/>  ...
//
// It also defines the visual-catalog primitives used by the ⓪ Design System
// section in the design canvas (DSPage, DSSection, DSCard, DSSwatch, etc.).
//
// NOTE: Nothing here mutates existing component implementations. We only
// AGGREGATE and DOCUMENT. App design remains pixel-identical.

(function () {
  // ─── 1. Unified Forin namespace ────────────────────────────────────
  // Built lazily so it picks up components no matter their load order.
  function buildForin() {
    return {
      // ── Tokens ──────────────────────────────────────────────────
      tokens: window.ForinTokens,
      interior: window.IP,                 // interior-specific palette
      cabinetVariants: window.CABINET_VARIANTS,
      ITILE: window.ITILE,
      ZOOM: window.ZOOM,
      // helpers
      darken: window.darkenHex,
      lighten: window.lightenHex,

      // ── Primitives (forin-ui.jsx) ──────────────────────────────
      Box:       window.PixelBox,
      Button:    window.PixelButton,
      IconButton: window.PixelIconButton,
      DPad:      window.PixelDPad,
      Chip:      window.PixelChip,
      StatBar:   window.StatBar,
      StatTile:  window.StatTile,
      MiniStat:  window.MiniStat,
      BadgeTile: window.BadgeTile,
      Highlight: window.Highlight,
      Badge:     window.Badge,
      Pips:      window.Pips,
      FilterTab: window.FilterTab,
      PathStepper: window.PathStepper,
      gridBg:    window.pixelGridBg,

      // ── Icons & flags ──────────────────────────────────────────
      Heart:     window.PixelHeart,
      Star:      window.PixelStar,
      FlagUS:    window.FlagUS,
      FlagKR:    window.FlagKR,
      FlagJP:    window.FlagJP,
      FlagDE:    window.FlagDE,
      Flag:      window.PixelFlag,

      // ── App chrome ─────────────────────────────────────────────
      TopBar:    window.ForinTopBar,
      BottomNav: window.ForinBottomNav,
      Phone:     window.IOSDevice,         // device frame wrapper

      // ── Characters ─────────────────────────────────────────────
      Sprite:        window.RPGSprite,
      Player:        window.ChibiPlayer,
      Nurse:         window.ChibiNurse,
      Doctor:        window.ChibiDoctor,
      Surgeon:       window.ChibiSurgeon,
      Paramedic:     window.ChibiParamedic,
      Police:        window.ChibiPolice,
      Patient:       window.ChibiPatient,
      Child:         window.ChibiChild,
      Parent:        window.ChibiParent,
      Visitor:       window.ChibiVisitor,
      Pharmacist:    window.ChibiPharmacist,
      Npc:           window.INpc,           // tile-placed wrapper
      NpcV2:         window.INpcV2,
      // Smooth (non-pixel) character variants
      SmoothSprite:     window.SmoothSprite,
      SmoothPlayer:     window.SmoothPlayer,
      SmoothNurse:      window.SmoothNurse,
      SmoothDoctor:     window.SmoothDoctor,
      SmoothSurgeon:    window.SmoothSurgeon,
      SmoothParamedic:  window.SmoothParamedic,
      SmoothPolice:     window.SmoothPolice,
      SmoothPatient:    window.SmoothPatient,
      SmoothChild:      window.SmoothChild,
      SmoothParent:     window.SmoothParent,
      SmoothVisitor:    window.SmoothVisitor,
      SmoothPharmacist: window.SmoothPharmacist,
      SmoothNpc:        window.SmoothNpc,
      // Derp (하찮은) character variants
      DerpPlayer:       window.DerpPlayer,
      DerpNurse:        window.DerpNurse,
      DerpDoctor:       window.DerpDoctor,
      DerpSurgeon:      window.DerpSurgeon,
      DerpParamedic:    window.DerpParamedic,
      DerpPolice:       window.DerpPolice,
      DerpPatient:      window.DerpPatient,
      DerpChild:        window.DerpChild,
      DerpParent:       window.DerpParent,
      DerpVisitor:      window.DerpVisitor,
      DerpPharmacist:   window.DerpPharmacist,
      // Legacy big-sprite characters (still used in some splash/onboarding)
      LegacyNurse:   window.PixelNurse,
      LegacyPatient: window.PixelPatient,

      // ── Faces (high-res portraits with expressions) ────────────
      Face:            window.Face,
      FacePlayer:      window.FacePlayer,
      FaceNurse:       window.FaceNurse,
      FaceDoctor:      window.FaceDoctor,
      FaceSurgeon:     window.FaceSurgeon,
      FaceParamedic:   window.FaceParamedic,
      FacePolice:      window.FacePolice,
      FacePatient:     window.FacePatient,
      FaceChild:       window.FaceChild,
      FaceParent:      window.FaceParent,
      FaceVisitor:     window.FaceVisitor,
      FacePharmacist:  window.FacePharmacist,
      expressions:     window.FORIN_EXPRESSIONS,

      // ── Map atoms (interior-shared.jsx) ────────────────────────
      Floor:    window.IFloor,
      Wall:     window.IWall,
      Glass:    window.IGlass,
      Door:     window.IDoor,
      Curtain:  window.ICurtain,
      Plant:    window.IPlant,
      Hotspot:  window.IHotspot,

      // ── Furniture (interior-shared.jsx) ────────────────────────
      Bed:        window.IBed,
      Reception:  window.IReception,
      Monitor:    window.IMonitor,
      IV:         window.IIV,
      Chair:      window.IChair,
      Cabinet:    window.ICabinet,

      // ── ER equipment (interior-objects-er.jsx) ─────────────────
      Gurney:          window.Gurney,
      Defib:           window.Defib,
      OxygenTank:      window.OxygenTank,
      GloveDispenser:  window.GloveDispenser,
      SharpsContainer: window.SharpsContainer,
      HandSanitizer:   window.HandSanitizer,
      EKG:             window.EKG,
      CompCart:        window.CompCart,
      Whiteboard:      window.Whiteboard,
      Scale:           window.Scale,
      BPCuff:          window.BPCuff,
      SuctionUnit:     window.SuctionUnit,
      Wheelchair:      window.Wheelchair,
      Sink:            window.Sink,        // last-defined sink (OR scrub) — see OR helpers
      BayLabel:        window.BayLabel,
      XrayMachine:     window.XrayMachine,

      // ── OR-specific ────────────────────────────────────────────
      SinkOR:            window.SinkOR,
      SurgicalLight:     window.SurgicalLight,
      AnesthesiaMachine: window.AnesthesiaMachine,
      InstrumentTray:    window.InstrumentTray,
      StatusBoard:       window.StatusBoard,

      // ── ICU-specific ───────────────────────────────────────────
      Ventilator:     window.Ventilator,
      BankOfMonitors: window.BankOfMonitors,
      CrashCart:      window.CrashCart,
      CoffeeMachine:  window.CoffeeMachine,
      PyxisMachine:   window.PyxisMachine,

      // ── Peds-specific ──────────────────────────────────────────
      PedsBed:        window.PedsBed,
      Balloon:        window.Balloon,
      Mural:          window.Mural,
      ToyChest:       window.ToyChest,
      Blocks:         window.Blocks,
      SmallSlide:     window.SmallSlide,
      RockingHorse:   window.RockingHorse,
      FridgePeds:     window.FridgePeds,

      // ── Pharma-specific ────────────────────────────────────────
      PharmaCounter:  window.PharmaCounter,
      CounterSign:    window.CounterSign,
      Kiosk:          window.Kiosk,
      QueueRope:      window.QueueRope,
      ShelfLabel:     window.ShelfLabel,
      CountingBench:  window.CountingBench,
      CSSafe:         window.CSSafe,
      MedCart:        window.MedCart,
      LaminarHood:    window.LaminarHood,
      Centrifuge:     window.Centrifuge,
      PrintLabel:     window.PrintLabel,
      WallPhone:      window.WallPhone,
      FloorTape:      window.FloorTape,
      FridgePharma:   window.FridgePharma,

      // ── Clinic departments (signature props) ───────────────────
      UltrasoundCart: window.UltrasoundCart,
      XrayViewbox:    window.XrayViewbox,
      CastCart:       window.CastCart,
      Crutches:       window.Crutches,
      DermLamp:       window.DermLamp,
      LaserUnit:      window.LaserUnit,
      ExamStool:      window.ExamStool,
      SkincareShelf:  window.SkincareShelf,
      BoneModel:      window.BoneModel,
      ClinicReception: window.ClinicReception,
      ClinicInterior: window.ClinicInterior,

      // ── Screen wrappers ────────────────────────────────────────
      InteriorScreen: window.InteriorScreen,
    };
  }

  // Build immediately (DS files load after all interior files) and re-export
  // whenever someone reads Forin (so late-arriving globals are picked up).
  window.Forin = new Proxy({}, {
    get(_, key) {
      const F = buildForin();
      return F[key];
    },
    has(_, key) {
      const F = buildForin();
      return key in F;
    },
    ownKeys() {
      return Object.keys(buildForin());
    },
    getOwnPropertyDescriptor(_, key) {
      return { enumerable: true, configurable: true, value: buildForin()[key] };
    },
  });

  // ─── 2. Catalog page chrome ────────────────────────────────────────
  const ink  = '#2A2522';
  const paper = '#FFF8E7';
  const cream = '#FFFBF0';
  const card  = '#FFFFFF';
  const accent = '#A7F3D0';
  const accentDeep = '#4FC79D';

  // DSPage — outer wrapper for a design-system artboard
  function DSPage({ title, subtitle, accent: a = accent, children, scroll = true }) {
    return (
      <div data-screen-label={title} style={{
        height: '100%', width: '100%',
        background: paper,
        backgroundImage: `radial-gradient(rgba(42,37,34,0.06) 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
        overflow: scroll ? 'auto' : 'hidden',
        position: 'relative',
        fontFamily: '"Galmuri11","DungGeunMo",monospace', color: ink,
      }}>
        {/* Top banner */}
        <div style={{
          padding: '22px 26px 16px',
          background: a,
          borderBottom: `4px solid ${ink}`,
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: '"DungGeunMo",monospace', fontSize: 10,
              color: ink, opacity: 0.7, letterSpacing: 2,
            }}>FORIN · DESIGN SYSTEM</div>
            <div style={{
              fontFamily: '"DungGeunMo",monospace', fontSize: 22,
              color: ink, lineHeight: 1.15, marginTop: 4,
            }}>{title}</div>
            {subtitle && (
              <div style={{
                fontFamily: '"Galmuri11",monospace', fontSize: 12,
                color: ink, marginTop: 6, opacity: 0.8, maxWidth: 600,
              }}>{subtitle}</div>
            )}
          </div>
          <div style={{
            background: ink, color: '#fff', padding: '4px 10px',
            fontFamily: '"DungGeunMo",monospace', fontSize: 11,
            boxShadow: `2px 2px 0 0 ${a}, 2px 2px 0 2px ${ink}`,
          }}>v1.0</div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 26px 80px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {children}
        </div>
      </div>
    );
  }

  // DSSection — grouped block within a page
  function DSSection({ title, hint, children, bg = card, noPad }) {
    return (
      <section style={{
        background: bg, border: `3px solid ${ink}`,
        boxShadow: `5px 5px 0 0 ${ink}`,
      }}>
        {/* section header */}
        <div style={{
          padding: '10px 14px',
          borderBottom: `2.5px solid ${ink}`,
          background: cream,
          display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: ink }}>
            {title}
          </div>
          {hint && (
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: ink, opacity: 0.7 }}>
              {hint}
            </div>
          )}
        </div>
        {/* section body */}
        <div style={{ padding: noPad ? 0 : 16 }}>{children}</div>
      </section>
    );
  }

  // DSGrid — responsive grid for cards
  function DSGrid({ cols = 4, gap = 14, children, minItem = 120 }) {
    return (
      <div style={{
        display: 'grid', gap,
        gridTemplateColumns: minItem
          ? `repeat(auto-fill, minmax(${minItem}px, 1fr))`
          : `repeat(${cols}, 1fr)`,
      }}>{children}</div>
    );
  }

  // DSRow — horizontal scroller (for long sample lists)
  function DSRow({ gap = 16, children, align = 'flex-end' }) {
    return (
      <div style={{
        display: 'flex', gap, alignItems: align, flexWrap: 'wrap',
      }}>{children}</div>
    );
  }

  // DSCard — one component sample (preview + label + code)
  function DSCard({ name, sub, code, children, bg = cream, previewH = 96, previewW }) {
    return (
      <div style={{
        background: bg, border: `2px solid ${ink}`,
        boxShadow: `3px 3px 0 0 ${ink}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* preview */}
        <div style={{
          height: previewH,
          width: previewW || 'auto',
          background: '#fff',
          borderBottom: `1.5px solid ${ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
                            linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%),
                            linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%)`,
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
        }}>
          {children}
        </div>
        {/* label */}
        <div style={{ padding: '6px 8px' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: ink, lineHeight: 1.2 }}>
            {name}
          </div>
          {sub && (
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: ink, opacity: 0.65, marginTop: 2 }}>
              {sub}
            </div>
          )}
          {code && (
            <pre style={{
              margin: '6px 0 0', padding: '4px 6px',
              background: ink, color: '#A7F3D0',
              fontFamily: '"DungGeunMo",monospace', fontSize: 9, lineHeight: 1.3,
              border: 0, overflow: 'auto', whiteSpace: 'pre-wrap',
            }}>{code}</pre>
          )}
        </div>
      </div>
    );
  }

  // DSSwatch — color chip for tokens
  function DSSwatch({ name, hex, sub }) {
    return (
      <div style={{
        border: `2px solid ${ink}`,
        boxShadow: `3px 3px 0 0 ${ink}`,
        background: '#fff',
        overflow: 'hidden',
      }}>
        <div style={{ background: hex, height: 56, borderBottom: `1.5px solid ${ink}` }}/>
        <div style={{ padding: '4px 6px' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: ink }}>
            {name}
          </div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: ink, opacity: 0.65 }}>
            {hex.toUpperCase()}
          </div>
          {sub && (
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8, color: ink, opacity: 0.6 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    );
  }

  // DSCode — display a single code line
  function DSCode({ children }) {
    return (
      <code style={{
        display: 'inline-block', padding: '2px 6px', background: ink,
        color: '#A7F3D0', fontFamily: '"DungGeunMo",monospace',
        fontSize: 10, borderRadius: 0,
      }}>{children}</code>
    );
  }

  // DSTypeSpec — show a single type spec sample
  function DSTypeSpec({ family, size, weight = 400, sample, sub }) {
    return (
      <div style={{
        background: card, border: `2px solid ${ink}`,
        boxShadow: `3px 3px 0 0 ${ink}`,
        padding: '10px 12px',
      }}>
        <div style={{ fontFamily: family, fontSize: size, fontWeight: weight, color: ink, lineHeight: 1.2 }}>
          {sample || '응급실 · 통증 사정 ABC'}
        </div>
        <div style={{
          fontFamily: '"DungGeunMo",monospace', fontSize: 9,
          color: ink, opacity: 0.7, marginTop: 6,
          display: 'flex', gap: 10, flexWrap: 'wrap',
        }}>
          <span>{family.replace(/"/g, '')}</span>
          <span>·</span>
          <span>{size}px</span>
          {weight !== 400 && <><span>·</span><span>{weight}</span></>}
          {sub && <><span>·</span><span style={{ opacity: 0.7 }}>{sub}</span></>}
        </div>
      </div>
    );
  }

  // DSTileFrame — wraps a tile-positioned component (which uses absolute +
  // x*ITILE coordinates) so its origin is in the catalog card.
  function DSTileFrame({ width = 96, height = 96, children, scale = 1, padTop = 0 }) {
    return (
      <div style={{ width, height, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translateY(${padTop}px) scale(${scale})`,
        }}>
          {/* Inner positioning frame — provides the origin for x*ITILE,y*ITILE children */}
          <div style={{ position: 'relative', width: 1, height: 1 }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // DSChibiCard — special card for showing a character sprite at a comfortable size
  function DSChibiCard({ name, sub, children, bg = '#fff' }) {
    return (
      <div style={{
        background: bg, border: `2px solid ${ink}`,
        boxShadow: `3px 3px 0 0 ${ink}`,
        padding: '12px 6px 6px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          height: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>{children}</div>
        <div style={{
          fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: ink,
          lineHeight: 1.2, textAlign: 'center', minHeight: 12,
        }}>{name}</div>
        {sub && (
          <div style={{
            fontFamily: '"Galmuri11",monospace', fontSize: 8, color: ink, opacity: 0.6,
            textAlign: 'center',
          }}>{sub}</div>
        )}
      </div>
    );
  }

  // DSLegend — key/value list inside a section
  function DSLegend({ items }) {
    return (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px 16px',
        fontFamily: '"Galmuri11",monospace', fontSize: 11, color: ink,
      }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, background: it.color, border: `1px solid ${ink}` }}/>
            <span>{it.label}</span>
            {it.hex && (
              <span style={{ opacity: 0.5, fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>
                {it.hex.toUpperCase()}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  Object.assign(window, {
    DSPage, DSSection, DSGrid, DSRow, DSCard, DSSwatch, DSCode,
    DSTypeSpec, DSTileFrame, DSChibiCard, DSLegend,
  });
})();
