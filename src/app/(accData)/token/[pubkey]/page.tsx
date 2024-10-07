"use client";
import {
  getAccountData,
  getFullAccountData,
  getTransactions,
} from "@/backend/accountData";
import { convertToTokenPageType } from "@/backend/converters";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import MainInfo from "@/components/accounts/MainInfo";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import Title from "@/components/Title";
import TokenChart from "@/components/TokenChart";
import TransactionTable from "@/components/TransactionTable";
import { TokenPageType } from "@/types/pagetypes";
import { TransactionType } from "@/types/transaction";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TokensPage() {
  const [tokenData, setTokenData] = useState<TokenPageType>();
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const { connection } = useConnection();
  const params = useParams();

  async function fetchTransactions(pubkey?: string) {
    let beforeSignature;
    if (transactions.length > 0) {
      const lastTransaction = transactions.at(-1);
      if (lastTransaction) {
        beforeSignature = lastTransaction.transaction?.signatures[0];
      }
    }
    if (tokenData) {
      const convTrans = await getTransactions(
        connection,
        new PublicKey(tokenData.pubkey),
        beforeSignature
      );

      const newTransactions: TransactionType[] = [...transactions];
      convTrans
        .sort((t, tx) => {
          return (tx.blockTime || 0) - (t.blockTime || 0);
        })
        .forEach((t) => {
          newTransactions.push(t);
        });
      setTransactions(newTransactions);
    }
    if (pubkey) {
      const convTrans = await getTransactions(
        connection,
        new PublicKey(pubkey),
        beforeSignature
      );

      const newTransactions: TransactionType[] = [...transactions];
      convTrans
        .sort((t, tx) => {
          return (tx.blockTime || 0) - (t.blockTime || 0);
        })
        .forEach((t) => {
          newTransactions.push(t);
        });
      setTransactions(newTransactions);
    }
  }

  useEffect(() => {
    async function getData() {
      let fullSolanaAccount;
      if (solanaAccount) {
        fetchTransactions(solanaAccount.pubkey.toString());
        fullSolanaAccount = await getAccountData(
          connection,
          solanaAccount.pubkey,
          solanaAccount
        );
      } else {
        fetchTransactions(params.pubkey as string);
        fullSolanaAccount = await getFullAccountData(
          connection,
          params.pubkey as string
        );
      }
      setSolanaAccount(fullSolanaAccount ? fullSolanaAccount : null);
      if (fullSolanaAccount) {
        const tokenDataConv = convertToTokenPageType(fullSolanaAccount);
        setTokenData(tokenDataConv);
      }
    }
    getData();
  }, []);

  return tokenData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto ">
      <Title title={"Token"} />
      <div className="w-full flex justify-center items-start">
        <MainInfo img={tokenData.img || ""} />
        <div className="w-full flex flex-col my-5 bg-dark">
          <AccountDataGroup>
            <AccountDataRow>
              <AccountData pubkey={tokenData.pubkey} title="Token pubkey" />
              <AccountData name={tokenData.name} title="Name" />
              <AccountData name={tokenData.type.toUpperCase()} title="Type" />
            </AccountDataRow>
            <AccountDataRow>
              <AccountData pubkey={tokenData.mintAuth} title="Mint authority" />
              {tokenData.supply > 0 ? (
                <AccountData
                  name={tokenData.supply.toLocaleString()}
                  title="Supply"
                />
              ) : (
                <AccountData
                  name={tokenData.balance.toLocaleString()}
                  title="Balance"
                />
              )}
              <AccountData
                boolean={tokenData.tokenExt}
                title="Token extensions"
              />
            </AccountDataRow>
            {tokenData.freezeAuth !== "" && (
              <AccountDataRow>
                <AccountData
                  pubkey={tokenData.freezeAuth}
                  title="Freeze authority"
                />
              </AccountDataRow>
            )}
            <AccountDataRow>
              <AccountData pubkey={tokenData.owner} title="Owner" />
            </AccountDataRow>
          </AccountDataGroup>
        </div>
      </div>
      {tokenData.type === "mint" ? (
        <TokenChart
          mintPubkey={tokenData.pubkey}
          name={tokenData.name}
          decimals={tokenData.decimals}
        />
      ) : (
        <TokenChart
          mintPubkey={tokenData.mintAuth}
          name={tokenData.name}
          decimals={tokenData.decimals}
        />
      )}
      {transactions.length > 0 ? (
        <TransactionTable
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
      ) : null}
    </main>
  ) : null;
}
