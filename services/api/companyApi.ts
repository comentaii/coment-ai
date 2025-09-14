import { baseApi } from './base-api';
import { ICompany } from '@/schemas/company.model';

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query<ICompany[], void>({
      query: () => 'companies',
      transformResponse: (response: { data: ICompany[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Companies' as const, id: _id as string })),
              { type: 'Companies', id: 'LIST' },
            ]
          : [{ type: 'Companies', id: 'LIST' }],
    }),
    createCompany: builder.mutation<ICompany, Partial<ICompany>>({
      query: (body) => ({
        url: 'companies',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Companies', id: 'LIST' }],
    }),
    updateCompany: builder.mutation<ICompany, { id: string; data: Partial<ICompany> }>({
      query: ({ id, data }) => ({
        url: `companies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Companies', id }, { type: 'Companies', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllCompaniesQuery, useCreateCompanyMutation, useUpdateCompanyMutation } = companyApi;
