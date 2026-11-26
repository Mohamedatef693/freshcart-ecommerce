# FreshCart

FreshCart is a responsive online store built with Next.js, React, TypeScript, and Tailwind CSS. It uses the Route E-commerce API for the catalog, customer accounts, cart, wishlist, checkout, and orders.

## Start the app

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. To create a production build, run `npm run build`.

## Main pages

- Home: category collections and featured products
- Shop: product listing, search, and price sorting
- Product details
- Categories and category details
- Brands and brand details
- Register, login, password recovery, and change password
- Cart, wishlist, checkout, and order history
- Profile and contact information

## API integration

The app uses the Route E-commerce API at `https://ecommerce.routemisr.com/api/v1`. The API client in `src/API/services/client.ts` attaches the saved session token to authenticated requests. The token is stored in the browser as `freshcart-token`.

The interface calls the API for product, category, and brand catalogs; signup and signin; forgot, verify, reset, and change password; cart add, read, update, and remove; wishlist add, read, and remove; cash orders, Stripe checkout sessions, and order history.

## Project structure

```text
src/
  API/
  app/
  components/
  lib/
```

Run `npm run format` to format the TypeScript, CSS, JSON, and Markdown files under the configured paths.
