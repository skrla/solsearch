import { TokenAmount } from "@solana/web3.js";

export type TransactionType = {
  blockTime: number | null;
  slot: number;
  version: number;
  transaction: TransactionDataType | null;
  meta: TransactionMetaType | null;
};

export type TransactionDataType = {
  signatures: string[];
  transactionMessage: TransactionMessageType;
};

export type TransactionMessageType = {
  recentBlockhash: string;
  accountKeys: AccountKeysTransaction[];
  addressTableLookups: AddressLookupTableType[];
  instructionsTransaction: InstructionTransactionType[];
};

export type AccountKeysTransaction = {
  pubkey: string;
  signer: boolean;
  source: string;
  writable: boolean;
};

export type AddressLookupTableType = {
  accountKey: string;
  readonlyIndexes: number[];
  writableIndexes: number[];
};

export type InstructionTransactionType = {
  accounts: string[] | undefined;
  data: string | undefined;
  parsed: ParsedTransactionType | undefined;
  program: string | undefined;
  programId: string;
  stackHeight: number | null;
  innerInstructions: InnerInstructionType[];
};

export type ParsedTransactionType = {
  info: InfoTransactionType;
  type: string;
};

export type InfoTransactionType = {
  account: string | undefined;
  mint: string | undefined;
  source: string | undefined;
  systemProgram: string | undefined;
  tokenProgram: string | undefined;
  wallet: string | undefined;
  lamports: number | undefined;
  destination: string | undefined;
  owner: string | undefined;
  extensionTypes: string[] | undefined;
  newAccount: string | undefined;
  space: number | undefined;
  authority: string | undefined;
  tokenAmount: TokenAmount | undefined;
};

export type TransactionMetaType = {
  computeUnitsConsumed: number;
  err: string | null;
  fee: number;
  slot: number;
  logMessages: string[];
  postBalances: number[];
  preBalances: number[];
  rewards: any[]; //TODO: see rewards inside transactions
  innerInstructions: InnerInstructionType[];
  preTokenBalances: TokenBalancesType[];
  postTokenBalances: TokenBalancesType[];
};

export type InnerInstructionType = {
  index: number;
  instructions: InstructionTransactionType[];
};

export type TokenBalancesType = {
  accountIndex: number;
  mint: string;
  owner: string;
  programId: string;
  tokenAmount: TokenAmount;
};
