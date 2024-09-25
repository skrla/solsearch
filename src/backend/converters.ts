import { LAMPORTS_PER_SOL, SystemProgram, TokenAmount } from "@solana/web3.js";
import {
  DataAccount,
  Extension,
  ParsedAccount,
  ProgramData,
  SolanaAccount,
  TokenInfoData,
  TokenMintInfoData,
  TransferFeeState,
} from "../types/dataAccounts";
import { MetaDataAccount } from "../types/metadata";
import {
  AccountPageType,
  NftPageType,
  ProgramPageType,
  TokenPageType,
} from "@/types/pagetypes";
import { stat } from "fs";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

export function convertToSolanaAccountType(
  rawData: any,
  pubkey: string
): SolanaAccount {
  const value = rawData.value;
  let tokenData: TokenInfoData | null = null;
  let tokenMintData: TokenMintInfoData | null = null;
  let dataAccount: DataAccount | null = null;
  let programData: ProgramData | null = null;
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
        metadata: undefined,
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
            mintAuthority: value.data.parsed.info.string,
            supply: value.data.parsed.info.supply,
            extensions: exts,
          }
        : null;
    }

    const parsedAccount: ParsedAccount = {
      type: value.data.parsed.type,
      info: tokenData,
      infoMint: tokenMintData,
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
    metadata: undefined,
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
    royalties: metadata.royalty.percent,
    creators: metadata.creators,
    owner: metadata.ownership,
    attributes: metadata.metadata.attributes,
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
  };
}

export function convertToProgramPageType(
  solanaAccount: SolanaAccount
): ProgramPageType {
  const balance = solanaAccount.lamports
    ? solanaAccount.lamports / LAMPORTS_PER_SOL
    : 0;
  return {
    pubkey: solanaAccount.pubkey.toString(),
    balance: balance,
    executable: solanaAccount.executable || false,
    executableData: solanaAccount.programData?.executableData || "",
    upgradable: solanaAccount.programData?.upgradable || false,
    upgradeAuth: solanaAccount.programData?.upgradeAuth || "",
    slot: solanaAccount.programData?.slot || 0,
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
    if (parsedData.infoMint !== null) {
      type = parsedData.type;
      supply = parsedData.infoMint.supply;
      decimals = parsedData.infoMint.decimals;
      mintAuth = parsedData.infoMint.mintAuthority;
      freezeAuth = parsedData.infoMint.freezeAuthority;
      tokenExt =
        solanaAccount.owner?.toString() === TOKEN_2022_PROGRAM_ID.toBase58();
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
