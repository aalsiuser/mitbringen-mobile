import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_700Bold,
    SchibstedGrotesk_800ExtraBold,
  })
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => { if (error) throw error }, [error])
  useEffect(() => { initI18n().then(() => setI18nReady(true)) }, [])
  useEffect(() => { if (loaded && i18nReady) SplashScreen.hideAsync() }, [loaded, i18nReady])

  if (!loaded || !i18nReady) return null

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </QueryClientProvider>
  )
}
