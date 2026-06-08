import { useEffect } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {
  useFonts,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk'
import {
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/lib/AppContext'
import '../global.css'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    SpaceGrotesk_600SemiBold,
  })

  useEffect(() => { if (error) throw error }, [error])
  useEffect(() => { if (loaded) SplashScreen.hideAsync() }, [loaded])

  if (!loaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="store-rec" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        </Stack>
      </AppProvider>
    </QueryClientProvider>
  )
}
