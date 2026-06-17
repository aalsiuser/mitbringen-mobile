import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Circle } from 'react-native-svg'

type Variant = 'color' | 'mono-blue' | 'mono-white'

function MarkSvg({ size, variant = 'color' }: { size: number; variant?: Variant }) {
  const isColor = variant === 'color'
  const isMonoWhite = variant === 'mono-white'

  const leaf    = isColor ? '#c4ec5a' : isMonoWhite ? '#ffffff' : '#2461ff'
  const basket  = isColor ? '#ffffff' : isMonoWhite ? '#ffffff' : '#2461ff'
  const handle  = isColor ? '#ffffff' : isMonoWhite ? '#ffffff' : '#2461ff'
  const badge   = isColor ? '#2fc46f' : isMonoWhite ? '#ffffff' : '#2461ff'
  const tick    = isColor ? '#ffffff' : isMonoWhite ? '#16202e' : '#ffffff'
  const leafOp  = isColor ? 1 : 0.55

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size} fill="none">
      <Path d="M58 44C52 41 49 34 51 27c5 3 9 10 9 17" fill={leaf} opacity={leafOp} />
      <Path d="M35 44a15 12 0 0 1 30 0" stroke={handle} strokeWidth={5} strokeLinecap="round" />
      <Path d="M23 44h54l-5.4 36A6 6 0 0 1 65.7 85H34.3A6 6 0 0 1 28.4 80L23 44Z" fill={basket} />
      <Circle cx={64} cy={74} r={13} fill={badge} />
      <Path d="M58 74l4 4 8-8.5" stroke={tick} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function MitbringenTile({ size = 44 }: { size?: number }) {
  const radius = Math.round(size * 0.24)
  const markSize = Math.round(size * 0.64)

  return (
    <LinearGradient
      colors={['#2f6bff', '#1748d8']}
      start={{ x: 0.12, y: 0 }}
      end={{ x: 0.88, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1748d8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.32,
        shadowRadius: 18,
        elevation: 8,
      }}
    >
      <MarkSvg size={markSize} variant="color" />
    </LinearGradient>
  )
}

interface WordmarkProps {
  size?: number
  theme?: 'light' | 'dark'
}

export function MitbringenWordmark({ size = 17, theme = 'light' }: WordmarkProps) {
  const tileSize = Math.round(size * 2.1)
  const gap = Math.round(tileSize * 0.3)
  const mitColor   = theme === 'dark' ? '#ffffff' : '#0d1220'
  const bringColor = theme === 'dark' ? '#7aa0ff' : '#2461ff'

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
      <MitbringenTile size={tileSize} />
      <Text
        style={{
          fontSize: size,
          fontFamily: 'SchibstedGrotesk_800ExtraBold',
          letterSpacing: -0.045 * size,
          lineHeight: size * 1.15,
        }}
      >
        <Text style={{ color: mitColor }}>mit</Text>
        <Text style={{ color: bringColor }}>bringen</Text>
      </Text>
    </View>
  )
}
