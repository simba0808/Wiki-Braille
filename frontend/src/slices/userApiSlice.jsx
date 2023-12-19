import { data } from "autoprefixer";
import { apiSlice } from "./apiSlice";

const BASE_URL = "/api/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/update`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/logout`,
        method: "POST",
      }),
    }),
  })
});

export const { useLoginMutation, useRegisterMutation, useUpdateUserMutation, useLogoutMutation } = userApiSlice;