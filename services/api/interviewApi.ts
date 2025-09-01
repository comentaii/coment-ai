import { baseApi } from './base-api';
import { CreateInterviewDto } from '@/lib/validation-schemas';
import { IInterview } from '@/schemas';

// Detaylı mülakat verisi için bir tip oluşturalım
type InterviewDetailsResponse = IInterview & { userRole: 'candidate' | 'interviewer' };

export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInterview: builder.mutation<IInterview, CreateInterviewDto>({
      query: (body) => ({
        url: 'interviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Interview'], // Yeni mülakat eklenince mülakat listelerini yenile
    }),
    getInterviewDetails: builder.query<InterviewDetailsResponse, string>({
      query: (interviewId) => `interviews/${interviewId}`,
      providesTags: (result, error, id) => [{ type: 'Interview', id }],
    }),
  }),
});

export const {
  useCreateInterviewMutation,
  useGetInterviewDetailsQuery,
} = interviewApi;
