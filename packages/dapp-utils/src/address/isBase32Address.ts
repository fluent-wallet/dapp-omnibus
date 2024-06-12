import { LruMap } from '../utils/lru';
import { convertCfxToHex } from './convertAddress';
import { Base32Address } from './types';


/**
 *  check if address is base32
 * @param address - base32 address
 * @returns true if address is base32
 */
export const isBase32AddressCache = /*#__PURE__*/ new LruMap<boolean>(4096);

export function isBase32Address(address: string): address is Base32Address {
  if (isBase32AddressCache.has(address)) return isBase32AddressCache.get(address)!;
  const result = (() => {
    if (address.toLowerCase() !== address && address.toUpperCase() !== address) return false;
    try {
      const addr = convertCfxToHex(address);
      return !!addr;
    } catch (error) {
      return false;
    }
  })();
  isBase32AddressCache.set(address, result);
  return result;
}
