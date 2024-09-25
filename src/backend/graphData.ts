export const graphDataToken = async (mintKey: string) => {
  const apikey = process.env.NEXT_PUBLIC_COIN_GECKO_KEY;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": apikey || "",
    },
  };
  const response = fetch(
    "https://api.coingecko.com/api/v3/coins/solana/contract/" +
      mintKey +
      "/market_chart?vs_currency=usd&days=90&interval=daily&precision=full",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.error(err));
  return response;
};
