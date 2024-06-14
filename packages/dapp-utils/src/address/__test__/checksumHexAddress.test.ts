import { test, expect } from 'vitest';

import { checksumHexAddress } from '../checksumHexAddress';

test('checksum address', () => {
  expect(checksumHexAddress('0xed5030fbf195d8a71ccd644fce98c3c32d8ee24c')).toBe('0xEd5030Fbf195d8a71CCd644fCE98C3c32d8Ee24C');
  expect(checksumHexAddress('0x2b102a1e9925a1e5061b95627b23d6f427a20399')).toBe('0x2b102a1e9925a1e5061b95627b23D6F427a20399');

  expect(checksumHexAddress('0x2f52b4c6ae3abbced86233a5a6ec730aefe909ba')).toBe('0x2F52B4C6AE3aBbced86233A5A6eC730aefe909bA');

  expect(checksumHexAddress('0xf417ddb9762a70c360c26e37b8b0ae71e52a9b97')).toBe('0xF417DDb9762A70c360c26e37b8B0aE71e52a9B97');

  expect(checksumHexAddress('0xe9a5bf4054792578ffa3117af3df4c20b7920e17')).toBe('0xE9a5BF4054792578FfA3117aF3df4C20B7920e17');

  expect(checksumHexAddress('0x4c43298c4cffd4b9fe5d85e225dc50d5fdf43acf')).toBe('0x4c43298C4cFfd4b9FE5d85E225dC50d5fdf43Acf');
});
