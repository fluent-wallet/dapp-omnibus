import { fetchChain } from '@cfx-kit/dapp-utils/dist/fetch';
import { createEnhanceERC20Contract } from '@cfx-kit/dapp-utils/dist/contract';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';
import { sendTransaction } from '../AccountManage';
import { waitTransactionReceipt } from './utils';
import { AddedValue, ApproveStatus } from './types';

const fetchAllowance = async ({
  rpcUrl,
  account,
  tokenAddress,
  contractAddress,
}: {
  rpcUrl: string;
  account: string;
  tokenAddress: string;
  contractAddress: string;
}) => {
  const tokenContract = createEnhanceERC20Contract(tokenAddress);
  const fetchRes = await fetchChain<string>({
    url: rpcUrl,
    params: [
      { data: tokenContract.encodeFunctionData('allowance', [account as `0x${string}`, contractAddress as `0x${string}`]), to: tokenContract.address },
      'latest',
    ],
  });
  const allowance = tokenContract.decodeFunctionResult('allowance', fetchRes)?.[0];
  return allowance || BigInt(0);
};

export const fetchApproveStatus = async ({
  rpcUrl,
  account,
  tokenAddress,
  contractAddress,
  tokenDecimals = 18,
  amount,
}: {
  rpcUrl: string;
  account: string;
  contractAddress: string;
  tokenAddress: string;
  tokenDecimals?: number;
  amount: string;
}): Promise<{
  approveStatus: ApproveStatus;
  allowance?: bigint;
}> => {
  const amountUnit = Unit.fromStandardUnit(amount || 0, tokenDecimals);
  try {
    const allowance = await fetchAllowance({
      rpcUrl,
      account: account,
      tokenAddress: tokenAddress,
      contractAddress: contractAddress,
    });
    const approveBalance = new Unit(allowance);
    if (approveBalance.greaterThanOrEqualTo(amountUnit)) {
      return {
        approveStatus: 'approved',
        allowance,
      };
    } else {
      return {
        approveStatus: 'need-approve',
        allowance,
      };
    }
  } catch (err) {
    console.error('Check approve err', err);
    return {
      approveStatus: 'need-approve',
    };
  }
};

export const approve = async ({
  contractAddress,
  tokenAddress,
  amount,
  waitTxHash = true,
  rpcUrl,
}: {
  contractAddress: string;
  tokenAddress: string;
  amount: AddedValue;
  waitTxHash?: boolean;
  rpcUrl?: string;
}) => {
  if (!tokenAddress) return;
  const tokenContract = createEnhanceERC20Contract(tokenAddress);
  try {
    const txHash = await sendTransaction({
      to: tokenAddress,
      data: tokenContract.encodeFunctionData('approve', [contractAddress as `0x${string}`, amount as unknown as bigint]),
    });
    if (waitTxHash) {
      if (rpcUrl) {
        const { promise } = waitTransactionReceipt(txHash, rpcUrl);
        await promise;
      } else {
        console.error('rpcUrl is required while waitTxHash is true');
      }
    }
    return txHash;
  } catch (err) {
    console.error('increase allowance err', err);
    throw err;
  }
};

export const decreaseAllowance = async ({
  contractAddress,
  tokenAddress,
  amount,
  waitTxHash = true,
  rpcUrl,
}: {
  contractAddress: string;
  tokenAddress: string;
  amount: AddedValue;
  waitTxHash?: boolean;
  rpcUrl?: string;
}) => {
  if (!tokenAddress) return;
  const tokenContract = createEnhanceERC20Contract(tokenAddress);
  try {
    const txHash = await sendTransaction({
      to: tokenAddress,
      data: tokenContract.encodeFunctionData('decreaseAllowance', [contractAddress as `0x${string}`, amount as unknown as bigint]),
    });
    if (waitTxHash) {
      if (rpcUrl) {
        const { promise } = waitTransactionReceipt(txHash, rpcUrl);
        await promise;
      } else {
        console.error('rpcUrl is required while waitTxHash is true');
      }
    }
    return txHash;
  } catch (err) {
    console.error('decrease allowance err', err);
    throw err;
  }
};

export const increaseAllowance = async ({
  contractAddress,
  tokenAddress,
  amount,
  waitTxHash = true,
  rpcUrl,
}: {
  contractAddress: string;
  tokenAddress: string;
  amount: AddedValue;
  waitTxHash?: boolean;
  rpcUrl?: string;
}) => {
  if (!tokenAddress) return;
  const tokenContract = createEnhanceERC20Contract(tokenAddress);
  try {
    const txHash = await sendTransaction({
      to: tokenAddress,
      data: tokenContract.encodeFunctionData('increaseAllowance', [contractAddress as `0x${string}`, amount as unknown as bigint]),
    });
    if (waitTxHash) {
      if (rpcUrl) {
        const { promise } = waitTransactionReceipt(txHash, rpcUrl);
        await promise;
      } else {
        console.error('rpcUrl is required while waitTxHash is true');
      }
    }
    return txHash;
  } catch (err) {
    console.error('increase allowance err', err);
    throw err;
  }
};

export const handleApprove = async ({
  tokenAddress,
  contractAddress,
  type,
  amount,
  rpcUrl,
  waitTxHash = true,
}: {
  waitTxHash?: boolean;
  rpcUrl?: string;
  contractAddress: string;
  tokenAddress: string;
  type: 'approve' | 'increase-allowance';
  amount: AddedValue;
}) => {
  if (type === 'approve') {
    return approve({
      contractAddress,
      tokenAddress,
      amount,
      rpcUrl,
      waitTxHash,
    });
  } else {
    return increaseAllowance({
      contractAddress,
      tokenAddress,
      amount,
      rpcUrl,
      waitTxHash,
    });
  }
};
