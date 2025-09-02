import { baseApi } from './base-api';
import { IUser } from '@/schemas/user.model';
import { InviteUserFormData, UpdateUserRolesFormData } from '@/lib/validation-schemas';

export const personnelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonnel: builder.query<{ users: IUser[] }, void>({
      query: () => 'personnel',
      providesTags: ['User'],
    }),
    inviteUser: builder.mutation<{ user: IUser }, InviteUserFormData>({
      query: (data) => ({
        url: 'personnel',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRoles: builder.mutation<{ user: IUser }, { id: string; data: UpdateUserRolesFormData }>({
      query: ({ id, data }) => ({
        url: `personnel/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deactivateUser: builder.mutation<{ user: IUser }, string>({
      query: (id) => ({
        url: `personnel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getInterviewers: builder.query<{ interviewers: IUser[] }, void>({
      query: () => 'personnel/interviewers',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetPersonnelQuery,
  useInviteUserMutation,
  useUpdateUserRolesMutation,
  useDeactivateUserMutation,
  useGetInterviewersQuery,
} = personnelApi;
