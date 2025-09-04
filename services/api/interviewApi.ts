import { baseApi } from './base-api';
import { CreateInterviewSessionDto, UpdateInterviewSessionDto, CreateInterviewDto } from '@/lib/validation-schemas';
import { IInterviewSession, IInterviewSlot, IInterview } from '@/schemas';

export interface InterviewSessionWithSlots {
  session: IInterviewSession;
  slots: IInterviewSlot[];
}

export interface CreateInterviewSessionRequest {
  jobPostingId: string;
  interviewerId: string;
  scheduledDate: string;
  candidateIds: string[];
  notes?: string;
}

export interface UpdateInterviewSessionRequest {
  scheduledDate?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface GetInterviewSessionsParams {
  status?: string;
  interviewerId?: string;
  jobPostingId?: string;
  limit?: number;
  skip?: number;
}

export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create simple interview
    createInterview: builder.mutation<{
      interview: IInterview;
    }, CreateInterviewDto>({
      query: (data) => ({
        url: 'interviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Interview'],
    }),

    // Create interview session
    createInterviewSession: builder.mutation<{
      session: IInterviewSession;
      slots: IInterviewSlot[];
    }, CreateInterviewSessionRequest>({
      query: (data) => ({
        url: 'interview-sessions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InterviewSession'],
    }),

    // Get interview sessions
    getInterviewSessions: builder.query<{
      sessions: IInterviewSession[];
    }, GetInterviewSessionsParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        if (params.interviewerId) searchParams.append('interviewerId', params.interviewerId);
        if (params.jobPostingId) searchParams.append('jobPostingId', params.jobPostingId);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.skip) searchParams.append('skip', params.skip.toString());
        
        return `interview-sessions?${searchParams.toString()}`;
      },
      providesTags: ['InterviewSession'],
    }),

    // Get interview session by ID with slots
    getInterviewSessionById: builder.query<InterviewSessionWithSlots, string>({
      query: (id) => `interview-sessions/${id}`,
      providesTags: (result, error, id) => [
        { type: 'InterviewSession', id },
        'InterviewSession',
      ],
    }),

    // Update interview session
    updateInterviewSession: builder.mutation<{
      session: IInterviewSession;
    }, { id: string; data: UpdateInterviewSessionRequest }>({
      query: ({ id, data }) => ({
        url: `interview-sessions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InterviewSession', id },
        'InterviewSession',
      ],
    }),

    // Cancel interview session
    cancelInterviewSession: builder.mutation<{
      session: IInterviewSession;
    }, string>({
      query: (id) => ({
        url: `interview-sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'InterviewSession', id },
        'InterviewSession',
      ],
    }),

    // Get upcoming sessions
    getUpcomingSessions: builder.query<{
      sessions: IInterviewSession[];
    }, { limit?: number }>({
      query: ({ limit = 10 } = {}) => `interview-sessions?status=scheduled&limit=${limit}`,
      providesTags: ['InterviewSession'],
    }),

    // Get sessions by interviewer
    getSessionsByInterviewer: builder.query<{
      sessions: IInterviewSession[];
    }, { interviewerId: string; status?: string; limit?: number; skip?: number }>({
      query: ({ interviewerId, status, limit = 50, skip = 0 }) => {
        const searchParams = new URLSearchParams();
        searchParams.append('interviewerId', interviewerId);
        if (status) searchParams.append('status', status);
        searchParams.append('limit', limit.toString());
        searchParams.append('skip', skip.toString());
        
        return `interview-sessions?${searchParams.toString()}`;
      },
      providesTags: ['InterviewSession'],
    }),
  }),
});

export const {
  useCreateInterviewMutation,
  useCreateInterviewSessionMutation,
  useGetInterviewSessionsQuery,
  useGetInterviewSessionByIdQuery,
  useUpdateInterviewSessionMutation,
  useCancelInterviewSessionMutation,
  useGetUpcomingSessionsQuery,
  useGetSessionsByInterviewerQuery,
} = interviewApi;

// Additional exports for backward compatibility
export const useGetInterviewDetailsQuery = useGetInterviewSessionByIdQuery;
