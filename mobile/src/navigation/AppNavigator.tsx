import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { userApi } from '../api';
import { usePushRegistration } from '../hooks/usePushRegistration';
import { colors } from '../theme';
import { Icon } from '../components/common';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LanguageSelectScreen } from '../screens/onboarding/LanguageSelectScreen';
import { setAppLocale } from '../locales';
import { MapScreen } from '../screens/map/MapScreen';
import { QuestsScreen } from '../screens/quests/QuestsScreen';
import { StageIntroScreen } from '../screens/home/StageIntroScreen';
import { ExerciseScreen } from '../screens/home/ExerciseScreen';
import { StageCompleteScreen } from '../screens/home/StageCompleteScreen';
import { GiftBoxScreen } from '../screens/home/GiftBoxScreen';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { InventoryScreen } from '../screens/profile/InventoryScreen';
import { ShopScreen } from '../screens/profile/ShopScreen';
import { NotificationSettingsScreen } from '../screens/profile/NotificationSettingsScreen';
import { WeeklyStatsScreen } from '../screens/stats/WeeklyStatsScreen';
import { DesignPlaygroundScreen } from '../screens/dev/DesignPlaygroundScreen';

import type {
  AuthStackParamList,
  MapStackParamList,
  QuestsStackParamList,
  ProfileStackParamList,
  TabParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const QuestsStack = createNativeStackNavigator<QuestsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="MapMain" component={MapScreen} options={{ headerShown: false }} />
      <MapStack.Screen name="StageIntro" component={StageIntroScreen} options={{ title: 'Stage' }} />
      <MapStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MapStack.Screen
        name="StageComplete"
        component={StageCompleteScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MapStack.Screen
        name="GiftBox"
        component={GiftBoxScreen}
        options={{ title: 'Gift Box', presentation: 'modal' }}
      />
    </MapStack.Navigator>
  );
}

function QuestsNavigator() {
  return (
    <QuestsStack.Navigator>
      <QuestsStack.Screen name="QuestsMain" component={QuestsScreen} options={{ headerShown: false }} />
      <QuestsStack.Screen name="StageIntro" component={StageIntroScreen} options={{ title: 'Stage' }} />
      <QuestsStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <QuestsStack.Screen
        name="StageComplete"
        component={StageCompleteScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <QuestsStack.Screen
        name="GiftBox"
        component={GiftBoxScreen}
        options={{ title: 'Gift Box', presentation: 'modal' }}
      />
    </QuestsStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
      <ProfileStack.Screen name="Shop" component={ShopScreen} options={{ title: 'Cat Shop' }} />
      <ProfileStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ title: 'Notifications' }}
      />
      <ProfileStack.Screen
        name="WeeklyStats"
        component={WeeklyStatsScreen}
        options={{ title: 'Stats' }}
      />
      <ProfileStack.Screen
        name="DesignPlayground"
        component={DesignPlaygroundScreen}
        options={{ title: 'Design playground' }}
      />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          paddingTop: 4,
          height: 56,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapNavigator}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => <Icon name="pin" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QuestsTab"
        component={QuestsNavigator}
        options={{
          tabBarLabel: 'Quests',
          tabBarIcon: ({ color, size }) => <Icon name="check" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AchievementsTab"
        component={AchievementsScreen}
        options={{
          tabBarLabel: 'Achieve',
          tabBarIcon: ({ color, size }) => <Icon name="xp" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="nurse" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

type Stage = 'language' | 'onboarding' | 'main';

function AuthenticatedApp() {
  const [stage, setStage] = useState<Stage | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);
  usePushRegistration();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data.data;
    },
  });

  useEffect(() => {
    if (!profile) return;

    // Keep authStore.user.native_language in sync so useLocale reacts.
    if (profile.native_language) {
      setAppLocale(profile.native_language);
    }
    if (currentUser && currentUser.native_language !== profile.native_language) {
      setUser({ ...currentUser, native_language: profile.native_language });
    }

    if (profile.profession) {
      setStage('main');
    } else {
      setStage('language');
    }
  }, [profile]);

  if (stage === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (stage === 'language') {
    return <LanguageSelectScreen onComplete={() => setStage('onboarding')} />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onComplete={() => setStage('main')} />;
  }

  return <MainTabs />;
}

export function AppNavigator() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedApp /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
