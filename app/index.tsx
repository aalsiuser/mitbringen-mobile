import { useApp } from '@/lib/AppContext'
import { AuthScreen } from '@/components/screens/AuthScreen'
import { OnboardCityScreen } from '@/components/screens/OnboardCityScreen'
import { OnboardNameScreen } from '@/components/screens/OnboardNameScreen'
import { OnboardGoalScreen } from '@/components/screens/OnboardGoalScreen'

export default function Index() {
  const { phase } = useApp()
  if (phase === 'onboard-city') return <OnboardCityScreen />
  if (phase === 'onboard-name') return <OnboardNameScreen />
  if (phase === 'onboard-goal') return <OnboardGoalScreen />
  return <AuthScreen />
}
