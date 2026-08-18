// Korean — the canonical catalog. Every other locale is measured against this key
// set, and a missing translation falls back to the string here.
//
// Keys are named for MEANING, never for position ("campus.resume", not
// "campus.text1"): a positional key becomes a lie the moment the string moves.
export const ko: Record<string, string> = {
  // ── common ───────────────────────────────────────────────────────────────
  'common.cancel': '취소',
  'common.done': '완료',
  'common.close': '닫기',
  'common.retry': '다시 시도',
  'common.next': '다음',
  'common.start': '시작',
  'common.review': '복습',
  'common.loading': '불러오는 중이에요.',
  'common.streakDays': '{n}일 연속',
  'common.level': 'Lv.{level}',

  // ── settings · language ──────────────────────────────────────────────────
  'settings.language.section': '언어',
  'settings.language.appTitle': '앱 언어',
  'settings.language.appSubOn': '화면에 보이는 말이 {name}로 나와요.',
  'settings.language.pickTitle': '앱 언어 고르기',
  'settings.language.pickNote': '번역이 없는 부분은 한국어로 보여요. 기계번역으로 채우지 않았어요.',
  'settings.language.notReady': '준비 중',
  'settings.language.learning': '배우는 언어',
  'settings.language.learningSub': '{name} · 온보딩에서 고른 나라로 정해져요.',

  // ── sound (the row #16 added) ────────────────────────────────────────────
  'settings.sound.section': '소리',
  'settings.sound.title': '효과음',
  'settings.sound.on': '탭·정답·클리어에 소리가 나요.',
  'settings.sound.off': '모든 효과음이 꺼져 있어요.',

  // ── account ──────────────────────────────────────────────────────────────
  'settings.account.section': '계정',
  'settings.account.signOut': '로그아웃',
  'settings.account.signOutSub': '이 기기에서 로그아웃하고 로그인 화면으로 돌아가요.',

  // ── career tab ───────────────────────────────────────────────────────────
  'campus.title': '커리어',
  'campus.resume': '이어하기',
  'campus.resumeNext': '다음 · {name}',
  'campus.resumePending': '준비 중',
  'campus.allDone': '모든 커리큘럼을 마쳤어요',
  'campus.allDoneSub': '아무 층이나 다시 열어 복습할 수 있어요.',
  'campus.loading': '커리큘럼을 불러오는 중이에요.',
  'campus.exploreTitle': '커리어 탐험 모드',
  'campus.curriculumCount': '커리큘럼 {n}',
  'campus.otherSituations': '이 층의 다른 상황 보기',
  'campus.deptCurricula': '커리큘럼',
  'campus.deptCleared': '해결한 상황',
  'campus.deptSituations': '━ 커리큘럼 밖의 상황 ━━━━',
  'campus.deptEmpty': '지금은 불러올 상황이 없어요.',
  'campus.deptNextSituation': '다음 상황 시작',
  'campus.deptWalk': '걸어보기',
  'campus.loadMore': '더 많은 상황 불러오기',

  // ── step kinds ───────────────────────────────────────────────────────────
  'step.kind.dlg': '대화',
  'step.kind.quiz': '퀴즈',
  'step.kind.event': '돌발 이벤트',
  'step.kind.boss': '챕터 시험',
  'step.optional': '선택',
  'step.now': 'NOW',
};
