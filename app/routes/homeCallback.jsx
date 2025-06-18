import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  return authenticator.authenticate("auth0", request, {
    successRedirect: "https://reviews-aliexpress-bgp5zv8t6-lucanhs-projects.vercel.app/products",
    failureRedirect: "",
  });
};
export default function Auth0CallbackRoute() {
  return null;
}
