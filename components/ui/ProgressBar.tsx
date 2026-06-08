import { View } from 'react-native'
import { Colors } from '@/constants/colors'

interface Props { pct: number; height?: number }

export function ProgressBar({ pct, height = 14 }: Props) {
  const w = Math.max(0, Math.min(100, pct))
  return (
    <View style={{ backgroundColor: Colors.greenSoft, borderRadius: 999, height, overflow: 'hidden' }}>
      <View style={{ width: `${w}%`, height: '100%', backgroundColor: Colors.green, borderRadius: 999 }} />
    </View>
  )
}
