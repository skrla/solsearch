import { TokenAmount } from "@solana/web3.js";
import {
  DataAccount,
  ParsedAccount,
  SolanaAccount,
  TokenInfoData,
  TokenMintInfoData,
} from "../types/dataAccounts";
import { MetaDataAccount } from "../types/metadata";

export function convertToSolanaAccount(rawData: any): SolanaAccount {
  const value = rawData.value;
  let tokenData: TokenInfoData | TokenMintInfoData | undefined = undefined;
  let dataAccount: DataAccount | null = null;
  if (value.data.program) {
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
      tokenData = value.data.parsed.info
        ? {
            decimals: value.data.parsed.info.decimals,
            freezeAuthority: value.data.parsed.info.freezeAuthority,
            isInitialized: value.data.parsed.info.boolean,
            mintAuthority: value.data.parsed.info.string,
            supply: value.data.parsed.info.supply,
          }
        : undefined;
    }

    const parsedAccount: ParsedAccount = {
      type: value.data.parsed.type,
      info: tokenData,
    };

    dataAccount = {
      program: value.data.program,
      space: value.data.space,
      parsed: parsedAccount,
    };
  }

  const solanaAccount: SolanaAccount = {
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

export function convertToMetaDataAccount(data: any): MetaDataAccount {
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
