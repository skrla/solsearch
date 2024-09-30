import { NFTAttribute, NFTCreator, NFTOwnership } from "./metadata";

export type NftPageType = {
  name: string;
  type: string;
  description: string;
  image: string;
  pubkey: string;
  collection: string;
  website: string;
  royalties: number;
  primarySaleHappened: boolean;
  locked: boolean;
  creators: NFTCreator[];
  owner: NFTOwnership;
  attributes: NFTAttribute[] | undefined;
};

export type AccountPageType = {
  pubkey: string;
  balance: number;
  executable: boolean;
  owner: string;
  assets: AccountAssets | null;
};

export type AccountAssets = {
  assetsNft: AssetsNFT[];
  assetsToken: AssetsToken[];
};

export type AssetsNFT = {
  name: string;
  img: string;
  pubkey: string;
  mime: string;
};

export type AssetsToken = {
  name: string;
  img: string;
  pubkey: string;
  balance: number;
};

export type ProgramPageType = {
  pubkey: string;
  type: string;
  balance: number;
  executable: boolean;
  executableDataAccount: string;
  upgradable: boolean;
  upgradeAuth: string;
  slot: number;
  executableData: Uint8Array;
  sizeInKb: number;
  deploymentTimestamp: Date | null;
};

export type TokenPageType = {
  pubkey: string;
  type: string;
  img: string;
  name: string;
  supply: number;
  balance: number;
  decimals: number;
  tokenExt: boolean;
  owner: string;
  mintAuth: string;
  freezeAuth: string;
};

export type TokenGraphType = {
  prices: TokenPricesType[];
  marketCap: TokenMarketCapType[];
};

export type TokenPricesType = {
  price: number;
  timestamp: Date;
};

export type TokenMarketCapType = {
  marketCap: number;
  timestamp: Date;
};
