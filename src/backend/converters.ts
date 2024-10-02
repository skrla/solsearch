import { LAMPORTS_PER_SOL, SystemProgram, TokenAmount } from "@solana/web3.js";
import {
  DataAccount,
  Extension,
  ParsedAccount,
  ProgramData,
  ProgramExecutableData,
  SolanaAccount,
  TokenInfoData,
  TokenMintInfoData,
  TransferFeeState,
} from "../types/dataAccounts";
import { MetaDataAccount } from "../types/metadata";
import {
  AccountPageType,
  AssetsNFT,
  AssetsToken,
  NftPageType,
  ProgramPageType,
  TokenPageType,
} from "@/types/pagetypes";
import { BPF_LOADER_UPGRADE_PROGRAM_ID } from "./accountData";

export function convertToSolanaAccountType(
  rawData: any,
  pubkey: string
): SolanaAccount {
  const value = rawData.value;
  let tokenData: TokenInfoData | null = null;
  let tokenMintData: TokenMintInfoData | null = null;
  let dataAccount: DataAccount | null = null;
  let programData: ProgramData | null = null;
  let executableData: ProgramExecutableData | null = null;
  if (value.data.program) {
    if ("programData" in value.data.parsed.info) {
      programData = {
        executableData: value.data.parsed.info.programData,
        upgradable: false,
        upgradeAuth: "",
        slot: 0,
        deploymentTimestamp: 0,
      };

      const solanaAccount: SolanaAccount = {
        pubkey: pubkey,
        programData: programData,
        executable: value.executable,
        lamports: value.lamports,
        owner: value.owner,
        rentEpoch: value.rentEpoch,
        space: value.space,
        data: dataAccount,
        metadata: null,
      };

      return solanaAccount;
    }
    const tokenAmount: TokenAmount | undefined = value.data.parsed.info
      .tokenAmount
      ? {
          amount: value.data.parsed.info.tokenAmount.amount,
          decimals: value.data.parsed.info.tokenAmount.decimals,
          uiAmount: value.data.parsed.info.tokenAmount.uiAmount,
          uiAmountString: value.data.parsed.info.tokenAmount.uiAmountString,
        }
      : undefined;
    if (tokenAmount) {
      tokenData = {
        isNative: value.data.parsed.info.isNative,
        mint: value.data.parsed.info.mint,
        owner: value.data.parsed.info.owner,
        state: value.data.parsed.info.state,
        tokenAmount: tokenAmount,
      };
    }
    if (value.data.parsed.type === "programData") {
      const data: string[] = [];
      value.data.parsed.info.data.forEach((e: string) => {
        data.push(e);
      });
      executableData = {
        authority: value.data.parsed.info.authority,
        slot: value.data.parsed.info.slot,
        executableData: data,
      };
    } else {
      const exts: Extension[] = [];
      if (value.data.parsed.info.extensions) {
        value.data.parsed.info.extensions.forEach((e: any) => {
          let ext: Extension = {
            extension: "",
            state: null,
          };
          if (e.extension) {
            ext.extension = e.extension;
          }
          if (e.state) {
            let stat: TransferFeeState = {
              withheldAmount: e.state.withheldAmount,
              withdrawWithheldAuthority: e.state.withdrawWithheldAuthority,
              transferFeeConfigAuthority: e.state.transferFeeConfigAuthority,
              newerTransferFee: {
                epoch: e.state.newerTransferFee.epoch,
                maximumFee: e.state.newerTransferFee.maximumFee,
                transferFeeBasisPoints:
                  e.state.newerTransferFee.transferFeeBasisPoints,
              },
              olderTransferFee: {
                epoch: e.state.olderTransferFee.epoch,
                maximumFee: e.state.olderTransferFee.maximumFee,
                transferFeeBasisPoints:
                  e.state.olderTransferFee.transferFeeBasisPoints,
              },
            };
            ext.state = stat;
            exts.push(ext);
          }
        });
      }
      tokenMintData = value.data.parsed.info
        ? {
            decimals: value.data.parsed.info.decimals,
            freezeAuthority: value.data.parsed.info.freezeAuthority,
            isInitialized: value.data.parsed.info.boolean,
            mintAuthority: value.data.parsed.info.mintAuthority,
            supply: value.data.parsed.info.supply,
            extensions: exts,
          }
        : null;
    }
    const parsedAccount: ParsedAccount = {
      type: value.data.parsed.type,
      info: tokenData,
      infoMint: tokenMintData,
      infoExecutableData: executableData,
    };

    dataAccount = {
      program: value.data.program,
      space: value.data.space,
      parsed: parsedAccount,
    };
  }

  const solanaAccount: SolanaAccount = {
    pubkey: pubkey,
    programData: null,
    executable: value.executable,
    lamports: value.lamports,
    owner: value.owner,
    rentEpoch: value.rentEpoch,
    space: value.space,
    data: dataAccount,
    metadata: null,
  };

  return solanaAccount;
}

export function convertToMetaDataAccountType(data: any): MetaDataAccount {
  return {
    id: data.id,
    content$schema: data.content.$schema,
    json_uri: data.content.json_uri,
    files: data.content.files || [],
    metadata: {
      attributes: data.content.metadata.attributes
        ? data.content.metadata.attributes.map((attr: any) => ({
            trait_type: attr.trait_type,
            value: attr.value,
          }))
        : undefined,
      description: data.content.metadata.description,
      name: data.content.metadata.name,
      symbol: data.content.metadata.symbol,
      tokenStandard: data.content.metadata.token_standard,
    },
    links: data.content.links || {},
    authorities: (data.authorities || []).map((authority: any) => ({
      address: authority.address,
      scopes: authority.scopes,
    })),
    compression: {
      eligible: data.compression.eligible,
      compressed: data.compression.compressed,
      dataHash: data.compression.data_hash,
      creatorHash: data.compression.creator_hash,
      assetHash: data.compression.asset_hash,
      tree: data.compression.tree,
      seq: data.compression.seq,
      leafId: data.compression.leaf_id,
    },
    grouping: (data.grouping || []).map((group: any) => ({
      groupKey: group.group_key,
      groupValue: group.group_value,
    })),
    royalty: {
      royaltyModel: data.royalty.royalty_model,
      target: data.royalty.target,
      percent: data.royalty.percent,
      basisPoints: data.royalty.basis_points,
      primarySaleHappened: data.royalty.primary_sale_happened,
      locked: data.royalty.locked,
    },
    creators: (data.creators || []).map((creator: any) => ({
      address: creator.address,
      share: creator.share,
      verified: creator.verified,
    })),
    ownership: {
      frozen: data.ownership.frozen,
      delegated: data.ownership.delegated,
      delegate: data.ownership.delegate,
      ownershipModel: data.ownership.ownership_model,
      owner: data.ownership.owner,
    },
    supply: data.supply
      ? {
          printMaxSupply: data.supply.print_max_supply || 0,
          printCurrentSupply: data.supply.print_current_supply || 0,
          editionNonce: data.supply.edition_nonce || null,
        }
      : null,
    mutable: data.mutable,
    burnt: data.burnt,
  };
}

export function convertToNftPageType(metadata: MetaDataAccount): NftPageType {
  let image = "";
  let collection = "";
  if (metadata.files && metadata.files.length > 0) {
    metadata.files.forEach((file) => {
      if ("uri" in file) {
        image = file.uri;
      }
    });
  }

  if (metadata.grouping.length > 0) {
    metadata.grouping.forEach((group) => {
      if (group.groupKey === "collection") {
        collection = group.groupValue;
      }
    });
  }

  return {
    name: metadata.metadata.name,
    type: metadata.metadata.tokenStandard || "",
    description: metadata.metadata.description || "",
    image: image,
    pubkey: metadata.id,
    collection: collection,
    website: metadata.links?.external_url || "",
    royalties: metadata.royalty.percent * 100 || 0,
    creators: metadata.creators,
    owner: metadata.ownership,
    attributes: metadata.metadata.attributes,
    primarySaleHappened: metadata.royalty.primarySaleHappened || false,
    locked: metadata.royalty.locked || false,
  };
}

export function convertToAccountPageType(
  solanaAccount: SolanaAccount
): AccountPageType {
  let balance =
    solanaAccount.lamports !== null
      ? solanaAccount.lamports / LAMPORTS_PER_SOL
      : 0;

  const ownerPubkey =
    solanaAccount.owner?.toString() === SystemProgram.programId.toString()
      ? "System Program"
      : solanaAccount.owner?.toString();

  return {
    pubkey: solanaAccount.pubkey.toString(),
    balance: balance,
    executable: solanaAccount.executable ? true : false,
    owner: ownerPubkey || "",
    assets: null,
  };
}

export function convertToProgramPageType(
  solanaAccount: SolanaAccount
): ProgramPageType {
  const balance = solanaAccount.lamports
    ? solanaAccount.lamports / LAMPORTS_PER_SOL
    : 0;
  const type = solanaAccount.executable ? "program" : "programData";
  let executableDataAccount = "";
  let upgradable = false;
  let upgradeAuth = "";
  let slot = 0;
  let data: Uint8Array = new Uint8Array(0);
  let size = 0;
  let timestamp: Date | null = null;
  let time: number = 0;

  if (type === "program") {
    executableDataAccount = solanaAccount.programData?.executableData || "";
    upgradable = solanaAccount.programData?.upgradable || false;
    upgradeAuth = solanaAccount.programData?.upgradeAuth || "";
    slot = solanaAccount.programData?.slot || 0;
    time = solanaAccount.programData?.deploymentTimestamp || 0;
  }
  if (type === "programData") {
    data = base64ToUint8Array(
      solanaAccount.data?.parsed?.infoExecutableData?.executableData[0] || ""
    );
    upgradable =
      solanaAccount.owner?.toString() === BPF_LOADER_UPGRADE_PROGRAM_ID;
    upgradeAuth =
      solanaAccount.data?.parsed?.infoExecutableData?.authority || "";
    slot = solanaAccount.data?.parsed?.infoExecutableData?.slot || 0;
    size = Math.round((data.length / 1024) * 100) / 100;
  }

  if (time !== 0) {
    timestamp = new Date(time * 1000);
  }

  return {
    pubkey: solanaAccount.pubkey.toString(),
    type: type,
    balance: balance,
    executable: solanaAccount.executable || false,
    executableDataAccount: executableDataAccount,
    upgradable: upgradable,
    upgradeAuth: upgradeAuth,
    slot: slot,
    executableData: data,
    sizeInKb: size,
    deploymentTimestamp: timestamp,
  };
}

export function convertToTokenPageType(
  solanaAccount: SolanaAccount
): TokenPageType {
  let supply = 0;
  let decimals = 0;
  let freezeAuth = "";
  let tokenExt = false;
  let balance = 0;
  let type = "";
  let image = "";
  let mintAuth = "";
  let owner = "";
  if (solanaAccount.data !== null && solanaAccount.data.parsed !== null) {
    const parsedData = solanaAccount.data.parsed;
    if (parsedData.type === "mint") {
      if (parsedData.infoMint !== null) {
        type = parsedData.type;
        supply = parsedData.infoMint.supply;
        decimals = parsedData.infoMint.decimals;
        mintAuth = parsedData.infoMint.mintAuthority;
        freezeAuth = parsedData.infoMint.freezeAuthority;
        if (
          parsedData.infoMint.extensions &&
          parsedData.infoMint.extensions.length > 0
        ) {
          tokenExt = true;
        }
      }
      owner = solanaAccount.owner?.toString() || "";
    } else {
      if (parsedData.info !== null) {
        type = parsedData.type;
        decimals = parsedData.info.tokenAmount?.decimals || 0;
        mintAuth = parsedData.info.mint;
        owner = parsedData.info.owner;
        balance = parsedData.info.tokenAmount?.uiAmount || 0;
      }
    }
    if (solanaAccount.metadata?.files)
      image = solanaAccount.metadata?.files[0].uri || "";
  }
  return {
    pubkey: solanaAccount.pubkey,
    type: type,
    img: image,
    name: solanaAccount.metadata?.metadata.name || "",
    balance: balance,
    supply: supply,
    decimals: decimals,
    tokenExt: tokenExt,
    owner: owner,
    mintAuth: mintAuth,
    freezeAuth: freezeAuth,
  };
}

export function convertToTokenAssets(json: any): AssetsToken[] {
  let tokenAssets: AssetsToken[] = [];
  if (json && json !== null) {
    if (json.items && json.items !== null && json.items.length > 0) {
      for (let i = 0; i < json.items.length; i++) {
        const item = json.items[i];
        if (item.id === null || !item.token_info) continue;
        if (item.token_info.decimals === 0) continue;
        let pubkey = item.id;
        if (item.token_info?.associated_token_address) {
          pubkey = item.token_info?.associated_token_address;
        }
        const name = item.content?.metadata?.symbol || "";
        const balance = item.token_info?.price_info?.total_price || 0;
        const img = item.content.files[0].uri || "";
        tokenAssets.push({
          name: name,
          img: img,
          pubkey: pubkey,
          balance: balance,
        });
      }
    }
  }
  return tokenAssets;
}

export async function convertToNFTAssets(json: any): Promise<AssetsNFT[]> {
  let tokenAssets: AssetsNFT[] = [];
  if (json && json !== null) {
    if (json.items && json.items !== null && json.items.length > 0) {
      for (let i = 0; i < json.items.length; i++) {
        const item = json.items[i];
        if (item.id === null || item.interface !== "V1_NFT") continue;
        let pubkey = item.id;
        if (item.token_info?.associated_token_address) {
          pubkey = item.token_info?.associated_token_address;
        }
        const name = item.content?.metadata?.name || "";
        const img = item.content?.files[0]?.uri || "";
        let mime = "image/png";
        try {
          const response = await fetch(img, { method: "HEAD" });
          if (response.ok) {
            const contentType = response.headers.get("Content-Type");
            mime = contentType || "image/png";
          }
        } catch (error) {
          mime = "image/png";
        }
        tokenAssets.push({
          name: name,
          img: img,
          pubkey: pubkey,
          mime: mime,
        });
      }
    }
  }
  return tokenAssets;
}

function base64ToUint8Array(data: string) {
  const binaryString = atob(data);

  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
