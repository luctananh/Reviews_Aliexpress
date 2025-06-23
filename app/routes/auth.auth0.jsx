import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""; // Đảm bảo baseUrl được định nghĩa
  return authenticator.authenticate("auth0", request, {
    successRedirect: `${baseUrl}/products`,
    failureRedirect: "/",
    authParams: {
      prompt: prompt || "login",
    },
  });
};
export const action = ({ request }) => {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""; // Đảm bảo baseUrl được định nghĩa
  return authenticator.authenticate("auth0", request, {
    successRedirect: `${baseUrl}/products`,
    failureRedirect: `${baseUrl}/loi`,
  });
};
export default function Auth0Route() {
  return null;
}
