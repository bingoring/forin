import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme';

// Auth screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Home screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { StageIntroScreen } from '../screens/home/StageIntroScreen';
import { ExerciseScreen } from '../screens/home/ExerciseScreen';
import { StageCompleteScreen } from '../screens/home/StageCompleteScreen';

// Placeholder screens
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

import type {
  AuthStackParamList,
  HomeStackParamList,
  TabParamList,
} from './types';

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
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="StageIntro"
        component={StageIntroScreen}
        options={{ title: 'Stage' }}
      />
      <HomeStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HomeStack.Screen
        name="StageComplete"
        component={StageCompleteScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
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
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="LearnTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Learn', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="AchievementsTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Achieve', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: () => null }}
      />
    </Tab.Navigator>
  );
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
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
