import { test, expect } from 'vitest';
import { getCoreHexAddressType } from '../getCoreHexAddressType';

test('get core hex address type', () => {
  expect(getCoreHexAddressType('0x0000000000000000000000000000000000000000')).toBe('null');

  expect(getCoreHexAddressType('0x0888000000000000000000000000000000000001')).toBe('builtin');
  expect(getCoreHexAddressType('0x0888000000000000000000000000000000000002')).toBe('builtin');

  expect(getCoreHexAddressType('0x8e2F2E68eB75bB8B18caAFE9607242D4748f8D98')).toBe('contract');
  expect(getCoreHexAddressType('0x86d2fb177eff4be03a342951269096265b98ac46')).toBe('contract');
  expect(getCoreHexAddressType('0x8b8689C7F3014A4D86e4d1D0daAf74A47f5E0f27')).toBe('contract');
  expect(getCoreHexAddressType('0x8441C5A4514EAa2b962FE1a598e1F41f31182f0E')).toBe('contract');
  expect(getCoreHexAddressType('0x8d7DF9316FAa0586e175B5e6D03c6bda76E3d950')).toBe('contract');

  expect(getCoreHexAddressType('0x10fbD51ab6f51A5697425A4635B0d52825F86aA2')).toBe('user');
  expect(getCoreHexAddressType('0x13D6FF1229Fdd82B6a99B730C5181724Db119137')).toBe('user');
  expect(getCoreHexAddressType('0x18eA07067115937eFEE8d67209456c79602d1dFE')).toBe('user');
  expect(getCoreHexAddressType('0x112eE29B9a36A471AC2Ca683463Ee657Bc5b0C54')).toBe('user');

  expect(() => getCoreHexAddressType('0x9000000000000000000000000000000000000000')).toThrowError();
  expect(() => getCoreHexAddressType('0x3e2F2E68eB75bB8B18caAFE9607242D4748f8D98')).toThrowError();
  expect(() => getCoreHexAddressType('0x4e2F2E68eB75bB8B18caAFE9607242D4748f8D98')).toThrowError();
  expect(() => getCoreHexAddressType('0x5e2F2E68eB75bB8B18caAFE9607242D4748f8D98')).toThrowError();
});
