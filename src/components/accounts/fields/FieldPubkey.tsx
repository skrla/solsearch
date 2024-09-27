import Image from "next/image";
import React from "react";

const FieldPubkey = () => {
  return (
    <div className="flex w-full text-white text-sm gap-2">
      <p>3TQHwtxPNaiPmvKcqbkNW2vrfw64uZQiXxp8qaemFtz4</p>
      <Image
        src="/images/copyGardien.svg"
        alt="Copy icon"
        height={14}
        width={14}
      />
    </div>
  );
};

export default FieldPubkey;
