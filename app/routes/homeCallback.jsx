import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  // Log VERCEL_URL để kiểm tra giá trị thực tế trên Vercel Logs
  console.log("VERCEL_URL from homeCallback:", process.env.VERCEL_URL); 
  return authenticator.authenticate("auth0", request, {
    successRedirect: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/products` : "/products",
    failureRedirect: "",
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
