import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add any default headers here
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Challenge', 'Interview', 'Company', 'JobPosting', 'CandidateProfile'],
}); 