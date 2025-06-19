/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import type { SessionTypes } from '@walletconnect/types';
import type { TransactionParameters, TypedSignParams, WalletProvider, WatchAssetParams, Status } from '../../AccountManage/types';
import { ChainPrefix, convertCipDataToEip, convertCipMethodToEip, convertEipDataToCip, formatChainId, parseNamespaceData } from '../../WalletConnectorHelper';
import icon from './icon';


const createWalletConnectProvider = ({
  projectId,
  targetChainId,
  metadata,
}: {
  projectId: string;
  targetChainId: Array<string> | string;
  metadata: NonNullable<Parameters<typeof SignClient.init>[0]>['metadata'];
}) => {
  const chains = Array.isArray(targetChainId) ? targetChainId.map((chainId) => formatChainId(chainId)) : [formatChainId(targetChainId)];

  const web3Modal = new WalletConnectModal({
    projectId,
    chains,
  });

  let signClient: SignClient;
  let session: ReturnType<SignClient['session']['getAll']>[number] | undefined;
  let accountChangeCallback: ((account: string | undefined) => void) | undefined = undefined;
  let chainIdChangeCallback: ((chainId: string | undefined) => void) | undefined = undefined;
  let statusChangeCallback: ((status: Status | undefined) => void) | undefined = undefined;
  let connectedAccounts: Array<{
    chainPrefix: string;
    chainId: string;
    address: string;
  }> = [];

  const getAccountsInfoFromSession = (_session: SessionTypes.Struct | undefined) => {
    if (!_session || (_session?.expiry && _session.expiry * 1000 - Date.now() < 0)) {
      return [];
    }
    connectedAccounts =
      Object.values(_session.namespaces)
        .flatMap((namespace) => namespace.accounts?.map(convertEipDataToCip).map(parseNamespaceData))
        .filter(({ chainId, chainPrefix }) => chains.includes(`${chainPrefix}:${chainId}`));

    return connectedAccounts;
  };

  const handleSessionUpdate = async (_session: SessionTypes.Struct | undefined) => {
    const accounts = getAccountsInfoFromSession(_session);
    const account = accounts?.[0];
    const { address, chainId } = account || {};
    if (address) {
      accountChangeCallback?.(address);
      statusChangeCallback?.('active');
      if (chainId) {
        chainIdChangeCallback?.(chainId);
      }
    } else {
      accountChangeCallback?.(undefined);
      chainIdChangeCallback?.(undefined);
      statusChangeCallback?.('not-active');

      const lastTopic = signClient.core.pairing.getPairings()?.at(-1);
      if (lastTopic) {
        signClient.core.pairing.disconnect({
          topic: lastTopic?.topic,
        });
      }
      if (session) {
        try {
          await signClient.disconnect({
            topic: session.topic,
            reason: {
              code: 6000,
              message: 'User disconnected'
            },
          });
        } catch (error) {
          console.error(error);
        } finally {
          session = undefined;
        }
      }
    }
  };

  (async () => {
    const client = await SignClient.init({
      projectId,
      metadata,
    });
    signClient = client;
    session = signClient.session.getAll()?.at(-1);
    const lastTopic = signClient.core.pairing.getPairings()?.at(-1);
    if (session) {
      handleSessionUpdate(session);
    }
    if (!session && lastTopic) {
      signClient.core.pairing.disconnect({
        topic: lastTopic?.topic,
      });
    }

    signClient.on('session_update', ({ topic }) => {
      handleSessionUpdate(signClient.session.get(topic));
    });

    signClient.on('session_delete', () => {
      handleSessionUpdate(undefined);
    });
  })();

  const getUsedAccountInfo = ({ targetNamespaceData, method }: { targetNamespaceData?: string; method: string }) => {
    const usedAccountInfo = targetNamespaceData ? parseNamespaceData(targetNamespaceData) : connectedAccounts[0];
    if (!usedAccountInfo.chainPrefix || !usedAccountInfo.chainId || !usedAccountInfo.address) {
      throw new Error(targetNamespaceData ? 'Invalid targetNamespaceData' : 'Invalid WalletConnect return data');
    }

    if (usedAccountInfo.chainPrefix === ChainPrefix.CIP) {
      return {
        chainId: convertCipDataToEip(`${usedAccountInfo.chainPrefix}:${usedAccountInfo.chainId}`),
        from: usedAccountInfo.address,
        method: convertCipMethodToEip(method),
      };
    }
    return {
      chainId: `${usedAccountInfo.chainPrefix}:${usedAccountInfo.chainId}`,
      from: usedAccountInfo.address,
      method,
    };
  };

  return {
    walletName: 'WalletConnect',
    walletIcon: icon,
    subAccountChange: (callback: (account: string | undefined) => void) => {
      accountChangeCallback = callback;
    },
    subChainIdChange: (callback: (chainId: string | undefined) => void) => {
      chainIdChangeCallback = callback;
    },
    subStatusChange: (callback: (status: Status | undefined) => void) => {
      statusChangeCallback = callback;
    },
    connect: async () => {
      let unsub: VoidFunction | null = () => { };
      try {
        if (session) return;
        statusChangeCallback?.('in-activating');
        const { uri, approval } = await signClient.connect({
          // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
          pairingTopic: signClient.core.pairing.getPairings()?.at(-1)?.topic,
          // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
          requiredNamespaces: {
            eip155: {
              methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData_v4', 'eth_signTypedData'],
              chains,
              events: ['chainChanged', 'accountsChanged'],
            },
          },
        });
        //如果返回URI，则打开QRCode模式(即我们没有连接现有的配对)。
        if (uri) {
          web3Modal.openModal({
            uri,
            standaloneChains: [`eip155:${targetChainId}`],
          });
          
          unsub = web3Modal.subscribeModal((evt) => {
            if (!evt.open) {
              statusChangeCallback?.('not-active');
              unsub?.();
            }
          });
        }

        // 等待钱包的会话批准。
        const newSession = await approval();
        
        if (newSession) {
          const parsedAccounts = getAccountsInfoFromSession(newSession);
          if (Array.isArray(parsedAccounts) && parsedAccounts.length === 0) {
            throw new Error('Unsupported chains.');
          }
          session = newSession;
          handleSessionUpdate(newSession);
        }
        // 处理返回的会话(例如，将UI更新为“connected”状态)。
        // await onSessionConnected(session);
      } catch (err) {
        console.log(err);
        statusChangeCallback?.('not-active');
        throw err;
      } finally {
        // 关闭QRCode模式，以防它是打开的。
        web3Modal.closeModal();
        unsub?.();
      }
    },
    sendTransaction: async (params: TransactionParameters, targetNamespaceData?: string): Promise<string> => {
      const { method, from, chainId } = getUsedAccountInfo({
        targetNamespaceData,
        method: 'eth_sendTransaction',
      });
      return signClient.request({
        topic: session!.topic,
        chainId,
        request: {
          method,
          params: [{ ...params, from }],
        },
      });
    },
    watchAsset: async (params: WatchAssetParams, targetNamespaceData?: string) => {
      const { method, from, chainId } = getUsedAccountInfo({
        targetNamespaceData,
        method: 'wallet_watchAsset',
      });
      return signClient.request({
        topic: session!.topic,
        chainId,
        request: {
          method,
          params: [{ ...params, from }],
        },
      });
    },
    typedSign: async (params: TypedSignParams, targetNamespaceData?: string): Promise<string> => {
      const { method, from, chainId } = getUsedAccountInfo({
        targetNamespaceData,
        method: 'eth_signTypedData',
      });
      return signClient.request({
        topic: session!.topic,
        chainId,
        request: {
          method,
          params: [from, JSON.stringify(params)],
        },
      });
    },
    personalSign: async (message: string, targetNamespaceData?: string): Promise<string> => {
      const { method, from, chainId } = getUsedAccountInfo({
        targetNamespaceData,
        method: 'personal_sign',
      });
      return signClient.request({
        topic: session!.topic,
        chainId,
        request: {
          method,
          params: [message, from],
        },
      });
    },
    getAccount: () => {
      if (!session) return undefined;
      return connectedAccounts?.[0]?.address;
    },
    getChainId: () => {
      if (!session) return undefined;
      return connectedAccounts?.[0]?.chainId;
    },
    getAccounts: () => {
      if (!session) return undefined;
      return connectedAccounts?.map((account) => account.address);
    },
    getChainIds: () => {
      if (!session) return undefined;
      return connectedAccounts?.map((account) => account.chainId);
    },
    getStatus: () => {
      if (!session) return 'not-active';
      return connectedAccounts?.[0]?.address ? 'active' : 'not-active';
    },
    getConnecteds: () => connectedAccounts,
    disconnect: () => handleSessionUpdate(undefined),
  } as WalletProvider;
};

export default createWalletConnectProvider;
