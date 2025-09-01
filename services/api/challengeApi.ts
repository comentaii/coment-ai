import { baseApi } from './base-api';
import { IChallenge } from '@/schemas';

export const challengeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChallengesByCompany: builder.query<IChallenge[], string>({
      query: (companyId) => `challenges/company/${companyId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Challenge' as const, id: _id })),
              { type: 'Challenge', id: 'LIST' },
            ]
          : [{ type: 'Challenge', id: 'LIST' }],
    }),
    createChallenge: builder.mutation<IChallenge, Partial<IChallenge>>({
        query: (body) => ({
            url: 'challenges',
            method: 'POST',
            body,
        }),
        invalidatesTags: [{ type: 'Challenge', id: 'LIST' }],
    }),
  }),
});

export const { useGetChallengesByCompanyQuery, useCreateChallengeMutation } = challengeApi;
