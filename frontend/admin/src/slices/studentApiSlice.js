// slices/studentApiSlice.js
import { apiSlice } from "./apiSlice";

const STUDENT_URL = "/api/students";

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentItems: builder.query({
      query: () => ({
        url: STUDENT_URL,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    addStudentItem: builder.mutation({
      query: (data) => ({
        url: STUDENT_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student", "Program"],
    }),
    updateStudentItem: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudentItem: builder.mutation({
      query: (id) => ({
        url: `${STUDENT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
    getRecentStudents: builder.query({
      query: () => ({
        url: `${STUDENT_URL}/recent`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    deleteUnregisteredStudents: builder.mutation({
      query: () => ({
        url: `${STUDENT_URL}/unregistered`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentItemsQuery,
  useAddStudentItemMutation,
  useUpdateStudentItemMutation,
  useDeleteStudentItemMutation,
  useGetRecentStudentsQuery,
  useDeleteUnregisteredStudentsMutation,
} = studentApiSlice;
