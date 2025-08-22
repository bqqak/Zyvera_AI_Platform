This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Payments: Test vs Live

This app renders a Pricing Table via Clerk, which uses Stripe under the hood. If you see "Development mode" and "Pay with test card," your environment is using test keys.

To enable real (live) payments:

1. Create a Stripe Pricing Table in Stripe Dashboard (LIVE mode) and copy its Pricing Table ID. ✓
2. Copy your Stripe LIVE publishable key. ✓
3. Set the following environment variables in your production environment (e.g., Vercel Project Settings → Environment Variables): ✓
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_live_publishable_key>
   - NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=<your_live_pricing_table_id>
4. Use your Clerk LIVE keys in production: ✓
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   - CLERK_SECRET_KEY=sk_live_...
5. Deploy. The homepage Pricing Table will automatically use the live table and live key in production. ✓

Notes:
- In development (local), if you don’t set these env vars, the app will fall back to the default <PricingTable /> which typically shows Stripe test mode.
- Make sure your Clerk instance and allowed origins are configured for your production domain.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
