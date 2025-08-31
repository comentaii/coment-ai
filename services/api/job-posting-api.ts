import { baseApi } from '@/services/api/base-api';
import { CreateJobPostingDto, UpdateJobPostingDto } from '@/lib/validation-schemas';
import { IJobPosting } from '@/schemas/job-posting.model';
import { PopulatedCandidateProfile } from '@/services/api/candidateApi';

export type JobPostingWithMatches = {
  jobPosting: IJobPosting;
  matchedCandidates: (PopulatedCandidateProfile & { matchScore: number; matchedSkills: string[] })[];
};

export type CandidateMatchResult = {
  matched: (PopulatedCandidateProfile & { matchScore: number; matchExplanation: string; matchedSkills: string[] })[];
  unmatched: PopulatedCandidateProfile[];
};

export const jobPostingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobPostings: builder.query<IJobPosting[], void>({
      query: () => 'job-postings',
      transformResponse: (response: { data: IJobPosting[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((jobPosting) => ({ type: 'JobPosting' as const, id: (jobPosting as any)._id.toString() })),
              { type: 'JobPosting', id: 'LIST' },
            ]
          : [{ type: 'JobPosting', id: 'LIST' }],
    }),
    getJobPostingById: builder.query<JobPostingWithMatches, string>({
      query: (id) => `job-postings/${id}`,
      transformResponse: (response: { data: JobPostingWithMatches }) => response.data,
      providesTags: (result, error, id) => [{ type: 'JobPosting', id }],
    }),
    createJobPosting: builder.mutation<IJobPosting, CreateJobPostingDto>({
      query: (body) => ({
        url: 'job-postings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'JobPosting', id: 'LIST' }],
    }),
    updateJobPosting: builder.mutation<IJobPosting, { id: string; body: UpdateJobPostingDto }>({
      query: ({ id, body }) => ({
        url: `job-postings/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'JobPosting', id }, { type: 'JobPosting', id: 'LIST' }],
    }),
    deleteJobPosting: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `job-postings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JobPosting', id }, { type: 'JobPosting', id: 'LIST' }],
    }),
    // Eşleştirme endpoint'leri
    getCandidatesForJob: builder.query<CandidateMatchResult, string>({
      query: (jobPostingId) => `job-postings/${jobPostingId}/candidates`,
      transformResponse: (response: { data: CandidateMatchResult }) => response.data,
      providesTags: (result, error, jobPostingId) => [{ type: 'JobPosting', id: jobPostingId }],
    }),
    triggerMatching: builder.mutation<{ message: string }, string>({
      query: (jobPostingId) => ({
        url: `job-postings/${jobPostingId}/match`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, jobPostingId) => [{ type: 'JobPosting', id: jobPostingId }],
    }),
    matchCandidateToJob: builder.mutation<
      { jobApplication: any }, 
      { jobPostingId: string; candidateId: string }
    >({
      query: ({ jobPostingId, candidateId }) => ({
        url: `job-postings/${jobPostingId}/candidates/${candidateId}/match`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { jobPostingId }) => [{ type: 'JobPosting', id: jobPostingId }],
    }),
  }),
});

export const {
  useGetJobPostingsQuery,
  useGetJobPostingByIdQuery,
  useLazyGetJobPostingByIdQuery,
  useCreateJobPostingMutation,
  useUpdateJobPostingMutation,
  useDeleteJobPostingMutation,
  // Eşleştirme hook'ları
  useGetCandidatesForJobQuery,
  useTriggerMatchingMutation,
  useMatchCandidateToJobMutation,
} = jobPostingApi;
