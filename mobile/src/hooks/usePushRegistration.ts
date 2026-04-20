import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../stores/authStore';
import { userApi } from '../api';

// Foreground handler — show banners even when the app is active so the
// learner immediately sees a streak warning they receive mid-session.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * usePushRegistration requests notification permission (once the user is
 * logged in) and, if granted, sends the device's Expo push token to the
 * backend. Running it on every authenticated app start keeps the server's
 * stored token fresh — Expo can rotate tokens.
 *
 * The hook is a no-op on simulators and on platforms that can't receive
 * push.
 */
export function usePushRegistration() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;
    registerForPushAsync().catch(() => {
      // Registration failure is silent — learners can still use the app
      // without push, and the scheduler will simply have no token to
      // target.
    });
  }, [user?.id]);
}

async function registerForPushAsync() {
  if (!Device.isDevice) {
    // Simulators / emulators cannot receive push.
    return;
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') {
    return;
  }

  // Android needs an explicit default channel for foreground presentation.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync();
  const token = tokenResponse.data;
  if (!token) return;

  await userApi.setPushToken(token);
}
