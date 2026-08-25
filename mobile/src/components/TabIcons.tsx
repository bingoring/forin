// Bottom-nav icons.
//
// These were hand-drawn line icons, and they are why "the tab icons still haven't
// changed": the FIcon adoption pass scanned <PixelIcon> call sites, and this file
// calls none — it drew its own SVG. The five tabs are the most-seen icons in the
// app and they were the last thing still on the retired set.
//
// v23's icon set has this exact row in its own `// 탭·기본` section: home, tower,
// board, lab, me. `tower` for 커리어 is the campus itself; v25's "building lists use
// a symbol, not a building" rule is scoped to building and floor LISTS, and a tab
// is not a list.
import { View } from 'react-native';
import { FIcon } from './FIcon';
import { inkOpacity } from '@/theme/inkShade';

type Props = { color: string; size?: number };

/** The tab bar passes ink when active and textFaint when not — both shades of ink,
 *  so both draw the same artwork and the inactive one is simply dimmer. A colour
 *  that is not a shade of ink would have nothing to render, so it falls back to
 *  full opacity rather than disappearing. */
function TabArt({ name, color, size = 22 }: { name: string } & Props) {
  const opacity = inkOpacity(color) ?? 1;
  return (
    <View style={opacity === 1 ? undefined : { opacity }}>
      <FIcon name={name} size={size} />
    </View>
  );
}

export const HomeIcon = (p: Props) => <TabArt name="home" {...p} />;
export const CampusIcon = (p: Props) => <TabArt name="tower" {...p} />;
export const BoardIcon = (p: Props) => <TabArt name="board" {...p} />;
export const LabIcon = (p: Props) => <TabArt name="lab" {...p} />;
export const MeIcon = (p: Props) => <TabArt name="me" {...p} />;
