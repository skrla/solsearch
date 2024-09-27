import React from "react";
import AccountData from "./AccountData";

const AccountDataRow = (/*{ children }: { children: React.ReactNode }*/) => {
  return (
    <div className="flex w-full justify-center items-start border-b border-border">
      <AccountData />
      <AccountData />
      <AccountData />
      <AccountData />
    </div>
  );
};

export default AccountDataRow;
