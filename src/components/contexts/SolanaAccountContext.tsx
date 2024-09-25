"use client"
import { SolanaAccount } from "@/types/dataAccounts";
import { createContext, useContext, useState, ReactNode } from "react";

type SolanaAccountContextType = {
  solanaAccount: SolanaAccount | null;
  setSolanaAccount: (solanaAccount: SolanaAccount | null) => void;
};

const SolanaAccountContext = createContext<
  SolanaAccountContextType | undefined
>(undefined);

export const SolanaAccountProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [solanaAccount, setSolanaAccount] = useState<SolanaAccount | null>(
    null
  );

  return (
    <SolanaAccountContext.Provider value={{ solanaAccount, setSolanaAccount }}>
      {children}
    </SolanaAccountContext.Provider>
  );
};

export const useSolanaAccount = () => {
  const context = useContext(SolanaAccountContext);

  if (!context) {
    throw new Error(
      "useSolanaAccount must be used within a SolanaAccountProvider"
    );
  }

  return context;
};
