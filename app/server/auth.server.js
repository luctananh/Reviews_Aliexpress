import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { redirect } from "@remix-run/node";
import { prisma } from "../server/db.server";
// Tạo session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["ZySbrdFDYXG2o/a6XG+XaTQp7fSoKsbGBnTcXkQ7Uzc="],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, //7 ngày
  },
});
export const { getSession, commitSession, destroySession } = sessionStorage;
// Tạo authenticator
export const authenticator = new Authenticator(sessionStorage);

// Cấu hình Auth0 strategy
const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: "http://localhost:5173/homeCallback",
    clientID: "RiJ9LHlQeFTpUKrFSTV0cxSZfxZds3ro",
    clientSecret:
      "MIyt3IXupYIJ9AWdDUpSqkIsN970EhE1y7Xj1NT7b8vY8zkqGmBBorLz6qIY8_Zk",
    domain: "dev-qoakuhj30oocsvf4.us.auth0.com",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Trả về user profile hoặc tạo user trong database của bạn
    return profile;
  }
);

authenticator.use(auth0Strategy);

// Lấy thông tin người dùng từ session
export async function getUserFromSession(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}


export const logout = async (request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/_index", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

