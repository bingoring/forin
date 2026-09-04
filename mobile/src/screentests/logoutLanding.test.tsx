// Signing out must land on the sign-in surface, not mid-onboarding.
//
// Two defects, both from the passport reopening at the IMMIGRATION desk after a sign-out:
//
//  1. signOut cleared the tokens but not the onboarding DRAFT. The passport resumes a
//     filled draft at the immigration desk (its resume target), so a signed-out user —
//     whose draft was filled during their original sign-up — landed there instead of the
//     cover, which is the actual sign-in surface. 시작하기 there had no session to start.
//  2. The immigration desk uniquely started at the very top of the screen (no TOP_INSET),
//     so its label and the ‹ back button sat under the status bar / notch.
//
// Source guards: signOut clears the draft, and the desk carries the top inset every other
// onboarding page has.
import { readFileSync } from 'fs';
import { join } from 'path';

const AUTH = readFileSync(join(__dirname, '..', 'lib', 'auth.ts'), 'utf8');
const PASSPORT = readFileSync(join(__dirname, '..', 'app', '(onboarding)', 'passport.tsx'), 'utf8');

test('signOut clears the onboarding draft, so the passport reopens on its cover', () => {
  // Without this the passport's mount effect finds a filled draft and jumps to the
  // immigration desk (see passportStep → 'level' → 'immigration').
  const body = AUTH.slice(AUTH.indexOf('export async function signOut'));
  expect(body).toMatch(/clearDraft\(\)/);
  expect(AUTH).toMatch(/import \{ clearDraft \} from '@\/lib\/onboardingDraft'/);
});

test('the immigration desk clears the status bar, like every other onboarding page', () => {
  // The blue officer desk carries TOP_INSET now; before, its label and back button were
  // under the notch. The 시작하기 button stays pinned to the bottom.
  const imm = PASSPORT.slice(PASSPORT.indexOf('function Immigration'));
  expect(imm).toMatch(/marginTop: TOP_INSET, height: 250, backgroundColor: '#CFE3EE'/);
});
