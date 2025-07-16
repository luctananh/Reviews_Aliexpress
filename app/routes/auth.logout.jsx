import { redirect } from "@remix-run/node";
import { authenticator } from "../server/auth.server.js";

export const action = async ({ request }) => {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";
  const returnTo = `${baseUrl}/`;
  await authenticator.logout(request, {
    redirectTo: returnTo,
  });
  return redirect(
    `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`
  );
};

export const loader = async () => {
  return redirect("/");
};
