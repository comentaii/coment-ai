import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add any default headers here
      return headers;
    },
    // Transform response to extract data from ResponseHandler wrapper
    transformResponse: (response: any) => {
      // If response has success and data fields (ResponseHandler format)
      if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        return response.data;
      }
      // Otherwise return response as is
      return response;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Challenge', 'Interview', 'Company', 'JobPosting', 'CandidateProfile', 'Candidates', 'InterviewSession'],
}); 