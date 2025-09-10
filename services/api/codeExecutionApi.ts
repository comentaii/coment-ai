import { baseApi } from './base-api';

export interface TestCase {
  input: any;
  expectedOutput: any;
}

export interface TestResult {
  input: any;
  expectedOutput: any;
  actualOutput: any;
  passed: boolean;
  error?: string;
  executionTime?: number;
}

export interface ExecuteCodeRequest {
  code: string;
  language: string;
  testCases: TestCase[];
}

export interface ExecuteCodeResponse {
  results: TestResult[];
  totalPassed: number;
  totalTests: number;
  overallPassed: boolean;
  executionTime: number;
}

export const codeExecutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    executeCode: builder.mutation<ExecuteCodeResponse, ExecuteCodeRequest>({
      query: (data) => ({
        url: 'code/execute',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        console.log('Code execution response:', response);
        return response.data || response;
      },
    }),
  }),
});

export const {
  useExecuteCodeMutation,
} = codeExecutionApi;
