import { test, expect } from 'vitest';

import { isSimplyBase32Address } from '../isSimplyBase32Address';

test('checks simply base32 address', () => {
  expect(isSimplyBase32Address('cfx:aan750nzkks6uuxgg3s9t4dp317ag7u2yjbxg7trt5')).toBeTruthy();
  expect(isSimplyBase32Address('CFX:TYPE.USER:AAJF5RE6V0KAZ4BCURUC8J1SZ5ZNRPYNJ212BBYPM6')).toBeFalsy();

  expect(isSimplyBase32Address('cfxtest:aajf5re6v0kaz4bcuruc8j1sz5znrpynj6d9ryrmuw')).toBeTruthy();
  expect(isSimplyBase32Address('CFXTEST:TYPE.USER:AAJF5RE6V0KAZ4BCURUC8J1SZ5ZNRPYNJ6D9RYRMUW')).toBeFalsy();
  
  expect(isSimplyBase32Address('net10086:aaag4wt2mbmbb44sp6szd783ry0jtad5benr1ap5gp')).toBeTruthy();
});
