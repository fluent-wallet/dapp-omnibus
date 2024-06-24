/**
 * check hex address is valid pos address
 * this function only check the length of address
 * @param address hex address
 * @returns true if address is pos
 *
 * @example
 * ```ts
 * isPosAddress("0x....") // true or false
 *
 * ```
 */
export function isPosAddress(address: string) {
  try {
    return address.startsWith('0x') && address.length === 66;
  } catch (e) {
    return false;
  }
}
