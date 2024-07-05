import { apiSlice } from "./apiSlice";
const CLIENTS_URL = "/api/clients";

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${CLIENTS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${CLIENTS_URL}/logout`,
        method: "POST",
      }),
    }),
    updatePaymentStatus: builder.mutation({
      query: (studentId) => ({
        url: `${CLIENTS_URL}/update-payment`,
        method: "POST",
        body: { studentId },
      }),
    }),
    getStudentDetails: builder.mutation({
      query: (id) => ({
        url: `${CLIENTS_URL}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdatePaymentStatusMutation,
  useGetStudentDetailsMutation,
} = clientApiSlice;
