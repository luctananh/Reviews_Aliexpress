import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  return authenticator.authenticate("auth0", request, {
    successRedirect: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/products` : "/products",
    failureRedirect: "",
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
