import { redirect } from "@remix-run/node";
import { authenticator } from "../server/auth.server.js";

export const action = async ({ request }) => {
  const auth0Domain = "dev-c841kfnfmsjcrhcr.us.auth0.com";
  const clientId = "UpT0esnQTQjHDg2wBr4MMBQexfZvsFs2";
  const returnTo = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "/";

  await authenticator.logout(request, {
    redirectTo: returnTo,
  });

  return redirect(
    `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(
      returnTo
    )}`
  );
};

export const loader = async () => {
  return redirect("/");
};
