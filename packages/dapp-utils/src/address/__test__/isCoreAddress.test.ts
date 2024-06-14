import { test, expect } from 'vitest';

import { isCoreAddress } from '../isCoreAddress';

test('check is valid core space hex address', () => {
  expect(isCoreAddress('0x0000000000000000000000000000000000000000')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000000')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000001')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000002')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000004')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000005')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000006')).toBeTruthy();
  expect(isCoreAddress('0x0888000000000000000000000000000000000007')).toBeTruthy();

  expect(isCoreAddress('0x1D5EEe40aD4bB1F66b8a134f41C798631F812121')).toBeTruthy();

  expect(isCoreAddress('0xb01dF3DCBD3cF5503cD57eB9F5e109207Be0A6AD')).toBeFalsy();
  expect(isCoreAddress('0xa5803607B57fEeAc34332d79770CA1597CB2C77c')).toBeFalsy();
  expect(isCoreAddress('0x486992B7c26299ccC71b80339c9Aa23762d5718b')).toBeFalsy();

  expect(isCoreAddress('0x886992b7c26299ccc71b80339c9aa23762d5718b')).toBeTruthy();
});
