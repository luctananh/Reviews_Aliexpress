import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  // Thêm dòng này để kiểm tra giá trị VERCEL_URL trong logs Vercel
  console.log("VERCEL_URL:", process.env.VERCEL_URL); // Thêm dòng này để kiểm tra
  return authenticator.authenticate("auth0", request, {
    successRedirect: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/products` : "/products",
    failureRedirect: "",
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
