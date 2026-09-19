// StationSheet — the sheet a station opens into. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3,
// frontend-components.md §2 (StationSheet · StepRow).
//
// This is the ONE legitimate place a lock appears on the journey map. Stations
// themselves never lock (J1 — Station.tsx draws no padlock in any of its four states)
// and free-roam chips never lock (J5) — the difficulty ladder and its steps are the
// only gate in the whole screen, and it lives here.
//
// A dialogue plays twice — once with the guided choices, once alone — and the server
// sends that as TWO entries in `steps` (JourneyStep, one per rung). This file never
// merges them back into one row: doing so would be the same defect the old campus
// sheet had before curriculum v3 split `pass`/`passes` out, just reintroduced here.
//
// `station`/`steps` come straight off the generated contract (Task 8), so every field
// is optional even though the server always fills them in practice — `?.` and a
// default wherever a value is read, and nothing beyond that (over-guarding a field the
// server always sends just hides the read behind noise).
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api, type JourneyStep, type StationDetail } from '@/api/client';
import { BottomSheet } from '@/components/BottomSheet';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, NbProgSquares, NbTag, nbText } from '@/components/nb/NbUI';
import { STEP_META, type StepKind } from '@/data/campus';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';

/** The three rungs of the difficulty ladder, in the fixed order the design calls for
 *  (기초 → 응용 → 위기). `TierCount.difficulty` is how the server tells them apart —
 *  the ARRAY order is not guaranteed, so each row looks its own count up rather than
 *  trusting a position. */
const TIERS: { difficulty: number; labelKey: string }[] = [
  { difficulty: 1, labelKey: 'journey.tierBasic' },
  { difficulty: 2, labelKey: 'journey.tierApplied' },
  { difficulty: 3, labelKey: 'journey.tierCrisis' },
];

function TierRow({ difficulty, labelKey, tiers }: {
  difficulty: number;
  labelKey: string;
  tiers: NonNullable<StationDetail['station']>['tiers'];
}) {
  const t = useT();
  const tier = tiers?.find((x) => x.difficulty === difficulty);
  const total = tier?.total ?? 0;
  const done = tier?.done ?? 0;
  // Unlocked unless the server explicitly says otherwise — an absent tier (no content
  // tagged at this difficulty yet) reads as open, not locked, which matches how an
  // absent `far` station reads on the map (J3).
  const unlocked = tier?.unlocked ?? true;
  return (
    <View
      testID={`tier-row-${difficulty}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, opacity: unlocked ? 1 : 0.4 }}
    >
      <Text numberOfLines={1} style={[nbText.hand(15), { width: 52 }]}>{t(labelKey)}</Text>
      {total > 0 ? (
        <>
          <NbProgSquares done={done} total={total} color={unlocked ? nb.green : nb.soft} />
          <Text style={nbText.body(10, nb.soft)}>{`${done}/${total}`}</Text>
        </>
      ) : (
        <Text style={nbText.body(10, nb.soft)}>—</Text>
      )}
    </View>
  );
}

function StepRow({ step, index, onPress }: { step: JourneyStep; index: number; onPress(): void }) {
  const t = useT();
  const state = step.state ?? '';
  const locked = state === 'lock';
  // Attempted only means anything on the row that is still ahead of you. A done row
  // already cleared it and a locked row has not been offered it — either would
  // contradict a "tried this" badge, so the guard is on STATE, not merely on whether
  // the server happened to set the flag.
  const retry = state === 'now' && !!step.attempted;
  const meta = STEP_META[(step.kind ?? 'dlg') as StepKind] ?? STEP_META.dlg;
  const rung = !!step.passes && step.passes > 1;

  return (
    <Pressable
      testID={`step-row-${index}`}
      disabled={locked}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 8, paddingHorizontal: 10,
        borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.14)', borderStyle: 'dashed',
        backgroundColor: retry ? 'rgba(143,199,232,.22)' : 'transparent',
        opacity: locked ? 0.45 : 1,
      }}
    >
      {/* The lock REPLACES the step's own icon rather than sitting beside it — the same
          call DeptSheet already made, and the row is wide enough without a second glyph. */}
      {locked ? (
        <View testID="step-lock"><NbIcon name="lock" size={16} /></View>
      ) : (
        <NbIcon name={meta.nbIcon} size={16} />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[nbText.hand(15.5), { lineHeight: 17 }]}>{step.name ?? ''}</Text>
        <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 1.5 }]}>
          {t(meta.labelKey)}
          {rung ? ` · ${t(step.guide === 'choices' ? 'step.guided' : 'step.solo')}` : ''}
          {step.optional ? ` · ${t('step.optional')}` : ''}
        </Text>
      </View>
      {/* Its own Text node, separate from the kind/guide line above — "1/2" is what tells
          the two rungs of the same dialogue apart at a glance. */}
      {rung && <Text style={nbText.mono(10.5, nb.soft)}>{`${step.pass ?? 1}/${step.passes}`}</Text>}
      {state === 'now' && (
        <NbTag color={retry ? nb.blue : nb.ink}>{t(retry ? 'step.retry' : 'step.now')}</NbTag>
      )}
    </Pressable>
  );
}

/** A placeholder row shaped like a StepRow, so opening the sheet never shows a blank
 *  gap while the network round-trip is in flight (frontend-components.md §4 — "시트는
 *  즉시 열고 행 자리에 스켈레톤을 둔다": a sheet that waits to open reads as a tap that
 *  did not register). */
function SkeletonRow({ rot }: { rot: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10 }}>
      <View style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: nb.paperEdge, transform: [{ rotate: `${rot}deg` }] }} />
      <View style={{ flex: 1, height: 12, borderRadius: 3, backgroundColor: nb.paperEdge }} />
    </View>
  );
}

export function StationSheet({ themeKey, onClose, onStepPress }: {
  themeKey: string;
  onClose(): void;
  onStepPress(step: JourneyStep): void;
}) {
  const t = useT();
  const [detail, setDetail] = useState<StationDetail | null>(null);

  useEffect(() => {
    let alive = true;
    setDetail(null); // back to the skeleton immediately — themeKey changing is a new station
    api.station(themeKey)
      .then((d) => { if (alive) setDetail(d); })
      .catch(() => {}); // an unknown theme 404s (Task 8); the sheet just stays on its skeleton
    return () => { alive = false; };
  }, [themeKey]);

  const station = detail?.station;
  const steps = detail?.steps ?? [];
  const name = station?.name ?? themeKey;
  const done = station?.done ?? 0;
  const total = station?.total ?? 0;
  const track = station?.track;

  return (
    <BottomSheet
      visible
      overlay
      size="tall"
      onClose={onClose}
      header={
        <View style={{ paddingTop: 2, paddingHorizontal: 20, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text numberOfLines={1} style={[nbText.hand(22), { flex: 1, lineHeight: 24 }]}>{name}</Text>
            {!!track && <NbTag rot={-1}>{t(`journey.track.${track}`)}</NbTag>}
          </View>
          {total > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <NbProgSquares done={done} total={total} />
              <Text style={nbText.body(10, nb.soft)}>{`${done}/${total}`}</Text>
            </View>
          )}
        </View>
      }
    >
      <View style={{ paddingHorizontal: 14, paddingBottom: 24 }}>
        {!detail ? (
          <View testID="station-sheet-skeleton">
            {[-0.4, 0.3, -0.2].map((rot, i) => <SkeletonRow key={i} rot={rot} />)}
          </View>
        ) : (
          <>
            <NbPaper rot={-0.3} style={{ paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10 }}>
              {TIERS.map(({ difficulty, labelKey }) => (
                <TierRow key={difficulty} difficulty={difficulty} labelKey={labelKey} tiers={station?.tiers} />
              ))}
            </NbPaper>
            <NbPaper rot={0.2}>
              {steps.map((s, i) => (
                <StepRow key={`${s.scenarioId ?? s.name ?? i}-${s.pass ?? i}`} step={s} index={i} onPress={() => onStepPress(s)} />
              ))}
            </NbPaper>
          </>
        )}
      </View>
    </BottomSheet>
  );
}
