import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  import.meta.env.VITE_API_URL ||
  "https://odasco-onlineregistration.onrender.com";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["User", "House", "Program", "School", "Student", "Log"],
  endpoints: (builder) => ({}),
});
