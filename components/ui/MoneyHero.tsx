import { View, Text } from 'react-native'
import { useTween } from '@/hooks/useTween'
import { Colors } from '@/constants/colors'

interface Props { value: number; size?: number; color?: string }

export function MoneyHero({ value, size = 76, color = Colors.green }: Props) {
  const v = useTween(value)
  const safe = Math.max(0, v)
  const int = Math.floor(safe)
  const dec = Math.round((safe - int) * 100).toString().padStart(2, '0')

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Text style={{ fontSize: size * 0.42, marginTop: size * 0.1, marginRight: 2, color, fontFamily: 'SpaceGrotesk_600SemiBold', fontVariant: ['tabular-nums'] }}>€</Text>
      <Text style={{ fontSize: size, color, fontFamily: 'SpaceGrotesk_600SemiBold', letterSpacing: -2, lineHeight: size * 0.96, fontVariant: ['tabular-nums'] }}>{int}</Text>
      <Text style={{ fontSize: size * 0.42, marginTop: size * 0.1, color, fontFamily: 'SpaceGrotesk_600SemiBold', fontVariant: ['tabular-nums'] }}>,{dec}</Text>
    </View>
  )
}
