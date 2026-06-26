import { writeFileSync } from 'node:fs'
import { createJsconfigSdkPaths } from '../extensionSdkAliases.mjs'

// Generate jsconfig.json with SDK alias paths for IDE support
const jsconfig = {
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@bias/core': ['./src/common/sdk.js'],
      '@bias/core/common': ['./src/common/sdk.js'],
      '@bias/core/forum': ['./src/forum/sdk.js'],
      '@bias/core/admin': ['./src/admin/sdk.js'],
      '@bias/core/components/admin': ['./src/admin/componentsSdk.js'],
      '@bias/forum': ['./src/forum/sdk.js'],
      '@bias/admin': ['./src/admin/sdk.js'],
      ...createJsconfigSdkPaths(),
      '@/*': ['./src/*'],
    },
  },
  exclude: ['node_modules', 'dist'],
}

writeFileSync(
  new URL('../jsconfig.json', import.meta.url),
  JSON.stringify(jsconfig, null, 2) + '\n',
)
