import { baseApi } from './base-api';
import { IUser } from '@/schemas';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidatesByCompany: builder.query<IUser[], string>({
      query: (companyId) => `users/company/${companyId}/candidates`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'CANDIDATE_LIST' },
            ]
          : [{ type: 'User', id: 'CANDIDATE_LIST' }],
    }),
    getInterviewersByCompany: builder.query<IUser[], string>({
        query: (companyId) => `users/company/${companyId}/interviewers`,
        providesTags: (result) =>
            result
            ? [
                ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
                { type: 'User', id: 'INTERVIEWER_LIST' },
                ]
            : [{ type: 'User', id: 'INTERVIEWER_LIST' }],
    }),
  }),
});

export const { useGetCandidatesByCompanyQuery, useGetInterviewersByCompanyQuery } = userApi;
