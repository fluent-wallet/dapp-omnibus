import { describe, expect, test } from 'vitest';

import { isAddressEqual } from '../isAddressEqual.js';
import { isCoreHexAddress } from '../isCoreHexAddress.js';
import { isBase32Address } from '../isBase32Address.js';

test('checksums address', () => {
  expect(isAddressEqual('0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac', '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')).toBeTruthy();
  expect(isAddressEqual('0xa0cf798816d4b9b9866b5330eea46a18382f251e', '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')).toBeTruthy();
  expect(isAddressEqual('0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac', '0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac')).toBeTruthy();
  expect(isAddressEqual('0xa0cf798816d4b9b9866b5330eea46a18382f251e', '0xA0Cf798816D4b9b9866b5330EEa46a18382f251f')).toBeFalsy();
});

test('core hex address', () => {
  expect(
    isAddressEqual('0x8E96E5866C03B2D12FAC6D2378A87c140f3001f5', '0x8e96e5866c03b2d12fac6d2378a87c140f3001f5', {
      isAddress: isCoreHexAddress,
    }),
  ).toBeTruthy();
  expect(
    isAddressEqual('0x8e96e5866c03b2d12fac6d2378a87c140f3001f5', '0x8e96e5866c03b2d12fac6d2378a87c140f3001f6', {
      isAddress: isCoreHexAddress,
    }),
  ).toBeFalsy();
});

test('core base32 address', () => {
  expect(
    isAddressEqual('cfx:achkr3pgrub5fyktzv0wg8fjtuma8pab8ygzf31gu9', 'cfx:achkr3pgrub5fyktzv0wg8fjtuma8pab8ygzf31gu9', {
      isAddress: isBase32Address,
    }),
  ).toBeTruthy();
  expect(
    isAddressEqual('cfx:ach5tf6c6fgaum951enkft2hcgd2p2ah4ja8phm0m7', 'cfx:achkr3pgrub5fyktzv0wg8fjtuma8pab8ygzf31gu9', {
      isAddress: isBase32Address,
    }),
  ).toBeFalsy();
});

describe('errors', () => {
  test('invalid address', () => {
    expect(() => isAddressEqual('0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678az', '0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac')).toThrowError();
    expect(() => isAddressEqual('0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac', '0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678aff')).toThrowError();
  });
});
