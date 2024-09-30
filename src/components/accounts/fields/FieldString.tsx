"use client";
import { delay } from "@/backend/accountData";
import Image from "next/image";
import React, { useState } from "react";

const FieldString = ({ name, pubkey }: { name: string; pubkey?: boolean }) => {
  const [copy, setCopy] = useState("/images/copyGardien.svg");
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopy("/images/check.svg");
      await delay(1000);
      setCopy("/images/copyGardien.svg");
    } catch {
      console.error("Failed to copy: ", text);
    }
  };
  return pubkey ? (
    <div
      className="flex w-full text-white text-sm gap-2 cursor-pointer"
      onClick={() => handleCopy(name)}
    >
      <p>{name}</p>
      <Image src={copy} alt="Copy icon" height={14} width={14} />
    </div>
  ) : (
    <p className="flex w-full text-white text-sm">{name}</p>
  );
};

export default FieldString;
