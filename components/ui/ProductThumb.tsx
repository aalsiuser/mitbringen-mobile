import { Text, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { PRODUCT_ICONS, FALLBACK_ICON } from '@/lib/productIcons'

export function ProductThumb({
  imageFile,
  name,
  size = 40,
}: {
  imageFile: string | null
  name: string
  size?: number
}) {
  const xml = (imageFile && PRODUCT_ICONS[imageFile]) || PRODUCT_ICONS[FALLBACK_ICON]

  if (!xml) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: '#eef1f6',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontWeight: '700', color: '#586172', fontSize: size * 0.42 }}>
          {name?.[0]?.toUpperCase() ?? '·'}
        </Text>
      </View>
    )
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f4f6fa',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  )
}
