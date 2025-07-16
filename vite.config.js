import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";

installGlobals();
 
export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      serverBuildPath: "build/index.js", // Thêm dòng này
    }),
  ],
  ssr: {
    noExternal: [
      /@tanstack\/.*/, // Catch all @tanstack packages
      /@nextui-org\/.*/, // Catch all @nextui-org packages
      /@react-aria\/.*/, // Catch all @react-aria packages
      /@react-stately\/.*/, // Catch all @react-stately packages
    ],
  },
});
