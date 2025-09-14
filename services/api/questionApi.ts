import { baseApi } from './base-api';

export interface QuestionRequest {
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  programmingLanguage?: string;
}

export interface QuestionExample {
  input: any; // Can be string or array
  output: any; // Can be string or array
  explanation: string;
}

export interface QuestionTestCase {
  input: any; // Can be string or array
  expectedOutput: any; // Can be string or array
}

export interface Question {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  constraints: string[];
  examples: QuestionExample[];
  hints: string[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp?: string;
    typescript?: string;
  };
  testCases: QuestionTestCase[];
}

export interface QuestionResponse {
  question: Question;
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateQuestion: builder.mutation<QuestionResponse, QuestionRequest>({
      query: (data) => ({
        url: 'ai/generate-question',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: QuestionResponse }) => {
        console.log('Question API Response:', response);
        return response.data || response;
      },
    }),
  }),
});

export const {
  useGenerateQuestionMutation,
} = questionApi;
