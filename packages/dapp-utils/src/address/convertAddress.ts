import { encode, decode } from './validateAddress';

export const convertCfxToHex = (cfxAddress: string) => `0x${decode(cfxAddress).hexAddress.toString('hex')}`;

export const convertHexToCfx = (hexAddress: string, chainId: string) => encode(hexAddress, Number(chainId));
