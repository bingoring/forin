// A device-local draft of the onboarding answers.
//
// Why this exists: the wizard carried its answers as ROUTE PARAMS and only wrote
// them to the server on the final screen. Close the app after picking a country
// and a job and all of it was gone — three of four steps to redo. The draft is
// written as each step is answered and cleared once the profile is saved.
//
// It is NOT sent to the server step by step: PATCH /me/profile marks the user
// onboarded, so a partial save would skip the rest of the wizard for good.
//
// SecureStore rather than a new dependency: the values are tiny, and the app
// already keeps its keychain helper here. Nothing secret is involved — a draft
// that fails to load is simply an empty draft.
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.onboardingDraft';

export type OnboardingDraft = {
  nativeLang?: string;
  targetLang?: string;
  destination?: string;
  job?: string;
  targetLevel?: string;
  /** The passport name chosen on the v36 ID page, kept so a relaunch mid-issuance does not
   *  lose it. Applied to the profile (display name) at the end, with the other answers. */
  name?: string;
};

export async function loadDraft(): Promise<OnboardingDraft> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : {};
  } catch {
    return {}; // unreadable/corrupt draft must never block onboarding
  }
}

/** Merge-saves the answers gathered so far. */
export async function saveDraft(patch: OnboardingDraft): Promise<void> {
  try {
    const next = { ...(await loadDraft()), ...patch };
    await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  } catch {
    // Best-effort: losing the draft costs a few taps, failing the step costs the user.
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    /* ignore */
  }
}

/** Where a returning user should land.
 *
 *  One destination now: the passport flow is a single screen that holds its own place in
 *  the journey, so there is nothing to resume INTO — it reads the draft and starts at the
 *  first unanswered page itself. The three-route version returned '/locale' | '/job' |
 *  '/level', and those screens are gone. */
export function nextStep(_d: OnboardingDraft): '/passport' {
  return '/passport';
}

/** The page of the passport flow that still needs an answer. */
export function passportStep(d: OnboardingDraft): 'job' | 'dest' | 'level' {
  if (!d.job) return 'job';
  if (!d.destination) return 'dest';
  return 'level';
}
