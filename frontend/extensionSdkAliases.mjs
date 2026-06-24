import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const frontendRoot = dirname(fileURLToPath(import.meta.url))

const browserCoreAliases = [
  ['@bias/core', 'src/common/sdk.js'],
  ['@bias/admin/components', 'src/admin/componentsSdk.js'],
  ['@bias/admin', 'src/admin/sdk.js'],
  ['@bias/forum', 'src/forum/sdk.js'],
]

const nodeCoreAliases = [
  ['@bias/core', 'src/common/sdk.js'],
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
    } else {
      results.push(['@bias/' + extId, resolve(frontendRoot, 'src/forum/sdk.js')])
    }
  }
  return results
}

const extensionSdks = discoverExtensionSdks()

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
    ...extensionSdks,
  ]
}
