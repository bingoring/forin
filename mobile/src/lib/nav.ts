import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';

/**
 * Is `name` the tab currently selected?
 *
 * Deliberately not useIsFocused. That goes false the moment ANY screen is pushed on top,
 * and it cannot tell the two cases apart — but they need opposite answers. A sheet
 * hoisted into the tab-level overlay must survive a push, because the pushed screen
 * covers it and taking it down is what showed the bare tab for an instant. It must NOT
 * survive a tab switch, because the overlay sits above every tab and the sheet would
 * float over a screen it has nothing to do with.
 *
 * The tab navigator's own state answers only the second question, which is the one being
 * asked. Reading it through the screen's navigation object means a push in the parent
 * stack simply does not appear here.
 */
export function useIsActiveTab(name: string): boolean {
  const nav = useNavigation();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const read = () => {
      const state = nav.getState?.();
      if (state) setActive(state.routes[state.index]?.name === name);
    };
    read();
    return nav.addListener('state', read);
  }, [nav, name]);

  return active;
}
