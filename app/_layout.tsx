import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as Sentry from '@sentry/react-native'
import {
  SchibstedGrotesk_400Regular,
  SchibstedGrotesk_500Medium,
  SchibstedGrotesk_700Bold,
  SchibstedGrotesk_800ExtraBold,
} from '@expo-google-fonts/schibsted-grotesk'
import { useFonts } from 'expo-font'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider, useApp } from '@/lib/AppContext'
import { initI18n } from '@/lib/i18n'
import '../global.css'

Sentry.init({
  dsn: 'https://d196a193ba516a5ae948bc12d99a874c@o4511596738445312.ingest.de.sentry.io/4511596759941200',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0,
  sendDefaultPii: false,
  enabled: !__DEV__,
})

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

function RootNavigator() {
  const { phase } = useApp()
  const isApp = phase === 'app'
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isApp}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={isApp}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Screen name="store-rec" options={{ presentation: 'card', animation: 'slide_from_right' }} />
    </Stack>
  )
}

function AppInitializer() {
  const { initialized } = useApp()

  useEffect(() => {
    if (initialized) SplashScreen.hideAsync()
  }, [initialized])

  if (!initialized) return null
  return <RootNavigator />
}

function RootLayout() {
  const [loaded, error] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_700Bold,
    SchibstedGrotesk_800ExtraBold,
  })
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => { if (error) throw error }, [error])
  useEffect(() => { initI18n().then(() => setI18nReady(true)) }, [])

  if (!loaded || !i18nReady) return null

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppInitializer />
      </AppProvider>
    </QueryClientProvider>
  )
}

export default Sentry.wrap(RootLayout)
