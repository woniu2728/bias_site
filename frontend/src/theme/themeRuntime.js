import { normalizeThemeTokens } from './tokens.js'

let activeTheme = normalizeThemeTokens()

export function getActiveTheme() {
  return { ...activeTheme }
}

export function applyTheme(theme = {}, { target = document.documentElement } = {}) {
  const nextTheme = normalizeThemeTokens(theme)
  if (!target) {
    activeTheme = nextTheme
    return getActiveTheme()
  }

  if (activeTheme.className && activeTheme.className !== nextTheme.className) {
    target.classList.remove(activeTheme.className)
  }
  target.classList.add(nextTheme.className)
  target.dataset.biasTheme = nextTheme.id
  target.style.colorScheme = nextTheme.colorScheme

  activeTheme = nextTheme
  return getActiveTheme()
}

export async function loadThemeManifest({ api } = {}) {
  if (!api || typeof api.get !== 'function') {
    return getActiveTheme()
  }
  try {
    const response = await api.get('/forum/theme')
    return applyTheme(response?.data?.theme || response?.data || {})
  } catch (_error) {
    return applyTheme(activeTheme)
  }
}

export function bootstrapThemeRuntime(options = {}) {
  return loadThemeManifest(options)
}
