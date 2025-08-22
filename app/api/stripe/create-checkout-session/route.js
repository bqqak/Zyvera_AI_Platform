export async function POST(request) {
  try {
    const { priceId } = await request.json();

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment, and set NEXT_PUBLIC_STRIPE_PRICE_PRO / NEXT_PUBLIC_STRIPE_PRICE_TEAM for pricing tiers.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!priceId || typeof priceId !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid priceId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const origin = new URL(request.url).origin;
    const success_url = `${origin}/checkout/success`;
    const cancel_url = `${origin}/checkout/cancel`;

    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("success_url", success_url);
    params.append("cancel_url", cancel_url);
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("allow_promotion_codes", "true");
    // Optionally set automatic_tax if desired:
    // params.append("automatic_tax[enabled]", "true");

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      // Stripe requires TLS; Next runtime will handle fetch
    });

    const data = await resp.json();

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "Stripe error" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ id: data.id, url: data.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
