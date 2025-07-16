import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";

// Tạo session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "a_fallback_secret_for_development_only"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, //7 days
  },
});
export const { getSession, commitSession, destroySession } = sessionStorage;

// Tạo authenticator
export const authenticator = new Authenticator(sessionStorage);

// Cấu hình Auth0 strategy https://importify.io/auth/auth0/callback
const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/homecallback` : "http://localhost:3000/homecallback",
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: "dev-qoakuhj30oocsvf4.us.auth0.com",
    scope: "openid profile email",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    return profile;
  }
);
authenticator.use(auth0Strategy);
export const logout = async (request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};