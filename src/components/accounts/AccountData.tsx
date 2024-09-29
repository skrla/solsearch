import React from "react";
import FieldTitle from "./fields/FieldTitle";
import FieldPubkey from "./fields/FieldPubkey";
import FieldString from "./fields/FieldString";
import FieldBoolean from "./fields/FieldBoolean";
import { string } from "@metaplex-foundation/umi/serializers";

type AccountDataProps = {
  title?: string;
  name?: string;
  pubkey?: string;
  boolean?: boolean;
};

const AccountData = ({ title, name, pubkey, boolean }: AccountDataProps) => {
  return (
    <div className="flex flex-1 flex-col gap-1 items-start justify-start p-4">
      {title && <FieldTitle title={title} />}
      {name && <FieldString name={name} />}
      {pubkey && <FieldString name={pubkey} pubkey />}
      {boolean !== undefined && <FieldBoolean boolean={boolean} />}
    </div>
  );
};

export default AccountData;
