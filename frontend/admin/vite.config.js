import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/P
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env": env,
    },
    optimizeDeps: {
      exclude: ["@reduxjs/toolkit/query/react"],
    },
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "https://odasco-onlineregistration.onrender.com",
          changeOrigin: true,
        },
      },
    },
  };
});
