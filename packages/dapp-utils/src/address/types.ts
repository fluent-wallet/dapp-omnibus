type CustomNetworkPrefix<UpCase extends boolean | undefined = undefined> = UpCase extends undefined
  ? `net${string}`
  : UpCase extends true
    ? `NET${string}`
    : `net${string}`;
type NetworkPrefix<UpCase extends boolean | undefined = undefined> = UpCase extends undefined
  ? 'cfx' | 'cfxtest' | CustomNetworkPrefix<UpCase>
  : UpCase extends true
    ? 'CFX' | 'CFXTEST' | CustomNetworkPrefix<UpCase>
    : 'cfx' | 'cfxtest' | CustomNetworkPrefix<UpCase>;

type AddressType = 'builtin' | 'user' | 'contract';

export type Base32Address = `${NetworkPrefix}:${string}` | `${NetworkPrefix<true>}:TYPE.${Uppercase<AddressType>}:${string}`;

export type HexAddress = `0x${string}`;
