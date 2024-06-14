import { isHexAddress } from './isHexAddress';
import { HexAddress } from './types';

/**
 * check hex address is valid core address
 * @param address
 * @returns
 *
 * @example
 *
 * ```ts
 * isCoreHexAddress("0x18E2aD4E486F483EAC134d497Fae1C7Cd2e36EB7") // true
 * ```
 */
export function isCoreHexAddress(address: HexAddress) {
  if (!address.startsWith('0x') || address.length !== 42) {
    return false;
  }

  if (!isHexAddress(address)) {
    return false;
  }
  // 0x00   0x08                           0x8                        0x1
  return address.startsWith('0x0') || address.startsWith('0x8') || address.startsWith('0x1');
}
