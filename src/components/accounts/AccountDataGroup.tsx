import React from "react";

const AccountDataGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full border-b border-border">
      {children}
    </div>
  );
};

export default AccountDataGroup;
