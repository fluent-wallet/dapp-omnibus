import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { Unit } from '@cfxjs/use-wallet-react/ethereum';
import { ApproveStatus } from './types';
import { fetchApproveStatus, handleApprove } from './apis';

export function useApproveStatus({
  account,
  tokenAddress,
  contractAddress,
  amount,
  rpcUrl,
  tokenDecimals = 18,
  wait = 666,
}: {
  account: string | null | undefined;
  contractAddress: string | null | undefined;
  tokenAddress: string | null | undefined;
  tokenDecimals?: number;
  amount: string;
  rpcUrl: string;
  wait?: number;
}) {
  const [approveStatus, setApproveStatus] = useState<ApproveStatus>('approved');
  const [allowance, setAllowance] = useState<bigint>();
  const checkApproveFunc = useRef<() => ReturnType<typeof fetchApproveStatus>>();
  useEffect(() => {
    checkApproveFunc.current = async () => {
      try {
        const { allowance: _allowance, approveStatus: status } = await fetchApproveStatus({
          tokenDecimals,
          amount,
          rpcUrl,
          account: account!,
          tokenAddress: tokenAddress!,
          contractAddress: contractAddress!,
        });
        startTransition(() => {
          setAllowance(_allowance);
          setApproveStatus(status);
        });
        return {
          allowance: _allowance,
          approveStatus: status,
        };
      } catch (err) {
        console.log('Check approve err', err);
        startTransition(() => {
          setAllowance(undefined);
          setApproveStatus('need-approve');
        });
        return {
          approveStatus: 'need-approve',
        };
      }
    };
  }, [account, amount, contractAddress, tokenAddress, tokenDecimals, rpcUrl, wait]);
  const fetchApproveStatusWithDebounce = useCallback(
    debounce(() => checkApproveFunc.current?.(), wait),
    [wait],
  );
  const fetcher = useCallback(async () => {
    if (!tokenAddress || !amount || !account || !contractAddress) return;
    setApproveStatus('checking-approve');
    fetchApproveStatusWithDebounce();
  }, [account, amount, contractAddress, tokenAddress, tokenDecimals, rpcUrl, wait, fetchApproveStatusWithDebounce]);
  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const refresh = useCallback(() => {
    if (!tokenAddress || !amount || !account || !contractAddress) return;
    setApproveStatus('checking-approve');
    return checkApproveFunc.current?.();
  }, [account, amount, contractAddress, tokenAddress]);
  return {
    allowance,
    approveStatus,
    refresh,
    setApproveStatus,
  };
}

export const useAuthERC20Token = ({
  account,
  tokenAddress,
  tokenDecimals = 18,
  amount,
  contractAddress,
  rpcUrl,
  wait,
}: {
  rpcUrl: string;
  account: string | null | undefined;
  contractAddress: string | null | undefined;
  tokenAddress: string | null | undefined;
  tokenDecimals?: number;
  amount: string;
  wait?: number;
}) => {
  const { allowance, approveStatus, setApproveStatus, refresh } = useApproveStatus({
    account,
    tokenAddress,
    tokenDecimals,
    amount,
    contractAddress,
    rpcUrl,
    wait,
  });

  const _handleApprove = useCallback(async () => {
    if (!tokenAddress || !contractAddress || !account) return;
    try {
      // check status before approve
      const { allowance: _allowance = BigInt(0), approveStatus: status } = (await refresh()) || {};
      if (!status || status === 'approved') {
        return;
      }
      setApproveStatus('approving');
      await handleApprove({
        type: Unit.greaterThan(_allowance, 0) ? 'increase-allowance' : 'approve',
        contractAddress,
        tokenAddress,
        amount: Unit.sub(Unit.fromStandardUnit(amount, tokenDecimals), _allowance).toDecimalMinUnit(),
        rpcUrl,
      });
      refresh();
    } catch (err) {
      setApproveStatus('need-approve');
      console.error('Handle approve err', err);
      throw err;
    }
  }, [tokenAddress, contractAddress, account, setApproveStatus, rpcUrl, amount, tokenDecimals, refresh]);

  return {
    allowance,
    approveStatus,
    refresh,
    handleApprove: _handleApprove,
  };
};
