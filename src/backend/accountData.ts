import {
  BPF_LOADER_DEPRECATED_PROGRAM_ID,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { ProgramData, SolanaAccount } from "../types/dataAccounts";
import {
  convertToMetaDataAccountType,
  convertToSolanaAccountType,
} from "./converters";
import { MetaDataAccount } from "../types/metadata";

const BPF_LOADER_UPGRADE_PROGRAM_ID =
  "BPFLoaderUpgradeab1e11111111111111111111111";

export const getAccountData = async (
  conncetion: Connection,
  pubkey: string,
  accData: SolanaAccount
) => {
  let solanaAccount = accData;

  if (solanaAccount.space !== 0) {
    if (solanaAccount.executable) {
      const programData = await getProgramData(
        conncetion,
        pubkey,
        solanaAccount
      );
      solanaAccount.programData = programData;
      return solanaAccount;
    }

    if (
      solanaAccount.data &&
      solanaAccount.data.parsed &&
      solanaAccount.data.parsed.info !== null
    ) {
      return solanaAccount;
    }
    const metadata = await getAsset(conncetion.rpcEndpoint, pubkey);

    solanaAccount.metadata = metadata;
  }
  return solanaAccount;
};

export const getFullAccountData = async (
  conncetion: Connection,
  pubkey: string
) => {
  const accountData = await conncetion.getParsedAccountInfo(
    new PublicKey(pubkey)
  );

  let solanaAccount: SolanaAccount | undefined = undefined;

  if (accountData.value !== null) {
    solanaAccount = convertToSolanaAccountType(accountData, pubkey);
  }

  if (
    accountData.value === null ||
    (solanaAccount && solanaAccount.space !== 0)
  ) {
    if (solanaAccount && solanaAccount.executable) {
      const programData = await getProgramData(
        conncetion,
        pubkey,
        solanaAccount
      );
      solanaAccount.programData = programData;
      return solanaAccount;
    }
    if (
      solanaAccount &&
      solanaAccount.data &&
      solanaAccount.data.parsed &&
      solanaAccount.data.parsed.info !== null
    ) {
      return solanaAccount;
    }
    const metadata = await getAsset(conncetion.rpcEndpoint, pubkey);

    if (solanaAccount) {
      solanaAccount.metadata = metadata;
    } else {
      solanaAccount = {
        metadata: metadata,
        data: null,
        programData: null,
        executable: null,
        lamports: null,
        owner: null,
        rentEpoch: null,
        space: null,
        pubkey: pubkey,
      };
    }
  }

  return solanaAccount;
};

export const getAccountInfo = async (
  connection: Connection,
  pubkey: string
) => {
  let solanaAccount: SolanaAccount | undefined = undefined;

  const accountData = await connection.getParsedAccountInfo(
    new PublicKey(pubkey)
  );

  if (accountData.value !== null) {
    solanaAccount = convertToSolanaAccountType(accountData, pubkey);
  }
  if (accountData.value === null) {
    solanaAccount = {
      metadata: undefined,
      data: null,
      executable: null,
      lamports: null,
      owner: null,
      rentEpoch: null,
      space: null,
      programData: null,
      pubkey: pubkey,
    };
  }

  return solanaAccount;
};

const getAsset = async (
  url: string,
  mint: string
): Promise<MetaDataAccount> => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: {
          id: mint,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = convertToMetaDataAccountType(data.result);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getProgramData = async (
  conncetion: Connection,
  pubkey: string,
  solanaAccount: SolanaAccount
): Promise<ProgramData> => {
  const upgradable =
    solanaAccount.owner?.toString() === BPF_LOADER_UPGRADE_PROGRAM_ID;

  const slot = await getProgramSlot(conncetion, pubkey);
  await delay(1000); //TODO: Remove delay, temporary here because of Helius 10 requests per second limit
  const timestamp = await conncetion.getBlockTime(slot);
  let authority = "";

  if (upgradable) {
    authority = await getProgramUpgradeAuth(conncetion, pubkey);
  }

  return {
    executableData: solanaAccount.programData?.executableData || "",
    upgradable: upgradable,
    upgradeAuth: authority,
    slot: slot,
    deploymentTimestamp: timestamp || 0,
  };
};

async function getProgramSlot(connection: Connection, pubkey: string) {
  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(pubkey),
    { limit: 1 }
  );
  if (signatures.length === 0) {
    return 0;
  }
  const deploymentSignature = signatures[0].signature;
  const transaction = await connection.getTransaction(deploymentSignature, {
    commitment: "finalized",
    maxSupportedTransactionVersion: 0,
  });
  if (!transaction) {
    return 0;
  }

  return transaction.slot;
}

async function getProgramUpgradeAuth(connection: Connection, pubkey: string) {
  const [programDataAccount] = await PublicKey.findProgramAddressSync(
    [new PublicKey(pubkey).toBuffer()],
    new PublicKey(BPF_LOADER_UPGRADE_PROGRAM_ID)
  );
  await delay(1000); //TODO: Remove delay, temporary here because of Helius 10 requests per second limit
  const programDataAccountInfo = await connection.getAccountInfo(
    programDataAccount
  );
  if (!programDataAccountInfo) {
    return "";
  }
  const upgradeAuthority = new PublicKey(
    programDataAccountInfo.data.subarray(4, 36)
  );
  if (upgradeAuthority.equals(PublicKey.default)) {
    return "";
  } else {
    return upgradeAuthority.toBase58();
  }
}

//TODO: Remove delay, temporary here because of Helius 10 requests per second limit
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
