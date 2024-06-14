import { isBase32Address } from './isBase32Address';
import { Base32Address } from './types';

/**
 * check if address is simply base32 (without address type)
 * @param address
 * @returns  true if address is simply base32
 *
 * @example
 * ```ts
 * isSimplyBase32Address('cfx:aaj6bf2b7fkcnypzp7tg9cnrpr58r4yt8pez2ajxea') // true
 * isSimplyBase32Address('CFX:TYPE.USER:AAJF5RE6V0KAZ4BCURUC8J1SZ5ZNRPYNJ212BBYPM6') // false
 * ```
 */

export function isSimplyBase32Address(address: Base32Address) {
  const parts = address.split(':');
  // [type:string]
  if (parts.length !== 2) return false;

  if (!isBase32Address(address)) return false;

  const [, netName, shouldHaveType, payload, checksum] = address.toUpperCase().match(/^([^:]+):(.+:)?(.{34})(.{8})$/) || ['', '', '', '', ''];

  return address.toLowerCase() === `${netName}:${payload}${checksum}`.toLowerCase();
}
