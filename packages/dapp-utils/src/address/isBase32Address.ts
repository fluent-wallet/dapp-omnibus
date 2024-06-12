import { convertCfxToHex } from './convertAddress';

export type NetworkPrefix = 'cfx' | 'cfxtest' | `net${string}`;
export type AddressType = 'builtin' | 'user' | 'contract';
export type Base32Address = `${NetworkPrefix}:${string}` | `${Uppercase<NetworkPrefix>}.TYPE.${Uppercase<AddressType>}:${string}`;

/**
 *  check if address is base32
 * @param address - base32 address
 * @returns true if address is base32
 */
export function isBase32Address(address: string): address is Base32Address {
  const result = (() => {
    if (address.toLowerCase() !== address && address.toUpperCase() !== address) return false;
    try {
      const addr = convertCfxToHex(address);
      return !!addr;
    } catch (error) {
      return false;
    }
  })();
  return result;
}
