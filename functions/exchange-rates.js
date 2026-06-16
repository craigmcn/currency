export default async () => {
  if (!process.env.EXCHANGE_RATES_API_KEY) {
    return new Response(
      JSON.stringify({
        error: { message: "Exchange rates API key is not configured" },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${process.env.EXCHANGE_RATES_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Failed to fetch exchange rates" } }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = { path: "/api/exchange-rates/latest" };
