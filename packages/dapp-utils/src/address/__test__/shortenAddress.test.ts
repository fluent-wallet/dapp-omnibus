import { shortenAddress, truncate } from '../shortenAddress';
import { test, expect, describe } from 'vitest';

describe('shortenAddress', () => {
  test('truncate', () => {
    expect(truncate('0000000000000000000000000000000000000000', { prefixLength: 4, suffixLength: 4, ellipsis: '...' })).toBe('0000...0000');
    expect(truncate('0000000000000000000000000000000000000000')).toBe('0000...0000');
    expect(truncate('0000000000000000000000000000000000000000', { prefixLength: 4, suffixLength: 4, ellipsis: '***' })).toBe('0000***0000');
    expect(truncate('0000000000000000000000000000000000000000', { suffixLength: 5 })).toBe('0000...00000');
    expect(truncate('1234567890123456789012345678901234567890', { prefixLength: 5 })).toBe('12345...7890');
    expect(truncate('1234567890123456789012345678901234567890', { ellipsis: '555' })).toBe('12345557890');
    expect(truncate('1234567')).toBe('1234567');
  });

  test('hex address', () => {
    expect(shortenAddress('0x0000000000000000000000000000000000000000')).toBe('0x0000...0000');
    expect(shortenAddress('0x1234567891234567891234567891234567891234')).toBe('0x1234...1234');
    expect(shortenAddress('0x1234567891234567891234567891234567891234', { prefixLength: 5, suffixLength: 4, ellipsis: '...' })).toBe('0x12345...1234');
    expect(shortenAddress('0x1234567891234567891234567891234567891234', { prefixLength: 5, suffixLength: 4, ellipsis: 'xxxx' })).toBe('0x12345xxxx1234');
    expect(shortenAddress('0x12345678', { ellipsis: 'xxxx' })).toBe('0x12xxxx5678');
  });

  test('base32 address', () => {
    expect(shortenAddress('cfxtest:aams3mmwmg5pfknjxjzmws828vvd0u1pt674af1fex')).toBe('cfxtest:aam...1fex');
    expect(shortenAddress('cfx:aams3mmwmg5pfknjxjzmws828vvd0u1pt61vxzvta3')).toBe('cfx:aam...1vxzvta3');
    expect(shortenAddress('net10086:aaag4wt2mbmbb44sp6szd783ry0jtad5benr1ap5gp')).toBe('net10086:aaa...p5gp');
    expect(shortenAddress('net7876:aamue88kha4th1am7t3uvt94kr18t02xhac258u0wc')).toBe('net7876:aam...u0wc');

    expect(shortenAddress('cfx:aams3mmwmg5pfknjxjzmws828vvd0u1pt61vxzvta3', { prefixLength: 4, suffixLength: 8, ellipsis: '...' })).toBe('cfx:aams...1vxzvta3');

    expect(shortenAddress('cfx:aams3mmwmg5pfknjxjzmws828vvd0u1pt61vxzvta3', { prefixLength: 4, suffixLength: 8, ellipsis: 'xxxx' })).toBe(
      'cfx:aamsxxxx1vxzvta3',
    );
    expect(shortenAddress('cfx:aams3mmwmg5pfknjxjzmws828vvd0u1pt61vxzvta3', { prefixLength: 1, suffixLength: 1, ellipsis: 'xxxx' })).toBe('cfx:axxxx3');
  });
});
