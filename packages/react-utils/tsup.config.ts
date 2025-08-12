import { defineConfig } from 'tsup';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

export const allUtilsEntry = readdirSync('./src').reduce(
  (allUtils, util) => {
    try {
      if (statSync(`./src/${util}`).isDirectory() && statSync(`./src/${util}/index.ts`).isFile()) {
        allUtils[util] = `src/${util}/index.ts`;
      }
    } catch (_) {
      /* empty */
    }
    return allUtils;
  },
  {} as Record<string, string>,
);

const accountPluginsEntry = (() => {
  const entries: Record<string, string> = {};
  
  const walletPlugins = [
    'use-wallet/Ethereum',
    'use-wallet/MetaMask', 
    'use-wallet/Coinbase',
    'use-wallet/Fluent-Ethereum',
    'use-wallet/Fluent-Conflux',
    'use-wallet/Halo',
    'use-wallet/OKX',
    'use-wallet/TokenPocket'
  ];
  
  walletPlugins.forEach(plugin => {
    const pluginName = plugin.split('/')[1];
    entries[`AccountManagePlugins/${pluginName}`] = `src/AccountManagePlugins/${plugin}.ts`;
  });
  
  // 添加其他插件
  entries['AccountManagePlugins/6963Wallet'] = 'src/AccountManagePlugins/6963Wallet/index.ts';
  entries['AccountManagePlugins/wallet-connect'] = 'src/AccountManagePlugins/wallet-connect/index.ts';
  
  return entries;
})();

export default defineConfig({
  entry: {
    ...allUtilsEntry,
    ...accountPluginsEntry,
  },
  format: 'esm',
  target: 'es2022',
  noExternal: ['@cfx-kit/utils', '@cfx-kit/dapp-utils'],
  treeshake: true,
  external: ['@cfxjs/use-wallet-react'],
  onSuccess: async () => {
    const pkgPath = resolve('./dist/package.json');
    const originalPkgPath = resolve('./package.json');
    const originalPkg = JSON.parse(readFileSync(originalPkgPath, 'utf-8'));
    
    const exports = {
      ".": {
        "types": "./index.d.ts",
        "import": "./index.js"
      },
      "./*": {
        "types": "./*.d.ts",
        "import": "./*.js"
      }
    };
    
    const distPkg = {
      ...originalPkg,
      exports
    };
    
    writeFileSync(pkgPath, JSON.stringify(distPkg, null, 2));
  }
});
