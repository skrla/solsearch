"use client";

import Title from "@/components/Title";
import TokenChart from "@/components/TokenChart";

export default function Home() {
  return (
    <main className="flex flex-col xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto">
      <Title title="SOLANA" />
      <TokenChart
        mintPubkey="So11111111111111111111111111111111111111112"
        name="SOL"
        decimals={9}
      />
    </main>
  );
}
