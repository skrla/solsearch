"use client";
import { convertToNftPageType } from "@/backend/converters";
import { useSolanaAccount } from "@/components/contexts/SolanaAccountContext";
import { AssetsNFT, NftPageType } from "@/types/pagetypes";
import { useEffect, useState } from "react";
import AccountDataRow from "@/components/accounts/AccountDataRow";
import Title from "@/components/Title";
import MainInfo from "@/components/accounts/MainInfo";
import AccountData from "@/components/accounts/AccountData";
import AccountDataGroup from "@/components/accounts/AccountDataGroup";
import RowTitle from "@/components/accounts/RowTitle";
import { NFTAttribute } from "@/types/metadata";
import {
  getAccountData,
  getCollectionData,
  getFullAccountData,
  getTransactions,
} from "@/backend/accountData";
import { useConnection } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import SwiperData from "@/components/SwiperData";
import { TransactionType } from "@/types/transaction";
import { PublicKey } from "@solana/web3.js";
import TransactionTable from "@/components/TransactionTable";

export default function NFTPage() {
  const { solanaAccount, setSolanaAccount } = useSolanaAccount();
  const { connection } = useConnection();
  const params = useParams();
  const [nftData, setNftData] = useState<NftPageType>();
  const [chunkedAttributes, setChunkedAttributes] = useState<NFTAttribute[][]>(
    []
  );
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const [collection, setCollection] = useState<AssetsNFT[]>([]);

  const fillChunkedAttributes = () => {
    if (nftData && nftData.attributes && nftData.attributes.length > 0) {
      const newChunkedAttributes: NFTAttribute[][] = [];
      for (let i = 0; i < nftData.attributes.length; i += 3) {
        newChunkedAttributes.push(nftData.attributes.slice(i, i + 3));
      }
      setChunkedAttributes(newChunkedAttributes);
    }
  };

  async function fetchTransactions(pubkey?: string) {
    let beforeSignature;
    if (transactions.length > 0) {
      const lastTransaction = transactions.at(-1);
      if (lastTransaction) {
        beforeSignature = lastTransaction.transaction?.signatures[0];
      }
    }
    if (nftData) {
      const convTrans = await getTransactions(
        connection,
        new PublicKey(nftData.pubkey),
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

      if (fullSolanaAccount?.metadata) {
        const nftDataConv = convertToNftPageType(
          fullSolanaAccount?.metadata || null
        );
        setNftData(nftDataConv);
        if (nftDataConv.collection !== "") {
          const coll = await getCollectionData(
            connection,
            nftDataConv.collection
          );
          setCollection(coll);
        }
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (nftData) {
      fillChunkedAttributes();
    }
  }, [nftData]);

  return nftData ? (
    <main className="flex flex-col xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto mb-9 ">
      <Title title={solanaAccount?.data === null ? "cNFT" : "NFT"} />
      <div className="w-full flex justify-center items-start">
        <MainInfo img={nftData.image || ""} />
        <div className="w-full flex flex-col my-5 bg-dark">
          <AccountDataGroup>
            <AccountDataRow>
              <AccountData pubkey={nftData.pubkey} title="NFT pubkey" />
              <AccountData name={nftData.name} title="NFT name" />
              <AccountData name={nftData.type} title="NFT type" />
            </AccountDataRow>
            <AccountDataRow>
              <AccountData pubkey={nftData.collection} title="NFT collection" />
              <AccountData name={nftData.website} title="Websites" />
              <AccountData boolean={nftData.locked} title="Locked" />
            </AccountDataRow>
            <AccountDataRow>
              <AccountData pubkey={nftData.owner.owner} title="NFT owner" />
              <AccountData
                name={nftData.owner.ownershipModel}
                title="Ownership model"
              />
              <AccountData boolean={nftData.owner.frozen} title="Frozen" />
            </AccountDataRow>
          </AccountDataGroup>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-start bg-dark mx-5 rounded-md">
        <AccountDataGroup>
          <RowTitle title="Royalties" />
          <AccountDataRow>
            <AccountData
              name={nftData.royalties.toString() + "%"}
              title="Royalties"
            />
            <AccountData
              boolean={nftData.primarySaleHappened}
              title="Primary sale happened"
            />
            <AccountData boolean={nftData.locked} title="Locked" />
          </AccountDataRow>
          {nftData.creators.length > 0 &&
            nftData.creators.map((creator) => (
              <AccountDataRow>
                <AccountData pubkey={creator.address} title="Creator pubkey" />
                <AccountData
                  name={`${creator.share.toString()}%`}
                  title="Creator share"
                />
                <AccountData
                  boolean={creator.verified}
                  title="Verified creator"
                />
              </AccountDataRow>
            ))}
        </AccountDataGroup>
        {chunkedAttributes.length > 0 && (
          <AccountDataGroup>
            <RowTitle title="Attributes" />
            {chunkedAttributes.map((chunk, index) => (
              <AccountDataRow key={index}>
                {chunk.map((att, subIndex) => (
                  <AccountData
                    key={subIndex}
                    name={att.value}
                    title={att.trait_type}
                  />
                ))}
              </AccountDataRow>
            ))}
          </AccountDataGroup>
        )}
        <AccountDataGroup>
          <AccountDataRow>
            <AccountData name={nftData.description} title="NFT description" />
          </AccountDataRow>
        </AccountDataGroup>
      </div>
      {collection.length > 0 && (
        <div className="flex flex-col justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-5">
          <Title title="Collection" />
          <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-5 bg-dark">
            <SwiperData nftAssets={collection} />
          </div>
        </div>
      )}
      {transactions.length > 0 ? (
        <div className="flex justify-center items-center xl:max-w-[1300px] 2xl:max-w-[1700px] mx-auto my-9 p-5">
        <TransactionTable
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
              </div>
      ) : null}

    </main>
  ) : null;
}
