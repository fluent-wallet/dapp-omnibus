import { checksumHexAddress } from './checksumHexAddress';
import { HexAddress } from './types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export type Options = {
  strict?: boolean | undefined;
};

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
export function isHexAddress(address: string, { strict = true }: Options = {}): address is HexAddress {
  if (!addressRegex.test(address)) return false;
  if (address.toLowerCase() === address) return true;
  if (strict) return checksumHexAddress(address as HexAddress) === address;
  return true;
}
