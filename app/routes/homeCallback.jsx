import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";
  return authenticator.authenticate("auth0", request, {
    successRedirect: `${baseUrl}/products`,
    failureRedirect: `${baseUrl}/loi`,
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
