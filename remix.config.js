/** @type {import('@remix-run/dev').AppConfig} */
export default {
  // Build server output vào đúng thư mục cần thiết cho deploy
  serverBuildPath: "build/index.js",
  // Nếu dùng Remix v2, bạn có thể bật các future flags này:
  future: {
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
    v2_headers: true,
    serverModuleFormat: 'esm',
  },
};