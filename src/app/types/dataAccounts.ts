import { TokenAmount } from "@solana/web3.js";
import { MetaDataAccount } from "./metadata";

export type SolanaAccount = {
  executable: boolean | null;
  lamports: number | null;
  owner: string | null;
  rentEpoch: number | null;
  space: number | null;
  data: DataAccount | null;
  metadata: MetaDataAccount | undefined;
};

export type DataAccount = {
  program: string;
  space: number;
  parsed: ParsedAccount | null;
};

export type ParsedAccount = {
  type: string;
  info: TokenInfoData | TokenMintInfoData | undefined;
};

export type TokenMintInfoData = {
  decimals: number;
  freezeAuthority: string;
  isInitialized: boolean;
  mintAuthority: string;
  supply: number;
};

export type TokenInfoData = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: TokenAmount | undefined;
};
