export type HexAddress = `0x${string}`;
const addressRegex = /^0x[a-fA-F0-9]{40}$/;

/**
 * simple check if address is hex, this function is not verified the checksum of address
 * @param address - hex string
 * @returns true if address is hex
 */
export function isHexAddress(address: string): address is HexAddress {
  if (!addressRegex.test(address)) return false;
  if (address.toLowerCase() === address) return true;
  return true;
}
