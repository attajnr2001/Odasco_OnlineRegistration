// slices/houseApiSlice.js
import { apiSlice } from "./apiSlice";

const HOUSE_URL = "/api/houses";

export const houseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHouseItems: builder.query({
      query: () => ({
        url: HOUSE_URL,
        method: "GET",
      }),
      providesTags: ["House"],
    }),
    addHouseItem: builder.mutation({
      query: (data) => ({
        url: HOUSE_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["House"],
    }),
    updateHouseItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${HOUSE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["House"],
    }),
    deleteHouseItem: builder.mutation({
      query: (id) => ({
        url: `${HOUSE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["House"],
    }),
  }),
});

export const {
  useGetHouseItemsQuery,
  useAddHouseItemMutation,
  useUpdateHouseItemMutation,
  useDeleteHouseItemMutation,
} = houseApiSlice;
