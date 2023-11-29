import { ReactElement } from "react";

interface Result extends ReadonlyArray<unknown> {
  readonly [key: string]: unknown;
}

interface Token {
  icon?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
}

export interface ReturnType {
  title: string;
  args: string[] | Result;
  content: ReactElement | string;
}

export interface Translation {
  [hash: string]: (args: TranslationArgs) => ReturnType;
}

export interface EventList extends Token {
  address: string;
  data: string;
  epochNumber: string;
  topics: string[];
  transactionHash: string;
  transactionLogIndex: string;
}

export interface TranslationArgs extends Token {
  address?: string;
  data: string;
  event?: {
    total: number;
    list: EventList[];
  };
}

export interface TranslationEvent {
  [hash: string]: (args: EventList) => ReturnType;
}

export interface ReturnDataType {
  data: ReturnType;
  event?: ReturnType[];
}
