// Interior signage, keyed by the authored Korean (see map/localize.ts).
//
// Only the navigation labels are filled in. The clinical signage of 본관 1F is in
// map_en.ts because English is what a US-bound learner reads on those signs; for a
// Japanese or German interface the ward names still need a native-speaker pass, and
// guessing them would be exactly the machine-translated filler this feature was told
// not to produce. Untranslated keys fall through to the authored Korean.
export const mapDe: Record<string, string> = {
  '← 엘리베이터': '← Aufzug',
  '↓ 커리어로': '↓ Zur Karriere',
  '← 커리어로': '← Zur Karriere',
  '→ 복도': '→ Flur',
  '진료': 'Behandlung',
  '접수': 'Anmeldung',
  '접수·대기': 'Anmeldung · Warten',
  '간호 스테이션': 'Pflegestützpunkt',
  '중앙 간호 스테이션': 'Zentraler Pflegestützpunkt',
  '진료실 1': 'Behandlungsraum 1',
  '진료실 2': 'Behandlungsraum 2',
  '대기실': 'Wartezimmer',
  '등록': 'Registrierung',
};
