// State-transition tests for the pronunciation loop route. The diagram this
// mirrors is business-logic-model.md §3 (docs/dlc/projects/forin/
// 02-construction/pronunciation); the three tests task-8-brief.md specifies
// verbatim come first, the rest round out full transition coverage.
import { next } from './pronState';

describe('scoring is terminal (no cancel once the request is in flight)', () => {
  test('scoring 에서는 취소가 없다', () => {
    expect(next('scoring', { type: 'CANCEL' })).toBe('scoring');
  });
});

describe('no-speech routes to its own banner state, not silently to idle', () => {
  test('무음 응답은 idle 로 돌아가되 안내를 남긴다', () => {
    expect(next('scoring', { type: 'NO_SPEECH' })).toBe('noSpeech');
  });

  test('서버 5xx 도 같은 안내 화면으로 보낸다', () => {
    expect(next('scoring', { type: 'ERROR' })).toBe('noSpeech');
  });
});

describe('recording auto-stops at 10s (business-rules R6)', () => {
  test('10초가 차면 스스로 채점으로 넘어간다', () => {
    expect(next('recording', { type: 'TIMEOUT' })).toBe('scoring');
  });

  test('정지 버튼을 눌러도 채점으로 넘어간다', () => {
    expect(next('recording', { type: 'STOP' })).toBe('scoring');
  });
});

describe('recording can still be cancelled before upload starts', () => {
  test('녹음 중 취소는 대기 화면으로 돌아간다', () => {
    expect(next('recording', { type: 'CANCEL' })).toBe('idle');
  });
});

describe('scoring succeeds into result', () => {
  test('채점 성공은 결과 화면으로 넘어간다', () => {
    expect(next('scoring', { type: 'SUCCESS' })).toBe('result');
  });
});

describe('result actions', () => {
  test('다시 녹음은 녹음 상태로 돌아간다(다음 시도 번호는 호출자가 채번)', () => {
    expect(next('result', { type: 'RETRY' })).toBe('recording');
  });

  test('다음 문장은 대기 화면(새 sentenceKey)으로 넘어간다', () => {
    expect(next('result', { type: 'NEXT' })).toBe('idle');
  });

  // 리뷰 지적: 재녹음은 매번 마이크 권한을 다시 확인해야 한다(첫 녹음 이후
  // 설정에서 권한이 회수됐을 수 있다) — 거부되면 idle과 같은 권한 안내로.
  test('다시 녹음 중 권한이 거부되면 권한 안내로 간다', () => {
    expect(next('result', { type: 'MIC_DENIED' })).toBe('permissionDenied');
  });
});

describe('microphone permission', () => {
  test('권한이 없으면 안내 화면으로 간다', () => {
    expect(next('idle', { type: 'MIC_DENIED' })).toBe('permissionDenied');
  });

  test('무음 배너에서도 녹음을 다시 시도하다 권한이 없으면 같은 안내로 간다', () => {
    expect(next('noSpeech', { type: 'MIC_DENIED' })).toBe('permissionDenied');
  });

  test('권한을 허용하면 대기 화면으로 돌아간다 — 바로 녹음을 시작하지 않는다', () => {
    expect(next('permissionDenied', { type: 'PERMISSION_GRANTED' })).toBe('idle');
  });
});

describe('noSpeech banner behaves like idle for starting a new recording', () => {
  test('무음 안내 화면에서 녹음을 다시 시작할 수 있다', () => {
    expect(next('noSpeech', { type: 'START_RECORDING' })).toBe('recording');
  });

  test('배너를 닫으면 대기 화면으로 돌아간다', () => {
    expect(next('noSpeech', { type: 'DISMISS' })).toBe('idle');
  });
});

describe('undefined transitions are no-ops, not crashes', () => {
  test('대기 화면에서 취소는 아무 일도 하지 않는다', () => {
    expect(next('idle', { type: 'CANCEL' })).toBe('idle');
  });

  test('권한 안내 화면에서 정지를 눌러도 그대로다', () => {
    expect(next('permissionDenied', { type: 'STOP' })).toBe('permissionDenied');
  });

  test('결과 화면에서 타임아웃은 그대로다', () => {
    expect(next('result', { type: 'TIMEOUT' })).toBe('result');
  });
});
