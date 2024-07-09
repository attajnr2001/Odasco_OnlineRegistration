// slices/logApiSlice.js
import { apiSlice } from "./apiSlice";

const LOG_URL = "/api/logs";

export const logApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogItems: builder.query({
      query: () => ({
        url: LOG_URL,
        method: "GET",
      }),
      providesTags: ["Log"],
    }),
    createLogItem: builder.mutation({
      query: (data) => ({
        url: LOG_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Log"],
    }),
    createPublicLogItem: builder.mutation({
      query: (data) => ({
        url: `${LOG_URL}/public`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreatePublicLogItemMutation,
  useGetLogItemsQuery,
  useCreateLogItemMutation,
} = logApiSlice;
