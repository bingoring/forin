// The presence controller's scheduling: home polls the roster, elsewhere only heartbeats,
// and backgrounding leaves the ward at once. Motion/timers are faked — what is asserted is
// WHICH call each state makes, and that a logged-out client makes none.
//
// react-native is NOT mocked (that pulls a native module jest cannot load) — the real
// AppState is spied instead, and the module under test is require()d only AFTER the spy and
// the 'active' state are in place, since it reads AppState at import.
import { AppState } from 'react-native';

let mockToken: string | null = 'tok';
jest.mock('@/store/authStore', () => ({
  useAuthStore: { getState: () => ({ accessToken: mockToken }) },
}));

const mockWard = jest.fn(async () => [{ id: 'a' }, { id: 'b' }]);
const mockHeartbeat = jest.fn(async () => {});
const mockLeave = jest.fn(async () => {});
jest.mock('@/api/client', () => ({
  api: { ward: mockWard, wardHeartbeat: mockHeartbeat, wardLeave: mockLeave },
}));

let mockAppHandler: ((s: string) => void) | null = null;
(AppState as unknown as { currentState: string }).currentState = 'active';
jest.spyOn(AppState, 'addEventListener').mockImplementation(((_e: string, cb: (s: string) => void) => {
  mockAppHandler = cb;
  return { remove: () => {} };
}) as never);

const { initPresence, setHomeActive } = require('@/lib/wardPresence') as typeof import('@/lib/wardPresence');

beforeEach(() => {
  jest.useFakeTimers();
  mockToken = 'tok';
  mockWard.mockClear();
  mockHeartbeat.mockClear();
  mockLeave.mockClear();
});
afterEach(() => {
  jest.useRealTimers();
});

test('foreground off-home heartbeats; home focus polls the roster', () => {
  // initPresence starts appActive (currentState 'active'), homeActive false → the away
  // heartbeat is the immediate tick.
  initPresence();
  expect(mockHeartbeat).toHaveBeenCalled();
  expect(mockWard).not.toHaveBeenCalled();

  // Focusing home switches to the roster poll (which is itself the heartbeat there).
  setHomeActive(true);
  expect(mockWard).toHaveBeenCalled();
});

test('backgrounding leaves the ward', () => {
  initPresence(); // idempotent; the AppState handler was captured on first init
  mockLeave.mockClear();
  mockAppHandler?.('background');
  expect(mockLeave).toHaveBeenCalled();
});

test('a logged-out client makes no presence calls', () => {
  // Come back to foreground first (previous test backgrounded it), then a fresh tick.
  mockAppHandler?.('active');
  mockWard.mockClear();
  mockHeartbeat.mockClear();
  mockToken = null;
  // Toggle home off→on to force a reschedule tick while logged out.
  setHomeActive(false);
  setHomeActive(true);
  expect(mockWard).not.toHaveBeenCalled();
  expect(mockHeartbeat).not.toHaveBeenCalled();
});
