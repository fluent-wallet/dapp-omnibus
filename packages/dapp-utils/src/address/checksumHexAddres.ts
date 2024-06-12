import { HexAddress } from './types';
import { keccak_256 } from '@noble/hashes/sha3';
import { utf8ToBytes } from '@noble/hashes/utils';

export function checksumHexAddress(address_: HexAddress, chainId?: number | undefined): HexAddress {
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash = keccak_256(utf8ToBytes(hexAddress));

  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split('');
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }

  return `0x${address.join('')}`;
}
