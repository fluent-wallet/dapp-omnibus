/* eslint-disable @typescript-eslint/no-explicit-any */
import { encodeFunctionData as viemEncodeFunctionData, decodeFunctionResult as viemDecodeFunctionResult } from 'viem';
import ERC20ABI from './abis/ERC20';
import EnhanceERC20ABI from './abis/EnhanceERC20';
import ERC721ABI from './abis/ERC721';
import ERC1155ABI from './abis/ERC1155';
import MulticallABI from './abis/Multicall';
import type { Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames } from 'abitype';
export { default as MulticallABI } from './abis/Multicall';
export { default as ERC20ABI } from './abis/ERC20';
export { default as EnhanceERC20ABI } from './abis/EnhanceERC20';

type FunctionNames<T extends Abi> = ExtractAbiFunctionNames<T, 'pure' | 'view' | 'nonpayable' | 'payable'>;
type InputTypes<T extends Abi, N extends FunctionNames<T>> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<T, N>['inputs'], 'inputs'>;
type OutputTypes<T extends Abi, N extends FunctionNames<T>> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<T, N>['outputs'], 'outputs'>;

export const createContract = <T extends Abi>({ address, ABI }: { address: string; ABI: T }) => {
  return {
    encodeFunctionData: <F extends FunctionNames<T>>(
      functionName: F,
      args: InputTypes<T, F>,
    ): `0x${string}` => {
      return (viemEncodeFunctionData as any)({
        abi: ABI,
        functionName,
        args,
      });
    },
    decodeFunctionResult: <F extends FunctionNames<T>>(
      functionName: F,
      data: `0x${string}`,
    ): OutputTypes<T, F> => {
      const result = viemDecodeFunctionResult({
        abi: ABI as any,
        functionName: functionName as any,
        data,
      } as any);
      
      return (Array.isArray(result) ? result : [result]) as OutputTypes<T, F>;
    },
    address,
    abi: ABI,
  } as const;
};

export const createERC20Contract = (tokenAddress: string) => createContract({ address: tokenAddress, ABI: ERC20ABI });
export const createERC721Contract = (tokenAddress: string) => createContract({ address: tokenAddress, ABI: ERC721ABI });
export const createERC1155Contract = (tokenAddress: string) => createContract({ address: tokenAddress, ABI: ERC1155ABI });
export const createEnhanceERC20Contract = (tokenAddress: string) => createContract({ address: tokenAddress, ABI: EnhanceERC20ABI });
export const createMulticallContract = (contractAddress: string) => createContract({ address: contractAddress, ABI: MulticallABI });
