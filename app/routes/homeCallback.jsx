import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  // Thêm dòng này để kiểm tra giá trị VERCEL_URL trong logs Vercel.
  // Đảm bảo nó được đặt trước câu lệnh return.
  console.log("VERCEL_URL from homeCallback:", process.env.VERCEL_URL);
  return authenticator.authenticate("auth0", request, {
    successRedirect: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/products` : "/products",
    failureRedirect: "",
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
