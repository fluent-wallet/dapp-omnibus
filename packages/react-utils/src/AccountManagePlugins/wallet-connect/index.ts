/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
import { type SessionTypes } from '@walletconnect/types';
import { TransactionParameters, WatchAssetParams, TypedSignParams, WalletProvider } from '../../AccountManage/types';

const createWalletConnectProvider = ({ projectId, targetChainId }: { projectId: string; targetChainId: string }) => {
  const web3Modal = new Web3Modal({
    walletConnectVersion: 2,
    projectId,
    standaloneChains: [`eip155:${targetChainId}`],
  });

  let signClient: SignClient;
  let session: ReturnType<SignClient['session']['getAll']>[number] | undefined;
  let accountChangeCallback: ((account: string | undefined) => void) | undefined = undefined;
  let chainIdChangeCallback: ((chainId: string | undefined) => void) | undefined = undefined;

  const getAccountAndChainIdFromSession = (_session: SessionTypes.Struct | undefined) => {
    if (!_session || (_session?.expiry && _session.expiry * 1000 - Date.now() < 0)) {
      return {
        account: undefined,
        chainId: undefined,
      };
    }
    const allNamespaceAccounts = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat();
    const allNamespaceChainIds = Object.values(_session.namespaces)
      .map((namespace) => namespace.chains)
      .flat();
    const _account = allNamespaceAccounts?.[0];
    const _chainId = allNamespaceChainIds?.[0];
    let account: string | undefined;
    let chainId: string | undefined;
    if (!_account || !_account.startsWith(`eip155:${targetChainId}:`)) {
      account = undefined;
    } else {
      account = _account.split(`eip155:${targetChainId}:`)?.[1];
    }
    if (!_chainId || !_chainId.startsWith('eip155:')) {
      chainId = undefined;
    } else {
      chainId = _chainId.split('eip155:')?.[1];
    }

    return {
      account,
      chainId,
    };
  };

  const handleSessionUpdate = async (_session: SessionTypes.Struct | undefined) => {
    const { account, chainId } = getAccountAndChainIdFromSession(_session);
    if (account) {
      accountChangeCallback?.(account);
      if (chainId) {
        chainIdChangeCallback?.(chainId);
      }
    } else {
      accountChangeCallback?.(undefined);
      chainIdChangeCallback?.(undefined);

      const lastTopic = signClient.core.pairing.getPairings()?.at(-1);
      if (lastTopic) {
        signClient.core.pairing.disconnect({
          topic: lastTopic?.topic,
        });
      }
      if (session) {
        await signClient.disconnect({
          topic: session?.topic,
          reason: {
            code: 12,
            message: 'disconnect',
          },
        });
        session = undefined;
      }
    }
  };

  (async function () {
    const client = await SignClient.init({
      projectId,
      metadata: {
        name: 'Goledo',
        description: 'Goledo is a lending and borrowing market built on Conflux eSpace. Lend your assets to begin earning and use them to collateralize loans.',
        url: window.location.host,
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
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

  return {
    walletName: 'WalletConnect',
    subAccountChange: (callback: (account: string | undefined) => void) => {
      accountChangeCallback = callback;
    },
    subChainIdChange: (callback: (chainId: string | undefined) => void) => {
      chainIdChangeCallback = callback;
    },
    connect: async () => {
      try {
        if (session) return;
        const { uri, approval } = await signClient.connect({
          // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
          pairingTopic: signClient.core.pairing.getPairings()?.at(-1)?.topic,
          // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
          requiredNamespaces: {
            eip155: {
              methods: ['eth_sendTransaction'],
              chains: [`eip155:${targetChainId}`],
              events: ['chainChanged', 'accountsChanged'],
            },
          },
        });
        //如果返回URI，则打开QRCode模式(即我们没有连接现有的配对)。
        if (uri) {
          web3Modal.openModal({ uri, standaloneChains: [`eip155:${targetChainId}`] });
        }

        // 等待钱包的会话批准。
        const newSession = await approval();
        if (newSession) {
          session = newSession;
          handleSessionUpdate(newSession);
        }
        // 处理返回的会话(例如，将UI更新为“connected”状态)。
        // await onSessionConnected(session);
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        // 关闭QRCode模式，以防它是打开的。
        web3Modal.closeModal();
      }
    },
    sendTransaction: async (params: TransactionParameters): Promise<string> => {
      return signClient.request({
        topic: session!.topic,
        chainId: `eip155:${targetChainId}`,
        request: {
          method: 'eth_sendTransaction',
          params: [params],
        },
      });
    },
    watchAsset: async (params: WatchAssetParams) => {
      return signClient.request({
        topic: session!.topic,
        chainId: `eip155:${targetChainId}`,
        request: {
          method: 'wallet_watchAsset',
          params: [params],
        },
      });
    },
    typedSign: async (params: TypedSignParams): Promise<string> => {
      const { account } = getAccountAndChainIdFromSession(session);
      return signClient.request({
        topic: session!.topic,
        chainId: `eip155:${targetChainId}`,
        request: {
          method: 'eth_signTypedData_v4',
          params: [account, JSON.stringify(params)],
        },
      });
    },
    getAccount: () => {
      if (!session) return undefined;
      const { account } = getAccountAndChainIdFromSession(session);
      return account;
    },
    getChainId: () => {
      if (!session) return undefined;
      const { chainId } = getAccountAndChainIdFromSession(session);
      return chainId;
    },
  } as WalletProvider;
};

export default createWalletConnectProvider;
