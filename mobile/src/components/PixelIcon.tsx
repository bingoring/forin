// PixelIcon — black-line SVG icons in the app's ink-outline vocabulary, used to
// replace emoji on the reward/collection surfaces (badges, titles, stickers,
// missions) so they read as a designed set rather than OS emoji. Stroke-only
// (fill none); the caller passes a color (ink when earned, faint when locked).
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { FIcon } from './FIcon';
import { ficonFor } from '@/theme/lineToFIcon';
import { colors } from '@/theme/tokens';

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
  | 'note' | 'people' | 'shift' | 'send' | 'copy' | 'share' | 'plus-box'
  // navigation + actions (replacing ▶ / › / ✓ glyphs in buttons and rows)
  | 'play' | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down' | 'refresh' | 'pause'
  // board / growth / review surfaces
  | 'chart' | 'calendar' | 'target' | 'book' | 'mic' | 'volume' | 'clock' | 'pin' | 'bed' | 'alert'
  // departments — one per ward/unit, so board/campus/lift stop leaning on emoji
  | 'ambulance' | 'scalpel' | 'baby' | 'pill' | 'pregnant' | 'bottle' | 'teddy'
  | 'xray' | 'microscope' | 'droplet' | 'eye' | 'ribbon' | 'dove' | 'cane'
  | 'brain' | 'prosthesis' | 'cap' | 'cup' | 'box' | 'candle' | 'hospital' | 'x'
  // destructive actions
  | 'trash';

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

    // ── navigation + actions ────────────────────────────────────────────────
    case 'play':
      // Filled, unlike the rest of the set: a play control reads as a solid
      // wedge everywhere, and an outlined one looks like an empty placeholder.
      return <Path d="M7 4.5 L19 12 L7 19.5 z" fill={color} />;
    case 'pause':
      return (<>
        <Path d="M9 5 v14" />
        <Path d="M15 5 v14" />
      </>);
    case 'chevron-right':
      return <Path d="M9 5 l7 7 -7 7" />;
    case 'chevron-left':
      return <Path d="M15 5 l-7 7 7 7" />;
    // Disclosure arrows. Same stroke as the horizontal pair so a row that
    // expands downward reads as the same control rotated, not a different one.
    case 'chevron-up':
      return <Path d="M5 15 l7 -7 7 7" />;
    case 'chevron-down':
      return <Path d="M5 9 l7 7 7 -7" />;
    case 'refresh':
      return (<>
        <Path d="M20 12 a8 8 0 1 1 -2.4 -5.7" />
        <Path d="M20 4 v5 h-5" />
      </>);

    // ── board / growth / review ─────────────────────────────────────────────
    case 'chart':
      return (<>
        <Path d="M4 20 V4" />
        <Path d="M4 20 h16" />
        <Path d="M8 17 v-5 M12.5 17 v-9 M17 17 v-6" />
      </>);
    case 'calendar':
      return (<>
        <Path d="M4 6 h16 v14 H4 z" />
        <Path d="M4 10 h16" />
        <Path d="M8 3 v4 M16 3 v4" />
      </>);
    case 'target':
      return (<>
        <Circle cx={12} cy={12} r={8} />
        <Circle cx={12} cy={12} r={3.5} />
      </>);
    case 'book':
      return (<>
        <Path d="M4 5 a3 3 0 0 1 3 -1 h12 v16 H7 a3 3 0 0 0 -3 1 z" />
        <Path d="M7 4 v16" />
      </>);
    case 'mic':
      return (<>
        <Path d="M12 4 a2.5 2.5 0 0 1 2.5 2.5 v5 a2.5 2.5 0 0 1 -5 0 v-5 A2.5 2.5 0 0 1 12 4 z" />
        <Path d="M6.5 11 a5.5 5.5 0 0 0 11 0" />
        <Path d="M12 16.5 V20 M9 20 h6" />
      </>);
    case 'volume':
      return (<>
        <Path d="M4 9.5 h3.5 L12 5.5 v13 L7.5 14.5 H4 z" />
        <Path d="M15.5 9 a4 4 0 0 1 0 6" />
      </>);
    case 'clock':
      return (<>
        <Circle cx={12} cy={12} r={8} />
        <Path d="M12 7.5 V12 l3 2" />
      </>);
    case 'pin':
      return (<>
        <Path d="M12 21 s6 -6.4 6 -10.4 a6 6 0 1 0 -12 0 C6 14.6 12 21 12 21 z" />
        <Circle cx={12} cy={10.5} r={2.4} />
      </>);
    case 'bed':
      return (<>
        <Path d="M3 18 V8" />
        <Path d="M3 12 h11 a4 4 0 0 1 4 4 v2" />
        <Path d="M3 18 h18" />
        <Circle cx={7} cy={9.5} r={1.8} />
      </>);
    case 'alert':
      return (<>
        <Path d="M12 4 L21 19 H3 z" />
        <Path d="M12 10 v4" />
        <Path d="M12 16.5 v.5" />
      </>);
    case 'x':
      return <Path d="M6 6 l12 12 M18 6 l-12 12" />;

    // ── departments ─────────────────────────────────────────────────────────
    case 'ambulance':
      return (<>
        <Path d="M2 16 V8 h11 v8" />
        <Path d="M13 10 h4 l4 4 v2 h-8" />
        <Path d="M2 16 h19" />
        <Circle cx={7} cy={17.5} r={2} />
        <Circle cx={17} cy={17.5} r={2} />
        <Path d="M6.5 12 h3 M8 10.5 v3" />
      </>);
    case 'scalpel':
      return (<>
        <Path d="M4 20 L13 11 l5 -5 2 2 -5 5 z" />
        <Path d="M4 20 l3 -1" />
      </>);
    case 'baby':
      return (<>
        <Circle cx={12} cy={9} r={5} />
        <Path d="M10 8.5 v.5 M14 8.5 v.5" />
        <Path d="M10.5 11.5 a2.4 2.4 0 0 0 3 0" />
        <Path d="M6 20 a6 6 0 0 1 12 0" />
      </>);
    case 'pill':
      return (<>
        <Path d="M9 4 a5 5 0 0 1 7 7 l-5 5 a5 5 0 0 1 -7 -7 z" />
        <Path d="M7.5 8.5 l7 7" />
      </>);
    case 'pregnant':
      return (<>
        <Circle cx={12} cy={5} r={2.2} />
        <Path d="M12 8 v5" />
        <Path d="M12 12 a4 4 0 0 1 0 7" />
        <Path d="M12 19 v3" />
      </>);
    case 'bottle':
      return (<>
        <Path d="M10 3 h4 v2 h-4 z" />
        <Path d="M9 5 h6 l1 3 v11 a2 2 0 0 1 -2 2 h-4 a2 2 0 0 1 -2 -2 V8 z" />
        <Path d="M9 12 h6" />
      </>);
    case 'teddy':
      return (<>
        <Circle cx={7.5} cy={6.5} r={2.2} />
        <Circle cx={16.5} cy={6.5} r={2.2} />
        <Circle cx={12} cy={12} r={6} />
        <Path d="M10 11 v.5 M14 11 v.5" />
        <Path d="M10.5 14 a2.4 2.4 0 0 0 3 0" />
      </>);
    case 'xray':
      return (<>
        <Path d="M4 3 h16 v18 H4 z" />
        <Path d="M9 7 v10 M15 7 v10" />
        <Path d="M9 10 h6 M9 14 h6" />
      </>);
    case 'microscope':
      return (<>
        <Path d="M9 4 h4 l1 8 h-6 z" />
        <Path d="M8 12 h8" />
        <Path d="M12 12 a6 6 0 0 1 5 8" />
        <Path d="M5 20 h14" />
      </>);
    case 'droplet':
      return <Path d="M12 3 s6 6.6 6 10.4 a6 6 0 1 1 -12 0 C6 9.6 12 3 12 3 z" />;
    case 'eye':
      return (<>
        <Path d="M2 12 s4 -6 10 -6 10 6 10 6 -4 6 -10 6 -10 -6 -10 -6 z" />
        <Circle cx={12} cy={12} r={2.6} />
      </>);
    case 'ribbon':
      return (<>
        <Path d="M9 21 l3 -9 3 9" />
        <Path d="M12 12 c-4 -3 -4 -9 0 -9 s4 6 0 9 z" />
      </>);
    case 'dove':
      return (<>
        <Path d="M4 14 c4 1 7 -1 9 -5" />
        <Path d="M13 9 a4 4 0 0 1 7 3 c0 4 -4 7 -8 7 -4 0 -8 -3 -8 -6" />
        <Path d="M18 11 v.5" />
      </>);
    case 'cane':
      return (<>
        <Path d="M9 21 V9 a4 4 0 0 1 8 0" />
        <Path d="M5 21 h10" />
      </>);
    case 'brain':
      return (<>
        <Path d="M12 5 a3 3 0 0 0 -5.6 1.2 A3 3 0 0 0 5 12 a3 3 0 0 0 1.5 5 A3 3 0 0 0 12 19 z" />
        <Path d="M12 5 a3 3 0 0 1 5.6 1.2 A3 3 0 0 1 19 12 a3 3 0 0 1 -1.5 5 A3 3 0 0 1 12 19 z" />
        <Path d="M12 5 v14" />
      </>);
    case 'prosthesis':
      return (<>
        <Path d="M10 3 v7 l-2 5 3 3" />
        <Path d="M14 3 v6" />
        <Path d="M8 20 h8" />
      </>);
    case 'cap':
      // graduation cap — simulation lab / training
      return (<>
        <Path d="M2 9 L12 5 l10 4 -10 4 z" />
        <Path d="M6 11 v5 c0 1.6 2.7 3 6 3 s6 -1.4 6 -3 v-5" />
      </>);
    case 'cup':
      return (<>
        <Path d="M4 8 h13 v6 a5 5 0 0 1 -5 5 H9 a5 5 0 0 1 -5 -5 z" />
        <Path d="M17 10 h2.5 a2.5 2.5 0 0 1 0 5 H17" />
        <Path d="M4 21 h13" />
      </>);
    case 'box':
      return (<>
        <Path d="M3 7 l9 -4 9 4 v10 l-9 4 -9 -4 z" />
        <Path d="M3 7 l9 4 9 -4" />
        <Path d="M12 11 v10" />
      </>);
    case 'trash':
      // Lid, can, two ribs. Drawn on the same 24-unit grid as the rest, and squared off
      // rather than tapered so it reads at 16px like the others do.
      return (<>
        <Path d="M4 7 h16" />
        <Path d="M9 7 v-2 h6 v2" />
        <Path d="M6 7 v13 h12 v-13" />
        <Path d="M10 11 v6" />
        <Path d="M14 11 v6" />
      </>);
    case 'candle':
      return (<>
        <Path d="M12 3 c1.6 1.6 1.6 3.4 0 4 -1.6 -.6 -1.6 -2.4 0 -4 z" />
        <Path d="M8 9 h8 v11 H8 z" />
        <Path d="M12 7 v2" />
      </>);
    case 'hospital':
      return (<>
        <Path d="M4 21 V8 l8 -5 8 5 v13" />
        <Path d="M12 8 v6 M9 11 h6" />
        <Path d="M2 21 h20" />
      </>);
  }
}

/**
 * `fill` exists for icons that carry a STATE rather than a label.
 *
 * A favourite star drawn as an outline in one colour and an outline in another colour is
 * a distinction of a couple of pixels at 17px — the on state was reported as "the star
 * does not change", and it was changing. Filled versus hollow is the difference you can
 * see across a list without looking for it. Defaults to none, so every existing icon is
 * untouched; the Svg's fill is inherited by the paths below.
 */
// How opaque the v23 artwork is for each de-emphasis colour the app uses.
//
// These greys are not different colours — they are the SAME ink, quieter: a faded
// tab label, a placeholder in an empty state. Fixed-palette artwork expresses that
// with opacity, and the result is the same icon reading as secondary, which is
// exactly what the line icon's grey stroke was doing.
const INK_OPACITY: Record<string, number> = {
  [colors.ink.toLowerCase()]: 1,
  [colors.textSoft.toLowerCase()]: 0.62,
  [colors.textFaint.toLowerCase()]: 0.42,
};

/** The opacity to draw FIcon artwork at for `color`, or undefined when `color` is
 *  a real colour rather than a shade of ink — an accent, or something light meant
 *  to read on a dark ground, neither of which fixed-palette artwork can become. */
function inkOpacity(color: string): number | undefined {
  const c = color.trim().toLowerCase();
  if (INK_OPACITY[c] !== undefined) return INK_OPACITY[c];
  // '#2A252244' — ink carrying an alpha suffix, which the app writes as C + '44'.
  const ink = colors.ink.toLowerCase();
  if (c.length === 9 && c.startsWith(ink)) return parseInt(c.slice(7), 16) / 255;
  return undefined;
}

// PixelIcon is the app's single icon entry point, and since v23 it RESOLVES rather
// than draws: when the requested name exists in the FIcon set and the requested
// colour is a shade of ink, it renders the v23 artwork. Everything else keeps the
// line icon.
//
// This is a chokepoint on purpose. The first attempt at adopting v23 converted call
// sites one at a time and left 92% of the app on the old set — because "port the
// set" and "use the set" are different jobs, and 134 call sites is 134 chances to
// miss one. Resolving here means every current site and every future one gets the
// new artwork without being edited, and the two legitimate escapes are one rule
// instead of dozens of judgement calls:
//
//   · a colour FIcon cannot become — an accent (mint check, blue drop) or a light
//     tint meant to read on a dark ground (cream on an ink button). The artwork is
//     ink-outlined pastel; recolouring it is not available, and drawing it anyway
//     would put a dark icon on a dark button.
//   · a two-state `fill` — the favourites star is filled when pinned and hollow
//     when not, and one fixed drawing cannot say both.
export function PixelIcon({ name, color, size = 22, sw = 1.8, fill = 'none', variant = 'auto' }: {
  name: IconName; color: string; size?: number; sw?: number; fill?: string;
  /**
   * 'line' opts this site out of the v23 artwork.
   *
   * The one case that needs it: a control whose icon is ink in one state and white
   * in another. Resolving per-colour would then draw v23 artwork when inactive and
   * the line icon when active, so selecting the control would change the drawing —
   * worse than either choice made consistently. Opting the whole control out keeps
   * it coherent, and says so at the call site.
   */
  variant?: 'auto' | 'line';
}) {
  const ficon = variant === 'line' ? undefined : ficonFor(name);
  const opacity = ficon ? inkOpacity(color) : undefined;
  // fill is the two-state escape: anything other than the default means the caller
  // is using presence-of-fill to say something the artwork cannot.
  if (ficon && opacity !== undefined && fill === 'none') {
    return (
      <View style={opacity === 1 ? undefined : { opacity }}>
        <FIcon name={ficon} size={size} />
      </View>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
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
  // Elevator floors / fast-travel rows. The dept icons already existed in this
  // set; only the bridge entries were missing, which is why 762bb6a's sweep
  // left the map surfaces still drawing emoji.
  '🚑': 'ambulance', '🔪': 'scalpel', '🩹': 'plus', '🛏': 'bed', '🫀': 'heart',
  '🦴': 'prosthesis', '💊': 'pill', '👶': 'baby', '🤰': 'pregnant',
  '🧸': 'teddy', '🎈': 'teddy', '🩻': 'xray', '🔭': 'microscope', '👁': 'eye',
  '🎗': 'ribbon', '🕊': 'dove', '🦮': 'cane', '🧠': 'brain', '🎓': 'cap',
  '☕': 'cup', '📦': 'box', '🔧': 'prosthesis',
};
export function iconFor(emoji?: string): IconName | undefined {
  return emoji ? EMOJI_ICON[emoji.trim()] : undefined;
}
