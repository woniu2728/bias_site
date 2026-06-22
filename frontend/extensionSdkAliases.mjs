import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const frontendRoot = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(frontendRoot, '..')

const browserCoreAliases = [
  ['@bias/core', 'src/common/sdk.js'],
  ['@bias/admin', 'src/admin/sdk.js'],
  ['@bias/forum', 'src/forum/sdk.js'],
]

export function createViteSdkAliases() {
  return Object.fromEntries(browserCoreAliases.map(([alias, target]) => [alias, resolve(frontendRoot, target)]))
}
