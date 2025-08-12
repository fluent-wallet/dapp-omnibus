import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';

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
  external: ['react', 'react-dom']
});
