import { createCookieSessionStorage, redirect } from "@remix-run/node"; // Import redirect
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";

// Tạo session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth_session",
    sameSite: "none",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "a_fallback_secret_for_development_only"], // Sử dụng biến môi trường
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, //7 ngày
  },
});
export const { getSession, commitSession, destroySession } = sessionStorage;

// Tạo authenticator
export const authenticator = new Authenticator(sessionStorage);

// Cấu hình Auth0 strategy https://importify.io/auth/auth0/callback
const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Trả về user profile hoặc tạo user trong database của bạn
    return profile;
  }
);

authenticator.use(auth0Strategy);

export const logout = async (request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "/", { // Sử dụng biến động
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};