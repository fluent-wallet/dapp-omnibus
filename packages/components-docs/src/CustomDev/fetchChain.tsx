import { useEffect, type FC } from 'react';
import { fetchChain, fetchChainBatch, fetchChainMulticall } from '@cfx-kit/dapp-utils/src/fetch';
import { createERC20Contract, createERC721Contract } from '@cfx-kit/dapp-utils/src/contract';

export const CFX_ESPACE_TESTNET_SCAN_OPENAPI = 'https://evmapi-testnet.confluxscan.io';
export const CFX_ESPACE_TESTNET_SCAN = 'https://evmtestnet.confluxscan.io';

export enum NetworkType {
  Conflux = 'Conflux',
  Ethereum = 'Ethereum',
}

export enum AssetType {
  Native = 'Native',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}


const networkRpcPrefixMap = {
  [NetworkType.Conflux]: 'cfx',
  [NetworkType.Ethereum]: 'eth',
} as const;

const networkRpcSuffixMap = {
  [NetworkType.Conflux]: 'latest_state',
  [NetworkType.Ethereum]: 'latest',
} as const;

export const fetchNativeAsset = ({ networkType, endpoint, account }: { networkType: NetworkType; endpoint: string; account: string }) => {
  switch (networkType) {
    case NetworkType.Conflux:
    case NetworkType.Ethereum:
    default: {
      const rpcPrefix = networkRpcPrefixMap[networkType];
      const rpcSuffix = networkRpcSuffixMap[networkType];

      return fetchChain<string>({ url: endpoint, method: `${rpcPrefix}_getBalance`, params: [account, rpcSuffix] });
    }
  }
};

export const fetchConfluxNativeAsset = ({ endpoint, account }: { endpoint: string; account: string }) =>
  fetchNativeAsset({ networkType: NetworkType.Conflux, endpoint, account });

export const fetchEthereumNativeAsset = ({ endpoint, account }: { endpoint: string; account: string }) =>
  fetchNativeAsset({ networkType: NetworkType.Ethereum, endpoint, account });

export function fetchContractAsset(params: {
  networkType: NetworkType;
  endpoint: string;
  account: string;
  contractAddress: string;
  tokenId: string;
  assetType: AssetType.ERC1155;
}): Promise<string>;
export function fetchContractAsset(params: {
  networkType: NetworkType;
  endpoint: string;
  account: string;
  contractAddress: string;
  assetType: AssetType.ERC20 | AssetType.ERC721;
}): Promise<string>;
export function fetchContractAsset({ networkType, endpoint, account, contractAddress, tokenId, assetType}: {
  networkType: NetworkType;
  endpoint: string;
  account: string;
  contractAddress: string;
  tokenId?: string;
  assetType: Omit<AssetType, AssetType.Native>;
}) {
  switch (networkType) {
    case NetworkType.Conflux:
    case NetworkType.Ethereum:
    default: {
      const rpcPrefix = networkRpcPrefixMap[networkType];
      const rpcSuffix = networkRpcSuffixMap[networkType];

      const data =  
        (assetType === AssetType.ERC20 || assetType === AssetType.ERC721 ) ? `0x70a08231000000000000000000000000${account.slice(2)}` :
        assetType === AssetType.ERC1155 ? `0x00fdd58e000000000000000000000000${account.slice(2)}` : undefined!;

      return fetchChain<string>({
        url: endpoint,
        method: `${rpcPrefix}_call`,
        params: [{
          to: contractAddress,
          ...(data ? { data } : null)
        }, rpcSuffix],
      });
    }
  }
};


(function () {

  fetchChainMulticall({
      url: 'https://evmtestnet.confluxrpc.com',
      multicallContractAddress: '123',
      data: [{
          contractAddress: '0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479',
          encodedData: '0x70a08231000000000000000000000000cbea6b5c7f4b5b5e4bc5c5af5b5e4bc5c5af5b',
        },
        {
          contractAddress: '0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479',
          encodedData: '0x70a08231000000000000000000000000cbea6b5c7f4b5b5e4bc5c5af5b5e4bc5c5af5b',
        },    
      ] as const
    }).then((res) => {
      console.log(res);
    });

})();

const App: FC = () => {
  useEffect(() => {
    fetchChain({
      url: 'https://evmtestnet.confluxrpc.com',
      method: 'eth_getTransactionReceipt',
      params: ['0xea29089e7aeead5ae2d30ba7ffe260679a9abd4100614aee897baeea69560479'],
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return <></>;
};

export default App;
