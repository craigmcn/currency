export default async () => {
  const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${process.env.EXCHANGE_RATES_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/exchange-rates/latest" };
