import { Base32Address, isBase32Address } from './isBase32Address';
import { HexAddress, isHexAddress } from './isHexAddress';

export type TruncateOptions = {
  prefixLength?: number | undefined;
  suffixLength?: number | undefined;
  ellipsis?: string | undefined;
};

export function truncate(str: string, { prefixLength = 4, suffixLength = 4, ellipsis = '...' }: TruncateOptions = {}) {
  if (str.length < prefixLength + suffixLength) {
    return str;
  }
  return str.substring(0, prefixLength) + ellipsis + str.substring(str.length - suffixLength);
}

/**
 * this is shorten address
 * @param address - hex or base32 address
 * @param options {@link TruncateOptions}
 * @returns string
 *
 * @example
 * ```ts
 * shortenAddress('0x1234567891234567891234567891234567891234')) // 0x1234...1234
 * shortenAddress('cfxtest:aams3mmwmg5pfknjxjzmws828vvd0u1pt674af1fex')) // cfxtest:aam...74af1fex
 * 
 * // with option
 *  shortenAddress('cfx:aams3mmwmg5pfknjxjzmws828vvd0u1pt61vxzvta3', { prefixLength: 4, suffixLength: 8, ellipsis: '...' })) // cfx:aams...1vxzvta3'
 *  shortenAddress('0x1234567891234567891234567891234567891234', { prefixLength: 5, suffixLength: 4, ellipsis: 'xxxx' })) // 0x12345xxxx1234
 * ```
 *
 */
export const shortenAddress = (address?: string | null, options: TruncateOptions = {}) => {
  if (typeof address !== 'string' || !address) return '';
  if (isHexAddress(address)) {
    return shortenEthereumAddress(address, options);
  } else if (isBase32Address(address)) {
    return shortenConfluxAddress(address, { prefixLength: 3, suffixLength: 8, ellipsis: '...', ...options }).toLowerCase();
  }

  return truncate(address, options);
};

const shortenEthereumAddress = (address: HexAddress, options?: TruncateOptions) => {
  return `0x${truncate(address.slice(2), options)}`;
};

export const shortenConfluxAddress = (address: Base32Address, options?: TruncateOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, netName, _shouldHaveType, payload, checksum] = address.toUpperCase().match(/^([^:]+):(.+:)?(.{34})(.{8})$/) || ['', '', '', '', ''];

  const addr = `${payload}${checksum}`;

  const shortStr = truncate(addr, options);

  return `${netName}:${shortStr}`;
};
