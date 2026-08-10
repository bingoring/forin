import { nextStep } from './onboardingDraft';

// Resume must land on the first UNANSWERED step: sending a returning user back
// to step 1 is exactly the loss this draft exists to prevent.
describe('onboarding resume', () => {
  it('starts at locale when nothing is answered', () => {
    expect(nextStep({})).toBe('/locale');
  });

  it('stays on locale until BOTH language and destination are chosen', () => {
    expect(nextStep({ nativeLang: 'ko' })).toBe('/locale');
    expect(nextStep({ destination: 'us' })).toBe('/locale');
  });

  it('resumes at job once locale is complete', () => {
    expect(nextStep({ nativeLang: 'ko', destination: 'us', targetLang: 'en' })).toBe('/job');
  });

  it('resumes at level once the job is chosen', () => {
    expect(nextStep({ nativeLang: 'ko', destination: 'us', targetLang: 'en', job: 'nurse' })).toBe('/level');
  });
});
