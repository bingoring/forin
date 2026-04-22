import type { CompleteAttemptResponse } from '../types/api';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MapStackParamList = {
  MapMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

export type QuestsStackParamList = {
  QuestsMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Inventory: undefined;
  Shop: undefined;
  NotificationSettings: undefined;
  WeeklyStats: undefined;
  DesignPlayground: undefined;
};

export type TabParamList = {
  MapTab: NavigatorScreenParams<MapStackParamList>;
  QuestsTab: NavigatorScreenParams<QuestsStackParamList>;
  AchievementsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
