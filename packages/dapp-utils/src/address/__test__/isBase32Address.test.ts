import { test, expect } from 'vitest';
import { isBase32Address } from '../isBase32Address';

test('checks if address is valid', () => {
  expect(isBase32Address('cfx:aaj6bf2b7fkcnypzp7tg9cnrpr58r4yt8pez2ajxea')).toBeFalsy();
  expect(isBase32Address('cfx')).toBeFalsy();
  expect(isBase32Address('cfx:abc')).toBeFalsy();
  expect(isBase32Address('cfx:aan750nzkks6uuxgg3s9t4dp317ag7u2yjbxg7trt5')).toBeTruthy();
  expect(isBase32Address('cfxtest:aan750nzkks6uuxgg3s9t4dp317ag7u2yjn2zrkhnv')).toBeTruthy();
  expect(isBase32Address('net1:aan750nzkks6uuxgg3s9t4dp317ag7u2yjbxg7trt5')).toBeFalsy();
  expect(isBase32Address('net999999:aan750nzkks6uuxgg3s9t4dp317ag7u2yjn2zrkhnv')).toBeFalsy();
});
