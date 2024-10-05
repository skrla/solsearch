import {
  AccountKeysTransaction,
  AddressLookupTableType,
  InnerInstructionType,
  InstructionTransactionType,
  ParsedTransactionType,
  TransactionDataType,
  TransactionMessageType,
  TransactionMetaType,
  TransactionType,
} from "@/types/transaction";
import { TokenAmount } from "@solana/web3.js";

export function convertToTransactionType(
  rawData: any
): TransactionType | undefined {
  if (rawData === undefined || rawData === null) return;
  const blockTime = rawData.blockTime || 0;
  const slot = rawData.slot || 0;
  const version = rawData.version || 0;
  let transactionData: TransactionDataType | undefined = undefined;
  let meta: TransactionMetaType | null = null;
  if (rawData.transaction && rawData.transaction != null) {
    const rawTransaction = rawData.transaction;
    const signatur: string[] = [];
    if (rawTransaction.signatures && rawTransaction.signatures.length > 0) {
      rawTransaction.signatures.forEach((s: string) => {
        signatur.push(s);
      });
    }
    if (rawTransaction.message && rawTransaction.message != null) {
      const rawMessage = rawTransaction.message;
      const accountKeys: AccountKeysTransaction[] = [];
      const addressTableLookups: AddressLookupTableType[] = [];
      const instructions: InstructionTransactionType[] = [];
      const recentBlockhash: string = rawMessage.recentBlockhash || "";
      let messageData: TransactionMessageType | undefined = undefined;
      if (rawMessage.accountKeys && rawMessage.accountKeys.length > 0) {
        rawMessage.accountKeys.forEach((account: any) => {
          const pubkey = account.pubkey || "";
          const signer = account.signer || false;
          const source = account.source || "";
          const writable = account.writable || false;
          accountKeys.push({
            pubkey,
            signer,
            source,
            writable,
          });
        });
      }
      if (
        rawMessage.addressTableLookups &&
        rawMessage.addressTableLookups.length > 0
      ) {
        rawMessage.addressTableLookups.forEach((lookup: any) => {
          const addressTables: AddressLookupTableType = {
            accountKey: lookup.accountKey || "",
            writableIndexes: lookup.writableIndexes || [],
            readonlyIndexes: lookup.readonlyIndexes || [],
          };
          addressTableLookups.push(addressTables);
        });
      }
      if (rawMessage.instructions && rawMessage.instructions.length > 0) {
        rawMessage.instructions.forEach((instruction: any) => {
          const stackHeight = instruction.stackHeight || 0;
          const programId = instruction.programId || "";
          const program = instruction.program || "";
          const data = instruction.data || undefined;
          const accounts = instruction.accounts || [];
          const innerInstructions: InnerInstructionType[] = [];
          let parsedT: ParsedTransactionType | undefined = undefined;
          if (instruction.parsed && instruction.parsed !== null) {
            const type = instruction.parsed.type || "";
            if (instruction.parsed.info && instruction.parsed.info !== null) {
              const info = instruction.parsed.info;
              const account = info.account;
              const mint = info.mint;
              const source = info.source;
              const systemProgram = info.systemProgram;
              const tokenProgram = info.tokenProgram;
              const wallet = info.wallet;
              const lamports = info.lamports;
              const destination = info.destination;
              const owner = info.owner;
              const extensionTypes = info.extensionTypes;
              const newAccount = info.newAccount;
              const space = info.space;
              const authority = info.authority;
              let tokenAmount: TokenAmount | undefined = undefined;
              if (info.tokenAmount && info.tokenAmount !== null) {
                const amount = info.tokenAmount.amount;
                const decimals = info.tokenAmount.decimals;
                const uiAmount = info.tokenAmount.uiAmount;
                const uiAmountString = info.tokenAmount.uiAmountString;
                tokenAmount = {
                  amount,
                  decimals,
                  uiAmount,
                  uiAmountString,
                };
              }
              const parsed = {
                account,
                mint,
                source,
                systemProgram,
                tokenProgram,
                wallet,
                lamports,
                destination,
                owner,
                extensionTypes,
                newAccount,
                space,
                authority,
                tokenAmount,
              };
              parsedT = {
                type,
                info: parsed,
              };
            }
          }
          instructions.push({
            stackHeight,
            programId,
            program,
            data,
            accounts,
            innerInstructions,
            parsed: parsedT,
          });
        });
      }

      messageData = {
        accountKeys: accountKeys,
        addressTableLookups: addressTableLookups,
        instructionsTransaction: instructions,
        recentBlockhash: recentBlockhash,
      };
      transactionData = {
        signatures: signatur,
        transactionMessage: messageData,
      };
    }

    if (rawData.meta && rawData.meta !== null) {
      const rawMeta = rawData.meta;
      const fee = rawMeta.fee || 0;
      const slot = rawMeta.slot || 0;
      const err = rawMeta.err || null;
      const computeUnitsConsumed = rawMeta.computeUnitsConsumed || 0;
      const logMessages = rawMeta.logMessages || [];
      const postBalances = rawMeta.postBalances || [];
      const preBalances = rawMeta.preBalances || [];
      const rewards = rawMeta.rewards || [];
      const preTokenBalances = rawMeta.preTokenBalances || [];
      const postTokenBalances = rawMeta.postTokenBalances || [];
      const innerInstructions: InnerInstructionType[] = [];

      if (rawMeta.innerInstructions && rawMeta.innerInstructions.length > 0) {
        rawMeta.innerInstructions.forEach((innerInstruction: any) => {
          const index = innerInstruction.index || 0;
          const instructions: InstructionTransactionType[] = [];

          innerInstruction.instructions.forEach((instruction: any) => {
            const stackHeight = instruction.stackHeight || 0;
            const programId = instruction.programId || "";
            const program = instruction.program || "";
            const data = instruction.data || undefined;
            const accounts = instruction.accounts || [];
            let parsedT: ParsedTransactionType | undefined = undefined;
            if (instruction.parsed && instruction.parsed !== null) {
              const type = instruction.parsed.type || "";
              if (instruction.parsed.info && instruction.parsed.info !== null) {
                const info = instruction.parsed.info;
                const account = info.account;
                const mint = info.mint;
                const source = info.source;
                const systemProgram = info.systemProgram;
                const tokenProgram = info.tokenProgram;
                const wallet = info.wallet;
                const lamports = info.lamports;
                const destination = info.destination;
                const owner = info.owner;
                const extensionTypes = info.extensionTypes;
                const newAccount = info.newAccount;
                const space = info.space;
                const authority = info.authority;
                let tokenAmount: TokenAmount | undefined = undefined;
                if (info.tokenAmount && info.tokenAmount !== null) {
                  const amount = info.tokenAmount.amount;
                  const decimals = info.tokenAmount.decimals;
                  const uiAmount = info.tokenAmount.uiAmount;
                  const uiAmountString = info.tokenAmount.uiAmountString;
                  tokenAmount = {
                    amount,
                    decimals,
                    uiAmount,
                    uiAmountString,
                  };
                }
                const parsed = {
                  account,
                  mint,
                  source,
                  systemProgram,
                  tokenProgram,
                  wallet,
                  lamports,
                  destination,
                  owner,
                  extensionTypes,
                  newAccount,
                  space,
                  authority,
                  tokenAmount,
                };
                parsedT = {
                  type,
                  info: parsed,
                };
              }
            }

            instructions.push({
              stackHeight,
              programId,
              program,
              data,
              accounts,
              innerInstructions: [],
              parsed: parsedT,
            });
          });
          innerInstructions.push({
            index: index,
            instructions: instructions,
          });
          transactionData?.transactionMessage.instructionsTransaction[
            index
          ].innerInstructions.push({
            index,
            instructions,
          });
        });
      }
      meta = {
        fee,
        slot,
        err,
        computeUnitsConsumed,
        logMessages,
        postBalances,
        preBalances,
        rewards,
        preTokenBalances,
        postTokenBalances,
        innerInstructions,
      };
    }
  }
  return {
    blockTime: blockTime || 0,
    slot: slot || 0,
    version: version || 0,
    transaction: transactionData || null,
    meta: meta || null,
  };
}
