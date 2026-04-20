import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { userApi } from '../api';
import { colors } from '../theme';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LanguageSelectScreen } from '../screens/onboarding/LanguageSelectScreen';
import { setAppLocale } from '../locales';
import { HomeScreen } from '../screens/home/HomeScreen';
import { StageIntroScreen } from '../screens/home/StageIntroScreen';
import { ExerciseScreen } from '../screens/home/ExerciseScreen';
import { StageCompleteScreen } from '../screens/home/StageCompleteScreen';
import { GiftBoxScreen } from '../screens/home/GiftBoxScreen';
import { CurriculumScreen } from '../screens/learn/CurriculumScreen';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { InventoryScreen } from '../screens/profile/InventoryScreen';
import { ShopScreen } from '../screens/profile/ShopScreen';
import { NotificationSettingsScreen } from '../screens/profile/NotificationSettingsScreen';

import type { AuthStackParamList, HomeStackParamList, ProfileStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
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

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="StageIntro" component={StageIntroScreen} options={{ title: 'Stage' }} />
      <HomeStack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <HomeStack.Screen name="StageComplete" component={StageCompleteScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <HomeStack.Screen name="GiftBox" component={GiftBoxScreen} options={{ title: 'Gift Box', presentation: 'modal' }} />
    </HomeStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
      <ProfileStack.Screen name="Shop" component={ShopScreen} options={{ title: 'Cat Shop' }} />
      <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingTop: 4, height: 56 },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="LearnTab" component={CurriculumScreen} options={{ tabBarLabel: 'Learn' }} />
      <Tab.Screen name="AchievementsTab" component={AchievementsScreen} options={{ tabBarLabel: 'Achieve' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

type Stage = 'language' | 'onboarding' | 'main';

function AuthenticatedApp() {
  const [stage, setStage] = useState<Stage | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

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
      // A user with a profession has been through onboarding, so any future
      // session skips both language + onboarding. First-time users go through
      // LanguageSelect before the profession-country-goal-catName flow.
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
