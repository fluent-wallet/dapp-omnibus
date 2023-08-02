import { isNegative, isString } from '@cfx-kit/utils/src/is';
export const validateHexAddress = (address: string) => /^0x[0-9a-fA-F]{40}$/.test(address);

const getEllipsStr = (str: string, frontNum: number, endNum: number) => {
  if (!isString(str) || isNegative(frontNum) || isNegative(endNum)) {
    throw new Error('Invalid args');
  }
  const length = str.length;
  if (frontNum + endNum >= length) {
    return str.substring(0, length);
  }
  return str.substring(0, frontNum) + '...' + str.substring(length - endNum, length);
};

export const shortenEthereumAddress = (address?: string | null) => {
  if (typeof address !== 'string' || !address) return '';
  if (address.startsWith('0x')) {
    if (!validateHexAddress(address)) {
      throw new Error('Invalid ethereum address');
    }
    return getEllipsStr(address, 6, 4);
  }
  return '';
};
