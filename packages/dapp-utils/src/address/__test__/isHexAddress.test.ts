import { expect, test } from 'vitest';

import { isHexAddress } from '../isHexAddress';

test('checks if address is valid', () => {
  expect(isHexAddress('0x7B2d7bb0cdCDe588d0C04fBbdb9b8EbC63BFc69')).toBeFalsy();
  expect(isHexAddress('x')).toBeFalsy();
  expect(isHexAddress('0xa')).toBeFalsy();
  expect(isHexAddress('0x025Db49c8d920AE82283602f22EeAEeab6b28b46')).toBeTruthy();
  expect(isHexAddress('0x842935f8D961FBce32a7cD891B50862AE718c')).toBeFalsy();
  expect(isHexAddress('0xbe5F9BFebF1Df54e616E60270A9E3D022cF9fe')).toBeFalsy();
  expect(isHexAddress('0xF70624b969E2e70ae96446259A37bdf2C087')).toBeFalsy();
});
