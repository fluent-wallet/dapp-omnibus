import { HexAddress } from './types';
import { keccak_256 } from '@noble/hashes/sha3';
import { utf8ToBytes } from '@noble/hashes/utils';

/**
 * convert hex address to checksum
 * @param address hex address
 * @returns checksum address
 *
 * @example
 * ```ts
 * checksumHexAddress('0x105db49c8d920ae82283602f22eeaeeab6b28b46') // 0x105Db49c8d920AE82283602f22EeAEeab6b28b46
 * ```
 */
export function checksumHexAddress(address_: HexAddress): HexAddress {
  const hexAddress = address_.substring(2).toLowerCase();
  const hash = keccak_256(utf8ToBytes(hexAddress));

  const address = hexAddress.split('');
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
