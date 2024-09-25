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
  creators: NFTCreator[];
  owner: NFTOwnership;
  attributes: NFTAttribute[] | undefined;
};

export type AccountPageType = {
  pubkey: string;
  balance: number;
  executable: boolean;
  owner: string;
};

export type ProgramPageType = {
  pubkey: string;
  balance: number;
  executable: boolean;
  executableData: string;
  upgradable: boolean;
  upgradeAuth: string;
  slot: number;
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
