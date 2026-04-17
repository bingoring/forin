import { api } from './client';
import type {
  ApiResponse,
  UserProfile,
  CurriculumModule,
  StageDetail,
  StartStageResponse,
  SubmitExerciseResponse,
  CompleteAttemptResponse,
  Profession,
  Country,
} from '../types/api';

export { authApi } from './auth';

export const userApi = {
  getProfile: () => api.get<ApiResponse<UserProfile>>('/users/me'),
  updateProfile: (data: Partial<UserProfile>) =>
    api.patch<ApiResponse<UserProfile>>('/users/me', data),
};

export const curriculumApi = {
  getCurriculum: () =>
    api.get<ApiResponse<{ modules: CurriculumModule[] }>>('/curriculum'),
  getStageDetail: (stageId: string) =>
    api.get<ApiResponse<StageDetail>>(`/curriculum/stages/${stageId}`),
};

export const learningApi = {
  startStage: (stageId: string) =>
    api.post<ApiResponse<StartStageResponse>>(`/learning/stages/${stageId}/start`),
  submitExercise: (attemptId: string, exerciseId: string, response: any) =>
    api.post<ApiResponse<SubmitExerciseResponse>>(
      `/learning/attempts/${attemptId}/exercises/${exerciseId}/submit`,
      { response },
    ),
  completeAttempt: (attemptId: string) =>
    api.post<ApiResponse<CompleteAttemptResponse>>(
      `/learning/attempts/${attemptId}/complete`,
    ),
  getHistory: (page = 1, pageSize = 20) =>
    api.get(`/learning/history`, { params: { page, page_size: pageSize } }),
};

export const onboardingApi = {
  getProfessions: () =>
    api.get<ApiResponse<{ professions: Profession[] }>>('/onboarding/professions'),
  getCountries: (professionSlug: string) =>
    api.get<ApiResponse<{ countries: Country[] }>>('/onboarding/countries', {
      params: { profession_slug: professionSlug },
    }),
  submitAssessment: (data: any) =>
    api.post('/onboarding/assessment/submit', data),
};

export const gamificationApi = {
  getInventory: () => api.get('/gamification/inventory'),
  getPendingBoxes: () => api.get('/gamification/gift-boxes/pending'),
  openGiftBox: (boxId: string) =>
    api.post(`/gamification/gift-boxes/${boxId}/open`),
  getShop: () => api.get('/gamification/shop'),
  purchaseItem: (itemId: string) =>
    api.post('/gamification/shop/purchase', { item_id: itemId }),
  getAchievements: () => api.get('/gamification/achievements'),
  equipCatItem: (slot: string, itemId: string | null) =>
    api.put('/users/me/cat/equip', { slot, item_id: itemId }),
};
