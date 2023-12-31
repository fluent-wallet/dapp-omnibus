import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';

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

export default defineConfig({
  entry: allUtilsEntry,
  format: 'esm',
  target: 'es2022',
  noExternal: ['@cfx-kit/utils', '@cfx-kit/dapp-utils'],
});
