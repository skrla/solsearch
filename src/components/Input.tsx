"use client";
import Image from "next/image";
import { useState } from "react";

type InputTypeProps = {
  onClick: (pubkey: string) => void;
};

export default function Input({ onClick }: InputTypeProps) {
  const [key, setKey] = useState<string>("");
  return (
    <div
      className="relative flex w-full lg:w-[950px] items-center"
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(key);
      }}
    >
      <input
        placeholder="Write public key or transaction to search:"
        accessKey="s"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="px-5 py-3 m-2 w-full h-16 bg-gray-900 border border-blue-500 rounded-lg placeholder:font-open"
      ></input>
      <Image
        height={37}
        width={38}
        src="/images/search.svg"
        alt="Search icon"
        className="absolute right-5 h-10 w-10 cursor-pointer"
        onClick={() => onClick(key)}
      />
    </div>
  );
}
