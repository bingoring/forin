export const NPC_CATEGORIES = ['patient', 'peer', 'doctor'] as const;
export type NPCCategory = (typeof NPC_CATEGORIES)[number];

export interface NPCProfile {
  key: string;
  category: NPCCategory;
  displayName: string;
  defaultTone: 'calm' | 'anxious' | 'casual' | 'formal' | 'busy';
}

// NPC roster is a client-side constant until the cast grows beyond 10–15.
// Migration hook: identical-shape `npcs` DB table + repository. See spec
// docs/superpowers/specs/2026-04-17-exercise-redesign-design.md §6.3.
export const NPCS: Record<string, NPCProfile> = {
  'patient.johnson': { key: 'patient.johnson', category: 'patient', displayName: 'Mr. Johnson',  defaultTone: 'calm' },
  'patient.lee':     { key: 'patient.lee',     category: 'patient', displayName: 'Ms. Lee',      defaultTone: 'anxious' },
  'peer.sarah':      { key: 'peer.sarah',      category: 'peer',    displayName: 'Sarah',        defaultTone: 'calm' },
  'peer.emma':       { key: 'peer.emma',       category: 'peer',    displayName: 'Emma',         defaultTone: 'casual' },
  'doctor.brown':    { key: 'doctor.brown',    category: 'doctor',  displayName: 'Dr. Brown',    defaultTone: 'formal' },
  'doctor.park':     { key: 'doctor.park',     category: 'doctor',  displayName: 'Dr. Park',     defaultTone: 'busy' },
};

export function getNPC(key: string | null | undefined): NPCProfile | null {
  if (!key) return null;
  return NPCS[key] ?? null;
}
