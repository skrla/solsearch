import React from "react";
import FieldTitle from "./fields/FieldTitle";
import FieldPubkey from "./fields/FieldPubkey";
import FieldString from "./fields/FieldString";
import FieldBoolean from "./fields/FieldBoolean";

const AccountData = (/*{ children }: { children: React.ReactNode }*/) => {
  return (
    <div className="w-full bg-dark flex flex-col items-start justify-start p-4">
      <FieldTitle />
      <FieldBoolean />
    </div>
  );
};

export default AccountData;
