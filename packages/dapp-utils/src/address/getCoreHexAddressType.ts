import { hexToBytes } from '@noble/hashes/utils';
import { Base32AddressType } from './types';
import { InvalidCoreHexAddressError } from '../error/address';

export { InvalidCoreHexAddressError };
export function getCoreHexAddressType(address: string): Base32AddressType {
  const byteAddress = hexToBytes(address.startsWith('0x') ? address.slice(2) : address);
  switch (byteAddress[0] & 0xf0) {
    case 0x10:
      return 'user';
    case 0x80:
      return 'contract';
    case 0x00:
      for (const x of byteAddress) {
        if (x !== 0x00) return 'builtin';
      }
      return 'null';
    default:
      throw new InvalidCoreHexAddressError(`${address} is not valid core hex address, should start with 0x0, 0x1 or 0x8`);
  }
}
