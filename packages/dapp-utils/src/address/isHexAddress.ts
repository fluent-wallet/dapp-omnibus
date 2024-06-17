import { LruMap } from '../utils/lru';
import { checksumHexAddress } from './checksumHexAddress';
import { HexAddress } from './types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export type Options = {
  strict?: boolean | undefined;
  useCache?: boolean | undefined;
};
export const isHexAddressCache = /*#__PURE__*/ new LruMap<boolean>(4096);
/**
 * check the address is valid hex address
 * @param address - hex string
 * @returns true if address is hex
 *
 * @example
 *
 * ```ts
 * isHexAddress("0x025Db49c8d920AE82283602f22EeAEeab6b28b46") // true
 * // not verify checksum
 * isHexAddress("0x025Db49c8d920AE82283602f22EeAEeab6b28b46", {strict: false}) // true
 * ```
 */
export function isHexAddress(address: string, { strict = true, useCache = true }: Options = {}): address is HexAddress {
  if (isHexAddressCache.has(address) && useCache) return isHexAddressCache.get(address)!;

  const result = (() => {
    if (!addressRegex.test(address)) return false;
    if (address.toLowerCase() === address) return true;
    if (strict) return checksumHexAddress(address as HexAddress) === address;
    return true;
  })();
  isHexAddressCache.set(address, result);
  return true;
}
