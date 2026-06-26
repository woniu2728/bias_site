import { existsSync, readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const frontendRoot = dirname(fileURLToPath(import.meta.url))

const browserCoreAliases = [
  ['@bias/core', 'src/common/sdk.js'],
  ['@bias/core/common', 'src/common/sdk.js'],
  ['@bias/core/forum', 'src/forum/sdk.js'],
  ['@bias/core/admin', 'src/admin/sdk.js'],
  ['@bias/core/components/admin', 'src/admin/componentsSdk.js'],
  ['@bias/admin/components', 'src/admin/componentsSdk.js'],
  ['@bias/admin', 'src/admin/sdk.js'],
  ['@bias/forum', 'src/forum/sdk.js'],
]

const nodeCoreAliases = [
  ['@bias/core', 'src/common/sdk.js'],
  ['@bias/core/common', 'src/common/sdk.js'],
  ['@bias/core/forum', 'src/forum/nodeSdk.js'],
  ['@bias/core/admin', 'src/admin/sdk.js'],
  ['@bias/core/components/admin', 'src/admin/nodeComponentsSdk.js'],
  ['@bias/admin/components', 'src/admin/nodeComponentsSdk.js'],
  ['@bias/admin', 'src/admin/sdk.js'],
  ['@bias/forum', 'src/forum/nodeSdk.js'],
]

function discoverExtensionSdks() {
  const results = []
  // frontendRoot = <workspace>/bias_site/frontend
  // workspace = <workspace>
  const workspace = resolve(frontendRoot, '..', '..')
  if (!existsSync(workspace)) return results

  const entries = readdirSync(workspace, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const m = entry.name.match(/^bias-ext-(.+)$/)
    if (!m) continue
    const extId = m[1]
    const sdkPath = resolve(workspace, entry.name, 'frontend', 'forum', 'sdk.js')
    if (existsSync(sdkPath)) {
      results.push(['@bias/' + extId, sdkPath])
    }
  }
  return results
}

const extensionSdks = discoverExtensionSdks()

export function discoverExtensionSdkAliases() {
  return extensionSdks.slice()
}

export function createViteSdkAliases() {
  return Object.fromEntries(createBrowserSdkAliasEntries())
}

export function createBrowserSdkAliasEntries() {
  return [
    ...browserCoreAliases.map(([alias, target]) => [alias, resolve(frontendRoot, target)]),
    ...extensionSdks,
  ]
}

export function createNodeSdkAliasEntries() {
  return [
    ...nodeCoreAliases.map(([alias, target]) => [alias, resolve(frontendRoot, target)]),
    ...extensionSdks.map(([alias, target]) => {
      const nodeTarget = resolve(dirname(target), 'nodeSdk.js')
      return [alias, existsSync(nodeTarget) ? nodeTarget : target]
    }),
  ]
}

export function createNodeSdkAliasMap() {
  return new Map(createNodeSdkAliasEntries())
}

export function createJsconfigSdkPaths() {
  const paths = {}
  for (const [alias, target] of extensionSdks) {
    const extensionRoot = dirname(dirname(dirname(target)))
    const extensionDir = basename(extensionRoot)
    paths[alias] = [`../../${extensionDir}/frontend/forum/sdk.js`]
  }
  return paths
}
