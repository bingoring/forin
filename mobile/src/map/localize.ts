// Localize an interior's display text without touching the fixtures.
//
// The 33 fixture files hold 1,035 distinct Korean strings — room names, door
// labels, hotspot prompts, bay signs. Two things make the usual approach (store a
// key, resolve at render) the wrong one here:
//
//  1. Those fixtures are pixel-verified ports of the design handoff, guarded by
//     per-department tests. Rewriting 1,131 field values into keys is a large edit
//     across exactly the files whose byte-level correctness the suite protects.
//  2. The labels are rendered by ~20 different object components, each drawing its
//     own <Text>. Intercepting at render means touching all of them.
//
// So the Korean string IS the catalog key, and the whole interior is transformed
// once where it is loaded. Fixtures stay untouched, renderers stay untouched, and a
// string with no translation passes through as the authored Korean — the same
// fallback rule the rest of the app follows.
//
// The trade-off is real and worth naming: rewording a Korean label orphans its
// translation. For fixture signage that is rare, and the fallback keeps the screen
// correct rather than empty when it happens.
import type { Interior } from '@engine';
import { mapText } from '@/i18n';

// Field and prop names that hold display text. An allow-list, not a walk of every
// string: `id`, `type`, `kind`, `scenarioId` and friends are protocol values, and
// translating one would break a lookup rather than a label.
const TEXT_KEYS = new Set([
  'name', 'sub', 'label', 'text', 'markerLabel', 'dept', 'procedureLabel', 'procedureSub',
]);

/**
 * A copy of `interior` with its display text in the current UI language.
 *
 * Pure: the input is never mutated, so a fixture module stays reusable across
 * locales and a language change re-derives cleanly.
 */
export function localizeInterior(interior: Interior): Interior {
  return localize(interior) as Interior;
}

function localize(value: unknown): unknown {
  if (typeof value === 'string') return value; // strings are only translated via their key
  if (Array.isArray(value)) return value.map(localize);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = TEXT_KEYS.has(k) && typeof v === 'string' ? mapText(v) : localize(v);
    }
    return out;
  }
  return value;
}
