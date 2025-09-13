export * from '@/services/api/base-api';
export * from '@/services/api/candidateApi';
export * from '@/services/api/job-posting-api';
export * from '@/services/api/interviewApi';
export * from '@/services/api/challengeApi';
export * from '@/services/api/personnelApi';
export * from '@/services/api/userApi';
export * from '@/services/api/questionApi';
export * from '@/services/api/codeExecutionApi';
import { interviewApi } from './interviewApi';
import { jobPostingApi } from './jobPostingApi';
import { personnelApi } from './personnelApi';
import { companyApi } from './companyApi';
import { userApi } from './userApi';

export const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  confirmation: confirmationReducer,
  upload: uploadReducer,
};

export const middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware().concat(
    baseApi.middleware,
    candidateApi.middleware,
    interviewApi.middleware,
    jobPostingApi.middleware,
    personnelApi.middleware,
    companyApi.middleware,
    userApi.middleware,
  );
