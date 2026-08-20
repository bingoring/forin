// A place for sheets to render that is above the tab bar but below a pushed screen.
//
// The bottom sheet was hosted in a RN Modal, which renders above the entire app — the
// tab bar AND any screen pushed on top of the caller. So opening a briefing from a sheet
// meant hiding the sheet first, or the sheet would cover the briefing. That forced a gap
// between the sheet going away and the new screen arriving, and the gap showed the bare
// career tab for an instant, twice: once out, once back.
//
// A sheet does not want to be above everything. It wants to be above the tab bar and
// below whatever screen you navigate to — which is exactly where the tab layout sits in
// the stack. So the sheet renders HERE, hoisted out of the screen that owns it, while its
// state stays with that screen.
//
// React Native has no createPortal, so this is the usual substitute: a registry the
// outlet subscribes to. The outlet is a SIBLING of the children, never an ancestor, which
// is what keeps a registration from re-rendering the component that registered and
// looping.
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Entry = [string, ReactNode];

class Registry {
  private slots = new Map<string, ReactNode>();
  private listeners = new Set<() => void>();
  private snapshot: Entry[] = [];

  set(id: string, node: ReactNode) {
    this.slots.set(id, node);
    this.publish();
  }

  remove(id: string) {
    if (this.slots.delete(id)) this.publish();
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  // A fresh array each publish on purpose: that IS the change signal for
  // useSyncExternalStore, and the outlet has to re-render when a slot's node changes even
  // though the key set did not.
  getSnapshot = () => this.snapshot;

  private publish() {
    this.snapshot = [...this.slots];
    for (const fn of this.listeners) fn();
  }
}

const Ctx = createContext<Registry | null>(null);

/** Wraps the tab navigator. Sheets rendered by any tab screen land on top of it. */
export function SheetOverlayHost({ children }: { children: ReactNode }) {
  const registry = useMemo(() => new Registry(), []);
  return (
    <Ctx.Provider value={registry}>
      <View style={{ flex: 1 }}>
        {children}
        <Outlet registry={registry} />
      </View>
    </Ctx.Provider>
  );
}

function Outlet({ registry }: { registry: Registry }) {
  const slots = useSyncExternalStore(registry.subscribe, registry.getSnapshot);
  if (slots.length === 0) return null; // nothing open: no view over the tab bar at all
  return (
    <>
      {slots.map(([id, node]) => (
        <View key={id} style={StyleSheet.absoluteFill}>
          {node}
        </View>
      ))}
    </>
  );
}

/**
 * Render `node` into the nearest host, or nowhere if there is no host.
 *
 * Returns whether a host took it, so the caller can fall back to its own presentation.
 * `node` is re-published on every render of the caller — the effect deliberately has no
 * dependency array, because the node is a fresh element each time and its contents change
 * without any value in a dep list changing.
 */
export function useSheetOverlay(id: string, node: ReactNode, active: boolean): boolean {
  const registry = useContext(Ctx);

  useEffect(() => {
    if (!registry) return;
    if (active) registry.set(id, node);
    else registry.remove(id);
  });

  useEffect(() => {
    if (!registry) return;
    return () => registry.remove(id);
  }, [registry, id]);

  return registry !== null;
}
