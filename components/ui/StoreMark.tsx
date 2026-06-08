import { View, Text } from 'react-native'
import type { Store } from '@/lib/types'

interface Props { store: Store; size?: number; radius?: number }

export function StoreMark({ store, size = 40, radius = 12 }: Props) {
  return (
    <View style={{
      width: size, height: size, borderRadius: radius,
      backgroundColor: store.color, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.4 }}>{store.name[0]}</Text>
    </View>
  )
}
