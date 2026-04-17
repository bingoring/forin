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
import { HomeScreen } from '../screens/home/HomeScreen';
import { StageIntroScreen } from '../screens/home/StageIntroScreen';
import { ExerciseScreen } from '../screens/home/ExerciseScreen';
import { StageCompleteScreen } from '../screens/home/StageCompleteScreen';
import { CurriculumScreen } from '../screens/learn/CurriculumScreen';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

import type { AuthStackParamList, HomeStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
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
    </HomeStack.Navigator>
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
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function AuthenticatedApp() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setShowOnboarding(!profile.profession);
    }
  }, [profile]);

  if (showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
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
