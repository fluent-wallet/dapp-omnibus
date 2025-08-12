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

export default defineConfig({
  entry: allUtilsEntry,
  format: 'esm',
  noExternal: ['@cfx-kit/utils', 'ky', 'abitype', 'mersenne-twister', 'jsbi'],
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
