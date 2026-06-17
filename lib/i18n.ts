import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import * as SecureStore from 'expo-secure-store'

import en from '@/locales/en.json'
import de from '@/locales/de.json'

export type SupportedLang = 'en' | 'de'
export const SUPPORTED_LANGS: SupportedLang[] = ['en', 'de']

const LANG_KEY = 'mb-lang'

function detectDeviceLang(): SupportedLang {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase() ?? 'en'
  return code === 'de' ? 'de' : 'en'
}

export async function getSavedLang(): Promise<SupportedLang | null> {
  try {
    const v = await SecureStore.getItemAsync(LANG_KEY)
    if (v === 'en' || v === 'de') return v
  } catch {}
  return null
}

export async function setAppLang(lang: SupportedLang) {
  await i18n.changeLanguage(lang)
  try { await SecureStore.setItemAsync(LANG_KEY, lang) } catch {}
}

let initPromise: Promise<void> | null = null

export function initI18n() {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const saved = await getSavedLang()
    const lang = saved ?? detectDeviceLang()
    await i18n
      .use(initReactI18next)
      .init({
        resources: { en: { translation: en }, de: { translation: de } },
        lng: lang,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        compatibilityJSON: 'v4',
        returnNull: false,
      })
  })()
  return initPromise
}

/** Locale-aware currency formatting. Falls back to € + comma/dot decimal. */
export function fmtCurrency(n: number | null | undefined): string {
  if (n == null) return '—'
  const lang = (i18n.language?.startsWith('de') ? 'de-AT' : 'en-IE')
  try {
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(n)
  } catch {
    const sep = lang.startsWith('de') ? ',' : '.'
    return '€' + n.toFixed(2).replace('.', sep)
  }
}

/** Decimal separator for the active language: ',' for de, '.' for en. */
export function decimalSep(): string {
  return i18n.language?.startsWith('de') ? ',' : '.'
}

/** Localized month name for "now". */
export function currentMonthName(): string {
  const locale = i18n.language?.startsWith('de') ? 'de-AT' : 'en-IE'
  return new Date().toLocaleString(locale, { month: 'long' })
}

export default i18n
