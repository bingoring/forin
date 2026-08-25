// Renders an emoji that our DATA carries as the forin icon it maps to.
//
// Content and fixtures store emoji (a ward object's 🛏, a title's 👑, a reward's
// ⭐) because that is what the handoff's own data files store — the web build
// converts them at render time with installFIconizer(). RN has no DOM to walk, so
// this is that pass, done at the one place it can be done: where the string is
// drawn.
//
// Existing before this: six copies of `iconFor(e) ? <PixelIcon…/> : <Text…/>`,
// each with its own size and colour arguments. One component instead, so a newly
// mapped emoji starts rendering everywhere at once rather than at whichever
// screens someone remembered.
import { Text } from 'react-native';
import { FIcon } from './FIcon';
import { PixelIcon } from './PixelIcon';
import { artFor } from '@/theme/emojiIcon';
import { colors } from '@/theme/tokens';

export function EmojiIcon({
  emoji,
  size = 18,
  /** Tint for a tier-2 line icon only. FIcon artwork carries its own colours. */
  color = colors.ink,
  sw,
}: {
  emoji?: string;
  size?: number;
  color?: string;
  sw?: number;
}) {
  const art = artFor(emoji);
  if (art?.tier === 'ficon') return <FIcon name={art.name} size={size} />;
  if (art?.tier === 'line') return <PixelIcon name={art.name} color={color} size={size} sw={sw} />;
  // Unmapped is not a failure: the handoff leaves expression emoji (😄) mapped to
  // nothing on purpose, and those must keep rendering as themselves. `size` is the
  // font size so a face lines up with the icons beside it.
  return <Text style={{ fontSize: size, color }}>{emoji ?? ''}</Text>;
}
