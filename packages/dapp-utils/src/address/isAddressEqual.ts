import { InvalidAddressError } from '../error/address';
import { isHexAddress } from './isHexAddress';

export interface IsAddressEqualOptions<T> {
  /** default is isHexAddress(address, { strict: false }) */
  isAddress?: (address: T) => boolean;
}

const _isHexAddress = (address: string) => isHexAddress(address, { strict: false });

/**
 * check address a is equal to address b
 * use isHexAddress to check a and b is valid address by default, you can pass a custom isAddress function
 * @param a
 * @param b
 * @param options
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isAddressEqual("0xa0cf798816d4b9b9866b5330eea46a18382f251e", "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e") // true
 * isAddressEqual('cfx:achkr3pgrub5fyktzv0wg8fjtuma8pab8ygzf31gu9', 'cfx:achkr3pgrub5fyktzv0wg8fjtuma8pab8ygzf31gu9', {
 *    isAddress: isBase32Address,
 *  }) // true
 * ```
 */
export function isAddressEqual<T extends string>(a: T, b: T, options?: IsAddressEqualOptions<T>) {
  const { isAddress = _isHexAddress } = options ?? {};
  if (!isAddress(a)) throw new InvalidAddressError(`Address "${a}" is invalid.`);
  if (!isAddress(b)) throw new InvalidAddressError(`Address "${b}" is invalid.`);
  return a.toLowerCase() === b.toLowerCase();
}
