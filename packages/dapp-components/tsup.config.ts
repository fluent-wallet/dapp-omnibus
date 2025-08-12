import { defineConfig } from 'tsup';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

export const allComponentsEntry = readdirSync('./src').reduce(
  (allComponents, component) => {
    try {
      if (statSync(`./src/${component}`).isDirectory() && statSync(`./src/${component}/index.tsx`).isFile()) {
        allComponents[component] = `src/${component}/index.tsx`;
      }
    } catch (_) {
      /* empty */
    }
    return allComponents;
  },
  {} as Record<string, string>,
);

export default defineConfig({
  entry: allComponentsEntry,
  format: 'esm',
  noExternal: ['@cfx-kit/utils', '@cfx-kit/dapp-utils'],
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
