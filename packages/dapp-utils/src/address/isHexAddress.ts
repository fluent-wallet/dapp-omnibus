import { checksumHexAddress } from './checksumHexAddres';
import { HexAddress } from './types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export type Options = {
  strict?: boolean | undefined;
};

/**
 * simple check if address is hex, this function is not verified the checksum of address
 * @param address - hex string
 * @returns true if address is hex
 */
export function isHexAddress(address: string, { strict = true }: Options = {}): address is HexAddress {
  if (!addressRegex.test(address)) return false;
  if (address.toLowerCase() === address) return true;
  if (strict) return checksumHexAddress(address as HexAddress) === address;
  return true;
}
