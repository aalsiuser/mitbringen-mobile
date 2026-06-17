import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Svg, { Path, Rect, Circle } from 'react-native-svg'
import { Colors, Shadows } from '@/constants/colors'

function ChatIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </Svg>
  )
}
function XIcon({ color, size = 17 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 6 18 18M18 6 6 18" />
    </Svg>
  )
}
function LockIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  )
}
function BellIcon({ color, size = 19 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Svg>
  )
}
function CheckIcon({ color, size = 19 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5 10 17l9-10" />
    </Svg>
  )
}
function SearchIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="7" />
      <Path d="m20 20-3.2-3.2" />
    </Svg>
  )
}
function SparkIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18" />
    </Svg>
  )
}
function TargetIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="8" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export default function AssistantTab() {
  const { t } = useTranslation()
  const [notified, setNotified] = useState(false)
  const router = useRouter()

  const capabilities = [
    { Icon: SearchIcon, title: t('assistant.capFindTitle'),  desc: t('assistant.capFindDesc') },
    { Icon: SparkIcon,  title: t('assistant.capSwapTitle'),  desc: t('assistant.capSwapDesc') },
    { Icon: TargetIcon, title: t('assistant.capTasteTitle'), desc: t('assistant.capTasteDesc') },
  ]

  return (
    <SafeAreaView edges={['top']} style={s.root}>
      {/* Grabber pill */}
      <View style={s.grabberWrap}>
        <View style={s.grabber} />
      </View>

      {/* Header */}
      <View style={s.header}>
        <View style={s.iconTile}>
          <ChatIcon color={Colors.green} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={s.titleRow}>
            <Text style={s.title}>{t('assistant.title')}</Text>
            <View style={s.comingSoonPill}>
              <Text style={s.comingSoonText}>{t('assistant.comingSoon')}</Text>
            </View>
          </View>
          <Text style={s.subtitle}>{t('assistant.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={s.closeBtn}
          onPress={() => router.navigate('/(tabs)')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <XIcon color={Colors.ink2} size={17} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Teaser chat */}
        <View style={s.chat}>
          {/* User bubble — right aligned */}
          <View style={s.userBubbleRow}>
            <View style={s.userBubble}>
              <Text style={s.userBubbleText}>{t('assistant.exampleQuestion')}</Text>
            </View>
          </View>

          {/* Assistant reply — blurred / locked */}
          <View style={s.replyRow}>
            <View style={s.replyOuter}>
              <View style={s.replyBubble}>
                <Text style={s.replyText}>
                  {t('assistant.exampleAnswer')}
                </Text>
              </View>
              {/* White fog overlay simulating blur */}
              <View style={s.blurOverlay} />
              {/* Unlocks soon pill */}
              <View style={s.unlocksPill}>
                <LockIcon color="#fff" size={13} />
                <Text style={s.unlocksPillText}>{t('assistant.unlocksSoon')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Capability cards */}
        <View style={s.caps}>
          {capabilities.map(({ Icon, title, desc }) => (
            <View key={title} style={s.capCard}>
              <View style={s.capIcon}>
                <Icon color={Colors.green} size={18} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.capTitle}>{title}</Text>
                <Text style={s.capDesc} numberOfLines={1}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Notify CTA */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.cta, notified && s.ctaNotified]}
          onPress={() => { if (!notified) setNotified(true) }}
          activeOpacity={notified ? 1 : 0.85}
        >
          {notified
            ? <CheckIcon color={Colors.green} size={19} />
            : <BellIcon color="#fff" size={19} />}
          <Text style={[s.ctaText, notified && s.ctaTextNotified]}>
            {notified ? t('assistant.ctaNotified') : t('assistant.ctaNotify')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  grabberWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  grabber: { width: 36, height: 4, borderRadius: 999, backgroundColor: Colors.line2 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: Colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4, color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold' },
  comingSoonPill: {
    backgroundColor: Colors.amberSoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  comingSoonText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.06 * 10.5,
    color: Colors.amber,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  subtitle: { fontSize: 13.5, color: Colors.ink2, fontWeight: '500', marginTop: 2, fontFamily: 'SchibstedGrotesk_400Regular' },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.inset,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 12 },

  // Chat teaser
  chat: { marginBottom: 18 },
  userBubbleRow: { alignItems: 'flex-end', marginBottom: 12 },
  userBubble: {
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '82%',
  },
  userBubbleText: { color: '#fff', fontSize: 14.5, fontWeight: '500', lineHeight: 21, fontFamily: 'SchibstedGrotesk_400Regular' },

  replyRow: { alignItems: 'flex-start' },
  replyOuter: { maxWidth: '86%', position: 'relative' },
  replyBubble: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    ...Shadows.card,
  },
  replyText: { fontSize: 14.5, color: Colors.ink2, lineHeight: 22, fontFamily: 'SchibstedGrotesk_400Regular' },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  unlocksPill: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  unlocksPillText: { color: '#fff', fontSize: 12.5, fontWeight: '700', fontFamily: 'SchibstedGrotesk_700Bold' },

  // Capability cards
  caps: { gap: 9 },
  capCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    ...Shadows.card,
  },
  capIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Colors.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  capTitle: { fontSize: 15, fontWeight: '700', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  capDesc: { fontSize: 12.5, color: Colors.ink3, marginTop: 1, fontFamily: 'SchibstedGrotesk_400Regular' },

  // Notify CTA
  footer: { paddingHorizontal: 18, paddingBottom: 20, paddingTop: 12 },
  cta: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaNotified: {
    backgroundColor: Colors.greenSoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },
  ctaTextNotified: { color: Colors.green },
})
