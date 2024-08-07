import { LruMap } from '../utils/lru';
import { convertBase32ToHex } from './convertAddress';
import { Base32Address } from './types';

/**
 *  check if address is base32
 * @param address - base32 address
 * @returns true if address is base32
 */
export const isBase32AddressCache = /*#__PURE__*/ new LruMap<boolean>(4096);
export type IsBase32AddressOption = { useCache?: boolean | undefined };

export function isBase32Address(address: string, { useCache = true }: IsBase32AddressOption = {}): address is Base32Address {
  if (isBase32AddressCache.has(address) && useCache) return isBase32AddressCache.get(address)!;
  const result = (() => {
    if (address.toLowerCase() !== address && address.toUpperCase() !== address) return false;
    try {
      const addr = convertBase32ToHex(address as Base32Address);
      return !!addr;
    } catch (error) {
      return false;
    }
  })();
  isBase32AddressCache.set(address, result);
  return result;
}
