import rawCards from "../data/cards.json";
import rawTransactionsByCardId from "../data/transactions.json";
import type { RawCard, RawTransactionsByCardId } from "./types";

export const fetchCards = async (): Promise<RawCard[]> => rawCards as RawCard[];

export const fetchTransactionsByCardId = async (): Promise<RawTransactionsByCardId> =>
  rawTransactionsByCardId as RawTransactionsByCardId;
