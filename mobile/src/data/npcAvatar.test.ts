import { avatarSpecFromSeed } from '@/data/nbAvatar';
import { npcAvatarSpec } from '@/data/npcAvatar';

// The mapping exists so 12 role templates cover hundreds of scenarios. What has to hold:
// the ROLE fixes the uniform, the SEED varies the person, the MOOD sets the face — and
// the three do not step on each other.

test('the role fixes the uniform and its prop', () => {
  expect(npcAvatarSpec('patient', 'anyone').outfit).toBe('hospitalGown');
  expect(npcAvatarSpec('patient', 'anyone').acc).toBe('cannula');
  expect(npcAvatarSpec('doctor', 'anyone')).toMatchObject({ outfit: 'labCoat', acc: 'stetho' });
  expect(npcAvatarSpec('police', 'anyone')).toMatchObject({ outfit: 'security', hat: 'securityCap' });
  const surgeon = npcAvatarSpec('surgeon', 'anyone');
  // Head covered by cap + mask, so nothing is drawn under them.
  expect(surgeon).toMatchObject({ outfit: 'surgGown', hat: 'scrubCap', acc: 'maskOn', hair: 'bald' });
});

test('the same role on two seeds is two different people', () => {
  const a = npcAvatarSpec('patient', 'Mrs. Hopkins|SCN-ER-00002');
  const b = npcAvatarSpec('patient', 'Mr. Diaz|SCN-ER-00007');
  // Same uniform…
  expect(a.outfit).toBe(b.outfit);
  // …different person: the personal axes differ for at least one of them. (Two seeds
  // could collide on one axis; they must not collide on all of them.)
  const personal = (['skin', 'hair', 'hairColor', 'bg', 'outfitColor'] as const);
  expect(personal.some((k) => a[k] !== b[k])).toBe(true);
});

test('the same seed always gives the same face', () => {
  // A patient must not change appearance turn to turn — the seed is stable per NPC.
  expect(npcAvatarSpec('patient', 'Mrs. Hopkins|SCN-ER-00002'))
    .toEqual(npcAvatarSpec('patient', 'Mrs. Hopkins|SCN-ER-00002'));
});

test('the personal axes come from the seed, not the role', () => {
  const seed = 'someone|SCN-ER-00002';
  const person = avatarSpecFromSeed(seed);
  const spec = npcAvatarSpec('doctor', seed);
  // skin / hairColor / bg are the person's, whatever the role is. (hair can be
  // overridden by a role that covers the head — doctor does not, so it too matches.)
  expect(spec.skin).toBe(person.skin);
  expect(spec.hairColor).toBe(person.hairColor);
  expect(spec.bg).toBe(person.bg);
  expect(spec.hair).toBe(person.hair);
});

test('the mood sets the face, over both role and seed', () => {
  const calm = npcAvatarSpec('patient', 'x');
  expect(calm).toMatchObject({ eyes: 'dot', mouth: 'line' }); // resting

  const hurting = npcAvatarSpec('patient', 'x', 'pain');
  expect(hurting).toMatchObject({ eyes: 'weary', mouth: 'pain' });
  // …without disturbing the uniform.
  expect(hurting.outfit).toBe('hospitalGown');
  expect(hurting.acc).toBe('cannula');

  expect(npcAvatarSpec('doctor', 'x', 'angry')).toMatchObject({ eyes: 'angry', mouth: 'clench' });
});

test('neutral leaves the resting face rather than overriding it', () => {
  // dot/line ARE neutral; a "neutral" that set some other eyes would make no-feeling a
  // feeling of its own.
  expect(npcAvatarSpec('nurse', 'x', 'neutral')).toMatchObject({ eyes: 'dot', mouth: 'line' });
});

test('an NPC never wears a random hat or prop the role did not ask for', () => {
  // The seed varies only the personal axes; hat/acc stay 'none' unless the role sets
  // them. A paramedic with a party hat reads as a bug.
  for (let i = 0; i < 100; i++) {
    const medic = npcAvatarSpec('paramedic', `medic-${i}`);
    expect(medic.hat).toBe('none');
    expect(medic.acc).toBe('none');
  }
});
