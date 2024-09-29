import { TokenAmount } from "@solana/web3.js";
import { MetaDataAccount } from "./metadata";

export type SolanaAccount = {
  pubkey: string;
  executable: boolean | null;
  lamports: number | null;
  owner: string | null;
  rentEpoch: number | null;
  space: number | null;
  data: DataAccount | null;
  metadata: MetaDataAccount | null;
  programData: ProgramData | null;
};

export type DataAccount = {
  program: string;
  space: number;
  parsed: ParsedAccount | null;
};

export type ParsedAccount = {
  type: string;
  info: TokenInfoData | null;
  infoMint: TokenMintInfoData | null;
  infoExecutableData: ProgramExecutableData | null;
};

export type TokenMintInfoData = {
  decimals: number;
  freezeAuthority: string;
  isInitialized: boolean;
  mintAuthority: string;
  supply: number;
  extensions: Extension[];
};

export type TokenInfoData = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: TokenAmount | undefined;
};

export type ProgramExecutableData = {
  authority: string;
  slot: number;
  executableData: string[];
};

export type ProgramData = {
  executableData: string;
  upgradable: boolean;
  upgradeAuth: string;
  slot: number;
  deploymentTimestamp: number;
};

export type Extension = {
  extension: string;
  state: TransferFeeState | null;
};

export type TransferFeeState = {
  newerTransferFee: TransferFee;
  olderTransferFee: TransferFee;
  transferFeeConfigAuthority: string;
  withdrawWithheldAuthority: string;
  withheldAmount: number;
};

export type TransferFee = {
  epoch: number;
  maximumFee: number;
  transferFeeBasisPoints: number;
};
