"use client";

import AccountData from "@/components/accounts/AccountData";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import AccountInfo from "@/components/accounts/MainInfo";
import Title from "@/components/Title";

export default function Home() {
  return (
    <main className="flex flex-col m-auto">
      <Title title="NFT" />
      <div className="w-full flex justify-center items-start">
        <AccountInfo />
        <div className="w-full flex flex-col m-5">
          <AccountDataRow />
          <AccountDataRow />
          <AccountDataRow />
          <AccountDataRow />
        </div>
      </div>
    </main>
  );
}
