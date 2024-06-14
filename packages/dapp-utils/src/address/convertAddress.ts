import { Base32Address } from './types';
import { encode, decode } from './validateAddress';

/**
 * convert base32 address to hex
 * @param base32Address
 * @returns hex address
 *
 * @example
 * ```ts
 * convertBase32ToHex("cfx:aajf5re6v0kaz4bcuruc8j1sz5znrpynj212bbypm6") // 0x105db49c8d920ae82283602f22eeaeeab6b28b46
 * ```
 */

export const convertBase32ToHex = (base32Address: Base32Address) => `0x${decode(base32Address).hexAddress.toString('hex')}`;

/**
 * convert hex address to base32
 * @param hexAddress
 * @param chainId
 * @returns base32 address
 *
 * @example
 * ```ts
 * convertHexToBase32('0x105db49c8d920ae82283602f22eeaeeab6b28b46', 1029) // cfx:aajf5re6v0kaz4bcuruc8j1sz5znrpynj212bbypm6
 * convertHexToBase32('0x105db49c8d920ae82283602f22eeaeeab6b28b46', '1') // cfxtest:aajf5re6v0kaz4bcuruc8j1sz5znrpynj27xwvwgs0
 * ```
 */
export const convertHexToBase32 = (hexAddress: string, chainId: string) => encode(hexAddress, Number(chainId));

/**
 * @deprecated use {@link convertHexToBase32}
 */
export const convertHexToCfx = convertHexToBase32;
/**
 * @deprecated use {@link convertBase32ToHex}
 */
export const convertCfxToHex = convertBase32ToHex;
