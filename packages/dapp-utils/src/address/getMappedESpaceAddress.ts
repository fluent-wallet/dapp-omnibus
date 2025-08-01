import { keccak_256 } from '@noble/hashes/sha3';
import { Buffer } from 'buffer';
import { HexAddress } from './types';
import { decode } from "./validateAddress";
import { checksumHexAddress } from "./checksumHexAddress";

export const getMappedESpaceAddress = (cfxAddress: string) => {
  const hexAddress = decode(cfxAddress).hexAddress;
  const mappedBuf = keccak_256(hexAddress);
  return checksumHexAddress(`0x${Buffer.from(mappedBuf).toString('hex').slice(-40)}` as HexAddress);
};
