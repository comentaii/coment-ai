import { baseApi } from './base-api';
import { ICandidateProfile } from '@/schemas/candidate-profile.model';
import { IUser } from '@/schemas/user.model';

// The combined type for a candidate profile with populated user data
export type PopulatedCandidateProfile = Omit<ICandidateProfile, 'userId'> & {
  userId: Pick<IUser, 'name' | 'email' | 'image'>;
};

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyCandidates: builder.query<PopulatedCandidateProfile[], void>({
      query: () => 'candidates',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Candidates' as const, id: _id })),
              { type: 'Candidates', id: 'LIST' },
            ]
          : [{ type: 'Candidates', id: 'LIST' }],
    }),
    deleteCandidate: builder.mutation<{ message: string }, string>({
        query: (id) => ({
            url: `candidates/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Candidates', id: 'LIST' }],
    }),
  }),
});

export const { useGetCompanyCandidatesQuery, useDeleteCandidateMutation } = candidateApi;
