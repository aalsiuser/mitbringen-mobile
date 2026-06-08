import { Redirect } from 'expo-router'
import { useApp } from '@/lib/AppContext'
import { AuthScreen } from '@/components/screens/AuthScreen'
import { OnboardNameScreen } from '@/components/screens/OnboardNameScreen'
import { OnboardGoalScreen } from '@/components/screens/OnboardGoalScreen'

export default function Index() {
  const { phase } = useApp()

  if (phase === 'app') return <Redirect href="/(tabs)" />
  if (phase === 'auth') return <AuthScreen />
  if (phase === 'onboard-name') return <OnboardNameScreen />
  if (phase === 'onboard-goal') return <OnboardGoalScreen />
  return null
}
