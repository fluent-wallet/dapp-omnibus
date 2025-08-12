const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['dapp-components', 'ui-components', 'utils', 'dapp-utils', 'react-utils'];

// 添加 exports 字段
packages.forEach(pkg => {
  const pkgPath = path.join('packages', pkg, 'package.json');
  const distPkgPath = path.join('packages', pkg, 'dist', 'package.json');
  
  if (fs.existsSync(distPkgPath)) {
    // 读取根目录的 package.json
    const rootPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    // 读取 dist 中的 package.json（带 exports）
    const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf-8'));
    
    // 如果 dist 中有 exports，则添加到根目录的 package.json
    if (distPkg.exports && !rootPkg.exports) {
      const exports = {};
      Object.keys(distPkg.exports).forEach(key => {
        exports[key] = {};
        if (distPkg.exports[key].import) {
          exports[key].import = `./dist/${distPkg.exports[key].import.replace('./', '')}`;
        }
        if (distPkg.exports[key].types) {
          exports[key].types = `./dist/${distPkg.exports[key].types.replace('./', '')}`;
        }
      });
      
      // 添加对 /dist/ 路径的向后兼容支持
      exports["./dist/*"] = {
        "types": "./dist/*.d.ts",
        "import": "./dist/*.js"
      };
      
      rootPkg.exports = exports;
      fs.writeFileSync(pkgPath, JSON.stringify(rootPkg, null, 2));
    }
  }
});

try {
  // 执行发布
  execSync('changeset publish --registry=https://registry.npmjs.com/', { stdio: 'inherit' });
} finally {
  // 删除 exports 字段
  packages.forEach(pkg => {
    const pkgPath = path.join('packages', pkg, 'package.json');
    
    if (fs.existsSync(pkgPath)) {
      const rootPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (rootPkg.exports) {
        delete rootPkg.exports;
        fs.writeFileSync(pkgPath, JSON.stringify(rootPkg, null, 2));
      }
    }
  });
}
