// slices/programApiSlice.js
import { apiSlice } from "./apiSlice";

const PROGRAM_URL = "/api/programs";

export const programApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProgramItems: builder.query({
      query: () => ({
        url: PROGRAM_URL,
        method: "GET",
      }),
      providesTags: ["Program"],
    }),
    addProgramItem: builder.mutation({
      query: (data) => ({
        url: PROGRAM_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),
    updateProgramItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PROGRAM_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),
    deleteProgramItem: builder.mutation({
      query: (id) => ({
        url: `${PROGRAM_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),
  }),
});

export const {
  useGetProgramItemsQuery,
  useAddProgramItemMutation,
  useUpdateProgramItemMutation,
  useDeleteProgramItemMutation,
} = programApiSlice;
