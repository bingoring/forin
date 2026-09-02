import { nextStep, passportStep } from './onboardingDraft';

// Resume must land on the first UNANSWERED question: sending a returning user back to the
// beginning is exactly the loss this draft exists to prevent.
//
// The three-route wizard became one screen — the passport flow — so the resume target is
// no longer a route but a PAGE inside it. `nextStep` still exists because the entry gate
// asks it where to go; the interesting function is now `passportStep`.
describe('onboarding resume', () => {
  it('sends an unfinished onboarding to the passport flow', () => {
    expect(nextStep({})).toBe('/passport');
    expect(nextStep({ job: 'nurse', destination: 'us' })).toBe('/passport');
  });

  it('opens the passport at the first unanswered page', () => {
    expect(passportStep({})).toBe('job');
    expect(passportStep({ job: 'nurse' })).toBe('dest');
    expect(passportStep({ job: 'nurse', destination: 'us' })).toBe('level');
  });

  it('does not skip a page just because a later one is answered', () => {
    // A draft can hold a level with no job when a country was withdrawn and the answer
    // cleared. Reading the LAST answer would open the immigration desk with no job to
    // stamp; the flow has to go back for the one that is missing.
    expect(passportStep({ targetLevel: 'B1' })).toBe('job');
    expect(passportStep({ job: 'nurse', targetLevel: 'B1' })).toBe('dest');
  });
});
