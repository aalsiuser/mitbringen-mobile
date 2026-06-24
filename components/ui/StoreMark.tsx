import { View, Text } from 'react-native'
import type { Store } from '@/lib/types'

interface Props { store: Store; size?: number; radius?: number }

export function StoreMark({ store, size = 40, radius = 12 }: Props) {
  return (
    <View style={{
      width: size, height: size, borderRadius: radius,
      backgroundColor: store.color, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 4,
    }}>
      <Text
        style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.22, letterSpacing: -0.3 }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {store.name}
      </Text>
    </View>
  )
}
