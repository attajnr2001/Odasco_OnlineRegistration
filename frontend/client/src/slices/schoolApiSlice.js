// slices/schoolApiSlice.js
import { apiSlice } from "./apiSlice";

const SCHOOL_URL = "/api/schools";

export const schoolApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolItems: builder.query({
      query: () => ({
        url: SCHOOL_URL,
        method: "GET",
      }),
      providesTags: ["School"],
    }),
    addSchoolItem: builder.mutation({
      query: (data) => ({
        url: SCHOOL_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["School"],
    }),
    updateSchoolItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${SCHOOL_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["School"],
    }),
    deleteSchoolItem: builder.mutation({
      query: (id) => ({
        url: `${SCHOOL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["School"],
    }),
  }),
});

export const {
  useGetSchoolItemsQuery,
  useAddSchoolItemMutation,
  useUpdateSchoolItemMutation,
  useDeleteSchoolItemMutation,
} = schoolApiSlice;
