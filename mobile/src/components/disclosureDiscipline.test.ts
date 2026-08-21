// Every disclosure in the app goes through Collapsible.
//
// The building dropdown got the slide first, and for a while it was the only one — every
// other expandable block was still `open && <View/>`, attaching and detaching. A design
// system that one screen follows is not a design system, and the way it stops being one is
// a screen growing its own version, which looks perfectly reasonable in a diff.
//
// Two marks give a disclosure away: a chevron that swaps between up and down, and a block
// rendered behind an open flag. Both belong to Collapsible and DisclosureChevron now.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..');

/**
 * The lift and its doors are excluded: their chevrons point the way the car is TRAVELLING,
 * which is a direction indicator, not a thing that opens.
 */
const NOT_DISCLOSURES = [join('map', 'ElevatorScreen.tsx'), join('map', 'DoorReveal.tsx')];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx') && !p.includes('.test.')) out.push(p);
  }
  return out;
}

test('no screen swaps a chevron to show a section is open', () => {
  const offenders: string[] = [];
  for (const p of walk(SRC)) {
    if (NOT_DISCLOSURES.some((x) => p.endsWith(x))) continue;
    const src = readFileSync(p, 'utf8').replace(/\/\/[^\n]*/g, '');
    // `name={open ? 'chevron-up' : 'chevron-down'}` in either order.
    if (/'chevron-(up|down)'\s*:\s*'chevron-(down|up)'/.test(src)) offenders.push(p.slice(SRC.length + 1));
  }
  expect(offenders).toEqual([]);
});

test('and Collapsible is the only place that animates a height', () => {
  const offenders: string[] = [];
  for (const p of walk(SRC)) {
    if (p.endsWith(join('components', 'Collapsible.tsx'))) continue;
    const src = readFileSync(p, 'utf8');
    // A height built out of an interpolation is an accordion by hand.
    if (/height:\s*[A-Za-z0-9_]*\.?interpolate|height:\s*anim/.test(src)) offenders.push(p.slice(SRC.length + 1));
  }
  expect(offenders).toEqual([]);
});
