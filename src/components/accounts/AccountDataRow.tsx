import React from "react";
import AccountData from "./AccountData";

const AccountDataRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start">
      {children}
    </div>
  );
};

export default AccountDataRow;
