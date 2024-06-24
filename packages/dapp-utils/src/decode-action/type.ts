/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from '@ethersproject/bignumber';

export interface AddressNameTagContainerProps {
  value: string;
}

export interface TransactionActionProps {
  transaction: TranslationArgs;
  event: EventList[];
  customInfo: CustomInfo;
}

export interface TokenInfo {
  token: {
    address: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}
export interface ReturnType {
  type: string;
  address?: string | undefined;
  value?: string | undefined;
  title: string;
  args: string[] | Result | undefined;
  content?: [];
}
export interface Translation {
  [hash: string]: (args: TranslationArgs) => ReturnType;
}
export interface DecodeDataReturnType {
  args?: string[] | Result;
  content?: [];
}
export interface Token {
  icon?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
}
export interface CustomProp {
  className?: string;
  address?: string;
}
export interface EventList extends Token, CustomProp, CustomInfo {
  address: string;
  data: string;
  epochNumber: string;
  topics: string[];
  transactionHash: string;
  transactionLogIndex: string;
}
export interface CustomInfo {
  [key: string]: any;
}
export interface TranslationArgs extends Token, CustomProp, CustomInfo {
  data: string;
  to?: string;
  value?: string | BigNumber;
}
export interface TranslationEvent {
  [hash: string]: (args: EventList) => ReturnType;
}

export interface ERC20_Transfer extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC20_Approved extends Record<string, any> {
  address: string;
  toAddress: string;
}
export interface ERC20_Revoked extends Record<string, any> {
  address: string;
  toAddress: string;
}
export interface ERC721_Mint extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC721_Burn extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC721_TransferFrom extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC721_SafeTransferFrom extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC721_Revoked extends Record<string, any> {
  address: string;
  toAddress: string;
}
export interface ERC721_Approved extends Record<string, any> {
  address: string;
  toAddress: string;
}
export interface ERC1155_Approved extends Record<string, any> {
  address: string;
  toAddress: string;
}
export interface ERC1155_Revoked extends Record<string, any> {
  address: string;
}
export interface ERC1155_Mint extends Record<string, any> {
  address: string;
  toAddress: string;
  value: string;
}
export interface ERC1155_SafeTransferFrom extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface ERC1155_Burn extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface ERC1155_Transfer extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface ERC1155_SafeBatchTransferFrom extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface ERC1155_BatchBurn extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface ERC1155_BatchMint extends Record<string, any> {
  value: string;
  address: string;
  toAddress: string;
}
export interface MultiAction {
  [key: string]: (result: any) => any;
  ERC20_Transfer: ({ address, toAddress, value, ...rest }: ERC20_Transfer) => any;
  ERC20_Approved: ({ address, toAddress, ...rest }: ERC20_Approved) => any;
  ERC20_Revoked: ({ address, toAddress, ...rest }: ERC20_Revoked) => any;
  ERC721_Mint: ({ value, address, ...rest }: ERC721_Mint) => any;
  ERC721_Burn: ({ value, address, ...rest }: ERC721_Burn) => any;
  ERC721_Transfer: ({ value, toAddress, address, ...rest }: ERC721_TransferFrom) => any;
  ERC721_SafeTransferFrom: ({ value, address, toAddress, ...rest }: ERC721_SafeTransferFrom) => any;
  ERC721_Revoked: ({ address, toAddress, ...rest }: ERC721_Revoked) => any;
  ERC721_Approved: ({ address, toAddress, ...rest }: ERC721_Approved) => any;
  ERC1155_Approved: ({ address, toAddress, ...rest }: ERC1155_Approved) => any;
  ERC1155_Revoked: ({ address, ...rest }: ERC1155_Revoked) => any;
  ERC1155_SafeTransferFrom: ({ value, address, ...rest }: ERC1155_SafeTransferFrom) => any;
  ERC1155_Mint: ({ value, address, toAddress, ...rest }: ERC1155_Mint) => any;
  ERC1155_Burn: ({ value, address, ...rest }: ERC1155_Burn) => any;
  ERC1155_Transfer: ({ value, address, toAddress, ...rest }: ERC1155_Transfer) => any;
  ERC1155_SafeBatchTransferFrom: ({ value, address, toAddress, ...rest }: ERC1155_SafeBatchTransferFrom) => any;
  ERC1155_BatchBurn: ({ value, address, toAddress, ...rest }: ERC1155_BatchBurn) => any;
  ERC1155_BatchMint: ({ value, address, toAddress, ...rest }: ERC1155_BatchMint) => any;
}
