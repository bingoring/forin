// The binder cover — journey-binder-v42 Task I, task-I-brief.md §3.
//
// This is deliberately a bigger drawing of the exact same binder the learner just pressed
// on the shelf (`BinderShelf.tsx`'s `Binder`) — same spine colour, same code+name label,
// same doodle, same shape of progress bar — so the book they see fly toward them reads as
// the one they touched, not a generic placeholder that happens to share a dept code.
//
// It only ever shows the TOPIC progress already loaded for this screen (`done`/`total`
// over topics, same counting `BinderShelf.tsx`'s `isTopicDone` uses) — never the shelf's
// own `passed`/`total` numbers, which this screen never receives (the fly-in hand-off is
// a rect, not a progress snapshot; task-I-brief.md §2 names exactly what crosses that
// hand-off, and progress is not on the list). Before `api.journey(dept)` resolves that is
// 0/0 — an empty bar, not a guess — and it fills in live if the response lands while the
// cover is still on screen (§2 point 4: the request never waits on the animation).
import { Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import { deptNbIcon, deptSpineColor } from '@/data/campus';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

const SPINE_W = 46;
const INNER_PAD = 22;

export function BinderCoverFace({ dept, doneTopics, totalTopics }: {
  dept: string;
  doneTopics: number;
  totalTopics: number;
}) {
  const t = useT();
  const spine = deptSpineColor(dept);
  const pct = totalTopics > 0 ? Math.min(100, Math.max(0, (doneTopics / totalTopics) * 100)) : 0;

  return (
    <View
      testID="binder-cover-face"
      style={{
        flex: 1, backgroundColor: nb.paper, borderWidth: 1.6, borderColor: nb.ink,
        borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
        borderTopRightRadius: 6, borderBottomRightRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* 왼쪽 색 등 — 서가의 바인더와 같은 색(§3), 화면 크기에 맞춰 46px. */}
      <View
        testID="binder-cover-spine"
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: SPINE_W,
          backgroundColor: spine, borderRightWidth: 1.4, borderRightColor: nb.ink,
        }}
      />

      <View style={{ flex: 1, paddingLeft: SPINE_W + INNER_PAD, paddingRight: INNER_PAD, paddingTop: '16%', alignItems: 'center' }}>
        {/* 가운데 위 흰 라벨 카드 — 부서 코드(mono) + 짧은 이름(hand). */}
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: nb.paperEdge, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' }}>
          <Text testID="binder-cover-code" style={{ fontFamily: nbFonts.monoBold, fontSize: 22, color: nb.ink, letterSpacing: 2 }}>
            {dept}
          </Text>
          <Text testID="binder-cover-name" style={[nbText.hand(26), { marginTop: 4 }]}>
            {t(`dept.short.${dept}`)}
          </Text>
        </View>

        {/* 큰 부서 두들. */}
        <View style={{ marginTop: '14%' }}>
          <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={120} />
        </View>

        <View style={{ flex: 1 }} />

        {/* 아래쪽 진행 바 — 서가 바인더와 같은 모양(border 1.2 · radius 2), 높이만 9. */}
        <View
          testID="binder-cover-progress"
          style={{ alignSelf: 'stretch', height: 9, borderWidth: 1.2, borderColor: nb.ink, borderRadius: 2, overflow: 'hidden', marginBottom: '10%' }}
        >
          {pct > 0 && <View style={{ width: `${pct}%`, height: '100%', backgroundColor: spine }} />}
        </View>
      </View>
    </View>
  );
}
