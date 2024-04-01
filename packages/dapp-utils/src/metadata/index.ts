import { createERC721Contract, createERC1155Contract } from '../contract';
import { fetchChain, createFetchServer } from '../fetch';

interface MetadataOptions {
  /** default for unknown: call 721 and 1155 contract to get metadata */
  contractType?: 'unknown' | '721' | '1155';
  /** required while no fetchServer */
  rpcServer: string;
  /** required while no fetchServer */
  nftAddress: string;
  /** required while no fetchServer */
  tokenId: string | number | bigint;
  /** default for https://nftstorage.link/ */
  ipfsGateway?: string;
}
interface ServerOptions<T> extends Partial<MetadataOptions> {
  fetchServer: () => Promise<T>;
}

const { fetchServer: fetch } = createFetchServer({});

const ipfsGatewayURI = (_uri: string, ipfsGateway: string) => {
  if (_uri.startsWith('ipfs')) {
    if (!ipfsGateway.endsWith('/')) {
      ipfsGateway += '/';
    }
    _uri = ipfsGateway + _uri.replace('ipfs://', 'ipfs/');
  }
  return _uri;
};
const paddingId = (tokenId: string | number | bigint) => {
  tokenId = Number(tokenId).toString(16);
  return tokenId.padStart(64, '0');
};
const decodeBase64 = (data: string) => {
  const parts = data.split(',');
  const decoded = window.atob(parts[1]);
  return JSON.parse(decoded);
};
const lowerFirstLetter = (str: string) => {
  return str[0].toLowerCase() + str.slice(1);
};

const normalizeMeta = (meta: Record<string, unknown>, ipfsGateway: string) => {
  // lowerCase of all keys in first level
  const normalizedMeta: Record<string, unknown> = {};
  for (const key in meta) {
    normalizedMeta[lowerFirstLetter(key)] = meta[key];
  }

  if (normalizedMeta.image) {
    normalizedMeta.image = ipfsGatewayURI(normalizedMeta.image as string, ipfsGateway);
  }
  return normalizedMeta;
};

const getMetadataByURI = async (rawURI: string, ipfsGateway: string) => {
  let meta = {};
  // json
  if (rawURI.startsWith('{')) {
    return JSON.parse(rawURI) as object;
  }

  // get meta throught ipfs gateway
  if (rawURI.startsWith('ipfs')) {
    rawURI = ipfsGatewayURI(rawURI, ipfsGateway);
  }
  console.log('rawURI', rawURI);

  // fetch metadata
  if (rawURI.startsWith('http')) {
    meta = await fetch({
      url: rawURI,
    });
  }

  // base64
  if (rawURI.match('base64')) {
    meta = decodeBase64(rawURI);
  }
  // normalize and return
  return normalizeMeta(meta, ipfsGateway);
};

const getTokenURIBy721Contract = async (options: MetadataOptions) => {
  const { nftAddress, tokenId, rpcServer } = options;
  try {
    const contract = createERC721Contract(nftAddress);
    const fetchRes = await fetchChain<string>({
      url: rpcServer,
      params: [{ data: contract.encodeFunctionData('tokenURI', [BigInt(tokenId)]), to: contract.address }, 'latest'],
    });
    const tokenURI = contract.decodeFunctionResult('tokenURI', fetchRes)[0];
    return tokenURI;
  } catch (error) {
    console.error('fetch 721 contract token uri error: ', error);
    throw error;
  }
};
const getTokenURIBy1155Contract = async (options: MetadataOptions) => {
  const { nftAddress, tokenId, rpcServer } = options;
  try {
    const contract = createERC1155Contract(nftAddress);
    const fetchRes = await fetchChain<string>({
      url: rpcServer,
      params: [{ data: contract.encodeFunctionData('uri', [BigInt(tokenId)]), to: contract.address }, 'latest'],
    });
    const tokenURI = contract.decodeFunctionResult('uri', fetchRes)[0];
    return tokenURI;
  } catch (error) {
    console.error('fetch 1155 contract token uri error: ', error);
    throw error;
  }
};
const fetchMetadataByContract = async <T extends object>(options: MetadataOptions) => {
  const { contractType = 'unknown', tokenId, ipfsGateway = 'https://nftstorage.link/' } = options;
  const promises: Promise<string>[] = [];
  if (contractType === 'unknown' || contractType === '721') {
    promises.push(getTokenURIBy721Contract(options));
  }
  if (contractType === 'unknown' || contractType === '1155') {
    promises.push(getTokenURIBy1155Contract(options));
  }
  const responseList = await Promise.allSettled(promises);
  const tokenURIResponse = responseList.find((a) => a.status === 'fulfilled');
  if (!tokenURIResponse) {
    console.error('721 and 1155 responses: ', responseList);
    throw new Error('both 721 and 1155 contract get token uri error');
  } else {
    try {
      const tokenURI = (tokenURIResponse as PromiseFulfilledResult<string>).value;
      console.log('tokenURI', tokenURI);
      const rawURI = tokenURI.replace('{id}', paddingId(tokenId));
      console.log('rawURI', rawURI);
      const metadata = await getMetadataByURI(rawURI, ipfsGateway);
      return {
        detail: {
          metadata: metadata as T,
        },
      };
    } catch (error) {
      console.error('get metadata by tokenURI error: ', error);
      throw error;
    }
  }
};

export function fetchNFTMetadata<T, P extends object>(
  options: ServerOptions<T>,
): Promise<
  | T
  | {
      detail: {
        metadata: P;
      };
    }
  | undefined
>;
export function fetchNFTMetadata<P extends object>(
  options: MetadataOptions,
): Promise<
  | {
      detail: {
        metadata: P;
      };
    }
  | undefined
>;
export async function fetchNFTMetadata<T = undefined, P extends object = object>(options: ServerOptions<T> | MetadataOptions) {
  if ('fetchServer' in options) {
    const { fetchServer, nftAddress, tokenId, rpcServer } = options;
    try {
      const result = await fetchServer();
      return result;
    } catch (error) {
      console.warn('fetch server metadata error: ', error);
      if (nftAddress && tokenId && rpcServer) {
        return fetchMetadataByContract<P>(options as MetadataOptions);
      } else {
        throw error;
      }
    }
  } else {
    return fetchMetadataByContract<P>(options);
  }
}
