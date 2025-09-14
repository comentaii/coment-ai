import { baseApi } from './base-api';
import { IUser } from '@/schemas/user.model';
import { UpdateUserFormData, InviteUserFormData } from '@/lib/validation-schemas';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUser[], void>({
      query: () => 'users',
      transformResponse: (response: { data: IUser[] }) => response.data,
      providesTags: (result) => {
        const users = result || [];
        return users
          ? [
              ...users.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }];
      },
    }),
    updateUser: builder.mutation<
      IUser,
      { id: string; data: UpdateUserFormData }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }, { type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation<IUser, InviteUserFormData>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation } = userApi;
