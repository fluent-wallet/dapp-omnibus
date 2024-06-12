type NetworkPrefix = 'cfx' | 'cfxtest' | `net${string}`;
type AddressType = 'builtin' | 'user' | 'contract';
export type Base32Address = `${NetworkPrefix}:${string}` | `${Uppercase<NetworkPrefix>}.TYPE.${Uppercase<AddressType>}:${string}`;

export type HexAddress = `0x${string}`;
