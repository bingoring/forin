// The 모범답안 surfaces, tested for what would silently rot: the strike-through
// that makes a correction a correction, an explanation box that must be absent
// rather than empty, "+ 0개 더", and the list header height the handoff pins the
// scroller to.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { ModelAnswerCardRow } from './ModelAnswerCardRow';
import { ModelAnswerBlock } from './ModelAnswerBlock';
import type { ModelAnswerCard, ModelAnswerGroup } from '@/api/client';

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(node); });
  return tree.root;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

const card = (over: Partial<ModelAnswerCard> = {}): ModelAnswerCard => ({
  said: 'I give you medicine', model: "I'm giving you your medication", note: '진행 중인 행위', createdAt: '', ...over,
});

const group = (over: Partial<ModelAnswerGroup> = {}): ModelAnswerGroup => ({
  scenarioId: 'SCN-ER-00002', title: '흉통 트리아지', corrections: 2, lastAt: '', ...over,
});

// 내 답변 is struck through because it is a thing the learner actually said. If
// that styling is lost the card claims the model answer was their mistake.
test("the learner's own line is struck through and the model answer is not", () => {
  const root = draw(<ModelAnswerCardRow card={card()} />);
  const said = root.findAll((n) => String(n.type) === 'Text' && n.children.includes('I give you medicine'))[0];
  const model = root.findAll((n) => String(n.type) === 'Text' && n.children.includes("I'm giving you your medication"))[0];
  const decoration = (n: ReactTestInstance) => {
    const style = [n.props.style].flat(Infinity).filter(Boolean) as Record<string, unknown>[];
    return style.map((s) => s.textDecorationLine).find(Boolean);
  };
  expect(decoration(said)).toBe('line-through');
  expect(decoration(model)).toBeUndefined();
});

// An explanation box with nothing in it reads as a missing explanation.
test('the 왜? box is absent when there is no note, not empty', () => {
  expect(texts(draw(<ModelAnswerCardRow card={card()} />))).toContain('왜?');
  expect(texts(draw(<ModelAnswerCardRow card={card({ note: '' })} />))).not.toContain('왜?');
  expect(texts(draw(<ModelAnswerCardRow card={card({ note: '   ' })} />))).not.toContain('왜?');
  expect(texts(draw(<ModelAnswerCardRow card={card({ note: undefined })} />))).not.toContain('왜?');
});

// "+ 0개 더" is a row that promises more and delivers nothing.
test('the more-row is omitted at zero', () => {
  const shown = { total: 4, more: 0, groups: [group({ cards: [card()] })] };
  expect(texts(draw(<ModelAnswerBlock summary={shown} onOpenAll={() => {}} />)).some((x) => x.includes('개 더'))).toBe(false);

  const hidden = { total: 12, more: 8, groups: [group({ cards: [card()] })] };
  expect(texts(draw(<ModelAnswerBlock summary={hidden} onOpenAll={() => {}} />))).toContain('+ 8개 더');
});

// A card whose scenario left the served content set still belongs to the player;
// a blank row would look like a bug.
test('a group with no title falls back to its scenario id', () => {
  const out = texts(draw(
    <ModelAnswerBlock
      summary={{ total: 1, more: 0, groups: [group({ title: '', cards: [card()] })] }}
      onOpenAll={() => {}}
    />
  ));
  expect(out).toContain('SCN-ER-00002');
});

// The handoff pins the sticky header at `height: 186` and starts the scroller at the
// same offset. That number is a workaround for a CSS content-box bug — a header with
// padding growing past its declared height and painting over the first row — and RN
// has no such bug. Carried over literally it spent a quarter of the screen on a
// title, a segment and a chip row, and it could not shrink when the chip row was
// absent or grow when it wrapped.
//
// So the rule is now the opposite one: the header must NOT be a fixed height. What
// the handoff was protecting (the first row staying visible) is what a
// content-sized header gives for free.
test('the list header sizes to its content rather than a fixed web height', () => {
  const src = readFileSync(join(__dirname, '..', '..', 'app', 'model-answers', 'index.tsx'), 'utf8');
  // Comments stripped: a comment EXPLAINING that 186 does not port is not a 186.
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  expect(code).not.toMatch(/\bHEADER_H\b/);
  expect(code).not.toMatch(/\b186\b/);
  // The app's own status-bar inset is still respected — every other screen uses 52.
  expect(code).toMatch(/paddingTop: 52/);
});

// Both Review Lab blocks must be on the page BEFORE the player has used the
// feature. Hiding them until there was data is why the tab did not look like the
// handoff on a fresh account — the feature was invisible until after first use.
test('the model-answer block still renders with nothing in it', () => {
  const out = texts(draw(
    <ModelAnswerBlock summary={{ total: 0, more: 0, groups: [] }} onOpenAll={() => {}} />
  ));
  expect(out).toContain('시나리오 모범답안');
  // It explains how to fill it rather than showing "완료한 시나리오 0개".
  expect(out.some((x) => x.includes('완료한 시나리오'))).toBe(false);
  expect(out.some((x) => x.includes('완료하면'))).toBe(true);
  // And offers no entry into an empty list.
  expect(out).not.toContain('전체');
});
