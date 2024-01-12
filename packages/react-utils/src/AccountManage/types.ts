import type { Unit, useStatus } from '@cfxjs/use-wallet-react/ethereum';

export interface AddChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export interface WatchAssetParams {
  type: 'ERC20'; // In the future, other standards will be supported
  options: {
    address: string; // The address of the token contract
    symbol: string; // A ticker symbol or shorthand, up to 5 characters
    decimals: number; // The number of token decimals
    image: string; // A string url of the token logo
  };
}

export interface TransactionParameters {
  gasPrice?: string; // customizable by user during MetaMask confirmation.
  gas?: string; // customizable by user during MetaMask confirmation.
  to?: string; // Required except during contract publications.
  from?: string; // must match user's active address.
  value?: string; // Only required to send ether to the recipient from the initiating external account.
  data?: string; // Optional, but used for defining smart contract creation and interaction.
}

export interface TypedSignParams {
  domain: {
    chainId?: number | string;
    name?: string; // A user-friendly name to the specific contract you're signing for.
    verifyingContract?: string; // Add a verifying contract to make sure you're establishing contracts with the proper entity.
    version?: string; // This identifies the latest version.
  };
  message: Record<string, unknown>;
  primaryType: string; // This refers to the keys of the following types object.
  types: (
    | {
        EIP712Domain: Array<{ name: string; type: string }>; // This refers to the domain the contract is hosted on.
      }
    | {
        CIP23Domain: Array<{ name: string; type: string }>; // This refers to the domain the contract is hosted on.
      }
  ) &
    Record<string, Array<{ name: string; type: string }>>;
}

export type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
export type StoreSubscribeWithSelector<T> = {
  subscribe: {
    (listener: (selectedState: T, previousSelectedState: T) => void): () => void;
    <U>(
      selector: (state: T) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      },
    ): () => void;
  };
};

export type Status = ReturnType<typeof useStatus>;

export interface WalletProvider {
  walletName: string;
  subAccountChange: (callback: (account: string | undefined) => void) => void;
  subChainIdChange: (callback: (chainId: string | undefined) => void) => void;
  subBalanceChange?: (callback: (balance: Unit | undefined) => void) => void;
  subStatusChange?: (callback: (status: Status | undefined) => void) => void;
  getAccount: () => string | undefined;
  getChainId: () => string | undefined;
  getBalance?: () => Unit | undefined;
  getStatus?: () => Status | undefined;
  connect: () => Promise<unknown>;
  sendTransaction: (transaction: TransactionParameters) => Promise<string>;
  watchAsset?: (asset: WatchAssetParams) => Promise<unknown>;
  addChain?: (chain: AddChainParameter) => Promise<unknown>;
  switchChain?: (chainId: string) => Promise<unknown>;
  typedSign?: (data: TypedSignParams) => Promise<string>;
  disconnect?: () => Promise<void> | void;
  BalanceTracker?: React.FC;
}
