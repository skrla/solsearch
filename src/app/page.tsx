"use client";

import AccountDataRow from "@/components/accounts/AccountDataRow";
import MainInfo from "@/components/accounts/MainInfo";
import Title from "@/components/Title";

export default function Home() {
  return (
    <main className="flex flex-col xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto">
      <Title title="NFT" />
      <div className="w-full flex justify-center items-start">
        <MainInfo img="https://fx5qkqcitujirfqffn2hrt6672xb37t3n5olozdrknlqefsmzcha.arweave.net/LfsFQEidEoiWBSt0eM_e_q4d_ntvXLdkcVNXAhZMyI4" />
        <div className="w-full flex flex-col my-5">
          {/* <AccountDataRow />
          <AccountDataRow />
          <AccountDataRow />
          <AccountDataRow /> */}
        </div>
      </div>
    </main>
  );
}
