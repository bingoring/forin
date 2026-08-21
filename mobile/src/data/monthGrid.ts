// A month as WEEKS, not as a run of cells that wraps.
//
// The grid used to be one flex row with `flexWrap` and cells of `${100/7}%`. Seven of
// those is 100% in arithmetic and not always in layout: Yoga resolves each percentage
// against the container and snaps it to the device's pixel grid, and when the rounding
// goes up the seventh cell no longer fits. It wraps after six, so the last column —
// Sunday, in a Monday-first week — is always empty and every date after the first Saturday
// sits one column to the left of where it belongs. Whether it rounds up depends on the
// container width, which is why it showed on an iPhone 16 and not in review.
//
// Rows of exactly seven with `flex: 1` cells cannot do that: the row divides its own
// width, the same way the weekday header above it already did.
export type MonthGrid = (string | null)[][];

export function monthWeeks(month: string): MonthGrid {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return [];

  // Monday-first: JS getDay() is Sunday-first, so Sunday's 0 becomes 6.
  const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const total = new Date(y, m, 0).getDate();

  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= total; d += 1) {
    cells.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  // Pad the last week so every row has seven — a short final row would stretch its cells.
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: MonthGrid = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
