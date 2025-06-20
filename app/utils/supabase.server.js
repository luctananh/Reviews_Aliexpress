import { createServerClient, serialize, parse } from "@supabase/ssr";

export function createClient(request) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );
}