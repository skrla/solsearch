"use client";
import { useState } from "react";
import { MdScreenSearchDesktop } from "react-icons/md";

type InputTypeProps = {
  onClick: (pubkey: string) => void;
};

export default function Input({ onClick }: InputTypeProps) {
  const [key, setKey] = useState<string>("");
  return (
    <div className="relative flex w-full p-5 lg:w-[50%] items-center">
      <input
        placeholder="Write public key to search:"
        accessKey="s"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="p-5 m-2 w-full bg-gray-900 border border-blue-500"
      ></input>
      <MdScreenSearchDesktop
        className="h-10 w-10"
        onClick={() => onClick(key)}
      />
    </div>
  );
}
