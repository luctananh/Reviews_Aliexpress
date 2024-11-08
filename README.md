- Thêm ".env"
  + DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
  + AUTH0_DOMAIN = add Domain auth0
  + AUTH0_CLIENT_ID = add clientID auth0
  + AUTH0_CLIENT_SECRET= add clientSecret auth0
  + AUTH0_CALLBACK_URL = add callbackURL auth0
  + SESSION_SECRET = Add
# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
