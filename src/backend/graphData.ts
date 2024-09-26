import { TokenGraphType } from "@/types/pagetypes";

export const graphDataToken = async (mintKey: string) => {
  const apikey = process.env.NEXT_PUBLIC_COIN_GECKO_KEY;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": apikey || "",
    },
  };
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/solana/contract/" +
      mintKey +
      "/market_chart?vs_currency=usd&days=90&interval=daily&precision=full",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
  let graphData: TokenGraphType | null = null;
  if (response) {
    const prices = response.prices.map((entry: [number, number]) => ({
      timestamp: new Date(entry[0]),
      price: entry[1],
    }));
    const marketCaps = response.market_caps.map((entry: [number, number]) => ({
      timestamp: new Date(entry[0]),
      marketCap: entry[1],
    }));
    graphData = {
      prices: prices,
      marketCap: marketCaps,
    };
  }
  return graphData;
};
