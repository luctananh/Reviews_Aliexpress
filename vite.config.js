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
        v3_throwAbortReason: true
      }
    })
  ],
  ssr: {
    noExternal: [
      /@tanstack\/.*/,
      /@nextui-org\/.*/,
      /@react-aria\/.*/,
      /@react-stately\/.*/
    ]
  },
  optimizeDeps: {
    include: ['@rollup/rollup-linux-x64-gnu']
  }
});
