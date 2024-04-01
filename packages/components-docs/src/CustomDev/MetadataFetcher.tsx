import { useEffect, type FC } from 'react';
import { createFetchServer } from '@cfx-kit/dapp-utils/src/fetch';
import { fetchNFTMetadata } from '@cfx-kit/dapp-utils/src/metadata';

export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface MetadataPresented {
  index: number;
  image: string;
  name: string;
  link?: string;
}

export interface MetadataSlider {
  index: number;
  value: string;
}

interface NFTMetadata {
  name?: string;
  description?: string;
  priority?: string;
  overview?: string;
  image?: string;
  distribute?: MetadataAttribute[];
  links?: MetadataAttribute[];
  presented?: MetadataPresented[];
  project_stage?: MetadataAttribute[];
  slider?: MetadataSlider[];
  tags?: string[];
  label?: string[];
}

export interface NFTTokenInfo {
  detail?: {
    metadata?: NFTMetadata;
  };
}
const { fetchServer: fetchScanAPI } = createFetchServer({
  prefixUrl: 'https://evmtestnet.confluxscan.io',
  responseHandler: (_res: unknown) => {
    const res = _res as unknown as { status: string; message: string; result: unknown };
    if (res?.status === '1') {
      return res?.result;
    } else {
      throw new Error(`Fetch dex error: ${res?.message}`);
    }
  },
});
export const _fetchNFTTokenInfo = async ({ address, tokenId }: { address: string; tokenId: string }) =>
  fetchScanAPI<NFTTokenInfo>({
    url: `stat/nft/checker/preview?contractAddress=${address}&tokenId=${tokenId}`,
  });
const fetchNFTTokenInfo = ({ address, tokenId }: { address: string; tokenId: string }) =>
  fetchNFTMetadata<NFTTokenInfo, NFTMetadata>({
    fetchServer: () => _fetchNFTTokenInfo({ address, tokenId }),
    nftAddress: address,
    tokenId,
    rpcServer: import.meta.env.VITE_ESpaceRpcUrl,
    contractType: '721',
  }).catch(() => null);

const App: FC = () => {
  useEffect(() => {
    fetchNFTTokenInfo({
      address: '0xdedd1e39e27e8f19ba93bb7dbb22b8eb040c8230',
      tokenId: '123',
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return <>view metadata in console</>;
};

export default App;
