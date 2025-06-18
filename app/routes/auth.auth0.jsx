import { authenticator } from "../server/auth.server.js";

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");
  return authenticator.authenticate("auth0", request, {
    successRedirect: "https://reviews-aliexpress-bgp5zv8t6-lucanhs-projects.vercel.app/products",
    failureRedirect: "/",
    authParams: {
      prompt: prompt || "login",
    },
  });
};

export const action = ({ request }) => {
  return authenticator.authenticate("auth0", request, {
    successRedirect: "https://reviews-aliexpress-bgp5zv8t6-lucanhs-projects.vercel.app/products",
    failureRedirect: "https://reviews-aliexpress-bgp5zv8t6-lucanhs-projects.vercel.app/loi",
  });
};

export default function Auth0Route() {
  return null;
}
