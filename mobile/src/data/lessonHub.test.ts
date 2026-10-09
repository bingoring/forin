// lesson-fidelity-v46 T6 — the hub's words built from the lesson response.
import { hubLine, hubSubtitle, xpLabel } from './lessonHub';

describe('hubSubtitle (lesson.jsx L110 `ER · 투약 안전 · 오류 예방 · 3/34`)', () => {
  it('joins department, theme and place', () => {
    expect(hubSubtitle({ dept: 'ER', theme: '환자 안전·오류 예방', index: 3, total: 34 }, 'ER · TRAUMA BAY #4')).toBe('ER · 환자 안전·오류 예방 · 3/34');
  });
  it('drops a missing department', () => {
    expect(hubSubtitle({ theme: '가족 소통', index: 1, total: 5 }, 'x')).toBe('가족 소통 · 1/5');
  });
  it('falls back to the briefing department, then nothing', () => {
    expect(hubSubtitle(undefined, 'ER · TRAUMA BAY #4')).toBe('ER · TRAUMA BAY #4');
    expect(hubSubtitle(undefined, undefined)).toBe('');
  });
});

describe('xpLabel (L131 `+60 XP`)', () => {
  it('spaces the number from XP however it was written', () => {
    expect(xpLabel([{ icon: '⭐', label: '경험치', value: '+ 120 XP' }])).toBe('+120 XP');
    expect(xpLabel([{ icon: '⭐', label: 'XP', value: '+60XP' }])).toBe('+60 XP');
    expect(xpLabel([{ icon: '⭐', label: 'XP', value: '+60 xp' }])).toBe('+60 XP');
  });
  it('is empty without an XP reward', () => {
    expect(xpLabel([{ icon: '🏅', label: '배지', value: '친절' }])).toBe('');
    expect(xpLabel(undefined)).toBe('');
  });
});

describe('hubLine (L126, briefing.line with one [[span]])', () => {
  it('splits around the one span', () => {
    expect(hubLine('— 환자에게 [[왜 확인하는지]] 설명하기')).toEqual({ before: '— 환자에게 ', mark: '왜 확인하는지', after: ' 설명하기' });
  });
  it('is null without a well-formed span', () => {
    expect(hubLine(undefined)).toBeNull();
    expect(hubLine('형광펜 없음')).toBeNull();
    expect(hubLine('[[하나]] [[둘]]')).toBeNull();
    expect(hubLine('[[ ]]')).toBeNull();
  });
});
