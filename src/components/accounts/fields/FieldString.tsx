import Image from "next/image";
import React from "react";

const FieldString = ({ name, pubkey }: { name: string; pubkey?: boolean }) => {
  return pubkey ? (
    <div className="flex w-full text-white text-sm gap-2">
      <p>{name}</p>
      <Image
        src="/images/copyGardien.svg"
        alt="Copy icon"
        height={14}
        width={14}
      />
    </div>
  ) : (
    <p className="flex w-full text-white text-sm">{name}</p>
  );
};

export default FieldString;
