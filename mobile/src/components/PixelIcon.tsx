// PixelIcon — black-line SVG icons in the app's ink-outline vocabulary, used to
// replace emoji on the reward/collection surfaces (badges, titles, stickers,
// missions) so they read as a designed set rather than OS emoji. Stroke-only
// (fill none); the caller passes a color (ink when earned, faint when locked).
import type { ReactNode } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type IconName =
  // badges
  | 'nurse-cap' | 'stethoscope' | 'syringe' | 'flame' | 'medal' | 'trophy' | 'crown' | 'lock'
  // titles
  | 'sprout' | 'heart' | 'bolt' | 'speech' | 'shield'
  // stickers
  | 'star' | 'flower' | 'plus'
  // missions + status + section headers
  | 'burst' | 'question' | 'tag' | 'search' | 'check' | 'sparkle'
  // home + colleagues (handoff draws these as emoji; the app uses line icons)
  | 'home' | 'handshake' | 'clap' | 'moon' | 'bulb' | 'map' | 'clipboard'
  | 'note' | 'people' | 'shift' | 'send' | 'copy' | 'share' | 'plus-box';

function body(name: IconName, color: string): ReactNode {
  switch (name) {
    case 'nurse-cap':
      return (<>
        <Path d="M4 16 v-2 c0 -4 4 -6 8 -6 s8 2 8 6 v2 z" />
        <Path d="M12 6 v3.2 M10.4 7.6 h3.2" />
      </>);
    case 'stethoscope':
      return (<>
        <Path d="M8 4 v4 a4 4 0 0 0 8 0 V4" />
        <Path d="M12 11.8 v1.2 a5 5 0 0 0 5.5 5" />
        <Circle cx={18} cy={17.2} r={2.2} />
      </>);
    case 'syringe':
      return (<>
        <Path d="M7 9 h9 v6 h-9 z" />
        <Path d="M16 12 h4 M18 10 v4 M7 12 H3 M10 9 v6 M12.5 9 v6" />
      </>);
    case 'flame':
      return <Path d="M12 3 c2 3 4 5 4 8 a4 4 0 0 1 -8 0 c0 -2 1 -3 2 -4 c.4 1 1.4 1.5 2 1 c-1 -2 -.6 -4 0 -5 z" />;
    case 'medal':
      return (<>
        <Path d="M9 9 L7.5 3 M15 9 L16.5 3" />
        <Circle cx={12} cy={14.5} r={5.5} />
        <Circle cx={12} cy={14.5} r={2} />
      </>);
    case 'trophy':
      return (<>
        <Path d="M8 4 h8 v3 a4 4 0 0 1 -8 0 z" />
        <Path d="M8 5 H6 a2 2 0 0 0 2 3 M16 5 h2 a2 2 0 0 1 -2 3" />
        <Path d="M12 11 v4 M9.5 20 h5 M10 17 h4 v3 h-4 z" />
      </>);
    case 'crown':
      return <Path d="M4 17 L5.5 8 L9 12 L12 6.5 L15 12 L18.5 8 L20 17 Z" />;
    case 'lock':
      return (<>
        <Path d="M5 11.5 h14 v8.5 h-14 z" />
        <Path d="M8 11.5 V8 a4 4 0 0 1 8 0 v3.5" />
        <Circle cx={12} cy={15.5} r={1.1} />
      </>);
    case 'sprout':
      return (<>
        <Path d="M12 21 V12" />
        <Path d="M12 14 C8 14 6 12 6 8 C10 8 12 10 12 14" />
        <Path d="M12 12 C16 12 18 10 18 6 C14 6 12 8 12 12" />
      </>);
    case 'heart':
      return <Path d="M12 20 C6 15.5 4 11 6.5 8 C8.5 5.7 11 6.5 12 8.5 C13 6.5 15.5 5.7 17.5 8 C20 11 18 15.5 12 20 Z" />;
    case 'bolt':
      return <Path d="M13 3 L6 13 h4.5 L10 21 L18 10 h-4.5 z" />;
    case 'speech':
      return (<>
        <Path d="M4 5 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v7 a2 2 0 0 1 -2 2 h-7 l-4 4 v-4 h-1 a2 2 0 0 1 -2 -2 z" />
        <Circle cx={9} cy={8.5} r={0.8} fill={color} stroke="none" />
        <Circle cx={12} cy={8.5} r={0.8} fill={color} stroke="none" />
        <Circle cx={15} cy={8.5} r={0.8} fill={color} stroke="none" />
      </>);
    case 'shield':
      return (<>
        <Path d="M12 3 L19 6 v5 c0 5 -3 8 -7 9 c-4 -1 -7 -4 -7 -9 V6 z" />
        <Path d="M12 8.5 l1.1 2.3 2.5 .2 -1.9 1.6 .6 2.4 -2.3 -1.3 -2.3 1.3 .6 -2.4 -1.9 -1.6 2.5 -.2 z" />
      </>);
    case 'star':
      return <Path d="M12 3 l2.5 5.8 6.3 .5 -4.8 4.1 1.5 6.1 -5.5 -3.3 -5.5 3.3 1.5 -6.1 -4.8 -4.1 6.3 -.5 z" />;
    case 'flower':
      return (<>
        <Circle cx={12} cy={12} r={2} />
        <Circle cx={12} cy={6.5} r={2.4} /><Circle cx={16.8} cy={9.2} r={2.4} /><Circle cx={16.8} cy={14.8} r={2.4} />
        <Circle cx={12} cy={17.5} r={2.4} /><Circle cx={7.2} cy={14.8} r={2.4} /><Circle cx={7.2} cy={9.2} r={2.4} />
      </>);
    case 'plus':
      return <Path d="M12 6 v12 M6 12 h12" />;
    case 'burst':
      return (<>
        <Circle cx={12} cy={12} r={2.5} />
        <Path d="M12 3.5 v3 M12 17.5 v3 M3.5 12 h3 M17.5 12 h3 M6 6 l2 2 M16 16 l2 2 M18 6 l-2 2 M8 16 l-2 2" />
      </>);
    case 'question':
      return (<>
        <Circle cx={12} cy={12} r={9} />
        <Path d="M9.5 9.5 a2.5 2.5 0 0 1 5 0 c0 2 -2.5 2 -2.5 3.8" />
        <Circle cx={12} cy={16.8} r={0.7} fill={color} stroke="none" />
      </>);
    case 'tag':
      return (<>
        <Path d="M3 11 V5 a2 2 0 0 1 2 -2 h6 l9 9 a2 2 0 0 1 0 2.8 l-6.2 6.2 a2 2 0 0 1 -2.8 0 l-8 -8 z" />
        <Circle cx={7.5} cy={7.5} r={1.3} />
      </>);
    case 'search':
      return (<>
        <Circle cx={11} cy={11} r={6} />
        <Path d="M20 20 l-4.6 -4.6" />
      </>);
    case 'check':
      return <Path d="M5 12.5 l4 4 L19 6.5" />;
    case 'sparkle':
      return <Path d="M12 4 l1.4 4.6 4.6 1.4 -4.6 1.4 -1.4 4.6 -1.4 -4.6 -4.6 -1.4 4.6 -1.4 z" />;

    // ── home + colleagues ───────────────────────────────────────────────────
    case 'home':
      return (<>
        <Path d="M4 11 L12 4 l8 7" />
        <Path d="M6 10.5 V20 h12 V10.5" />
        <Path d="M10 20 v-5 h4 v5" />
      </>);
    case 'handshake':
      // two hands meeting — the peer relation mark
      return (<>
        <Path d="M3 12 l4 -3 3 2" />
        <Path d="M21 12 l-4 -3 -3 2" />
        <Path d="M7 9 l4 4 a1.6 1.6 0 0 0 2.4 -2 L10 8" />
        <Path d="M4 12 v4 h3" />
        <Path d="M20 12 v4 h-3" />
      </>);
    case 'clap':
      return (<>
        <Path d="M8 20 a4 4 0 0 1 -1 -6 l4 -4 a1.4 1.4 0 0 1 2 2 l-2 2" />
        <Path d="M11 12 l3 -3 a1.4 1.4 0 0 1 2 2 l-3 3" />
        <Path d="M14 14 l2 -2 a1.4 1.4 0 0 1 2 2 l-4 5" />
        <Path d="M6 6 L5 4 M10 5 L10 3 M14 6 l1 -2" />
      </>);
    case 'moon':
      return <Path d="M20 14.5 A8.5 8.5 0 0 1 9.5 4 a8.5 8.5 0 1 0 10.5 10.5 z" />;
    case 'bulb':
      return (<>
        <Path d="M9 16 a6 6 0 1 1 6 0 v2 h-6 z" />
        <Path d="M10 20 h4" />
      </>);
    case 'map':
      return (<>
        <Path d="M3 6 l6 -2 6 2 6 -2 v14 l-6 2 -6 -2 -6 2 z" />
        <Path d="M9 4 v14 M15 6 v14" />
      </>);
    case 'clipboard':
      return (<>
        <Path d="M8 5 H6 v15 h12 V5 h-2" />
        <Path d="M9 3 h6 v4 H9 z" />
        <Path d="M9 12 h6 M9 16 h4" />
      </>);
    case 'note':
      return (<>
        <Path d="M6 4 h9 l4 4 v12 H6 z" />
        <Path d="M15 4 v4 h4" />
        <Path d="M9 13 h7 M9 17 h5" />
      </>);
    case 'people':
      return (<>
        <Circle cx={9} cy={8} r={3} />
        <Path d="M3.5 20 a5.5 5.5 0 0 1 11 0" />
        <Path d="M16 6.5 a3 3 0 0 1 0 5.6" />
        <Path d="M17 14.5 a5.5 5.5 0 0 1 4 5.5" />
      </>);
    case 'shift':
      // clock face — the roster/shift mark
      return (<>
        <Circle cx={12} cy={12} r={8} />
        <Path d="M12 7.5 V12 l3 2" />
      </>);
    case 'send':
      return (<>
        <Path d="M21 4 L3 11 l7 3 3 7 z" />
        <Path d="M10 14 l4 -4" />
      </>);
    case 'copy':
      return (<>
        <Path d="M9 9 h11 v11 H9 z" />
        <Path d="M15 9 V4 H4 v11 h5" />
      </>);
    case 'share':
      return (<>
        <Path d="M12 15 V4" />
        <Path d="M8 8 l4 -4 4 4" />
        <Path d="M5 13 v7 h14 v-7" />
      </>);
    case 'plus-box':
      return (<>
        <Path d="M4 4 h16 v16 H4 z" />
        <Path d="M12 8 v8 M8 12 h8" />
      </>);
  }
}

export function PixelIcon({ name, color, size = 22, sw = 1.8 }: { name: IconName; color: string; size?: number; sw?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {body(name, color)}
    </Svg>
  );
}

// Emoji → line-icon map, so the reward/collection surfaces (which carry emoji in
// their data) can render icons without changing every data file.
const EMOJI_ICON: Record<string, IconName> = {
  '👒': 'nurse-cap', '🩺': 'stethoscope', '💉': 'syringe', '🔥': 'flame', '🏅': 'medal', '🏆': 'trophy', '👑': 'crown', '🔒': 'lock',
  '🌱': 'sprout', '💗': 'heart', '⚡': 'bolt', '🗣': 'speech', '🦸': 'shield',
  '⭐': 'star', '★': 'star', '❤': 'heart', '♡': 'heart', '🌸': 'flower', '✿': 'flower', '✚': 'plus', '➕': 'plus', '☺': 'flower',
  '🎉': 'burst', '❔': 'question', '🎖': 'medal', '🏷': 'tag', '🔍': 'search', '✨': 'sparkle',
};
export function iconFor(emoji?: string): IconName | undefined {
  return emoji ? EMOJI_ICON[emoji.trim()] : undefined;
}
