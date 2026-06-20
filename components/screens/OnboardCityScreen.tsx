import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import Svg, { Path, Circle } from 'react-native-svg'
import { Colors, Shadows } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { MitbringenWordmark } from '@/components/ui/MitbringenMark'

type City = { id: string; name: string; sub: string; live: boolean }

const CITIES: City[] = [
  { id: 'wien',      name: 'Wien',      sub: 'Vienna · all 23 districts', live: true },
  { id: 'graz',      name: 'Graz',      sub: 'Styria',                    live: false },
  { id: 'linz',      name: 'Linz',      sub: 'Upper Austria',             live: false },
  { id: 'salzburg',  name: 'Salzburg',  sub: 'Salzburg',                  live: false },
  { id: 'innsbruck', name: 'Innsbruck', sub: 'Tyrol',                     live: false },
]

function PinIcon({ size = 20, color = Colors.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <Circle cx="12" cy="10" r="2.5" />
    </Svg>
  )
}

function CheckIcon({ size = 19, color = Colors.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5 10 17l9-10" />
    </Svg>
  )
}

function ChevronDownIcon({ size = 20, color = Colors.ink3, rotated = false }: { size?: number; color?: string; rotated?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: [{ rotate: rotated ? '180deg' : '0deg' }] }}>
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

function ArrowIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 5l7 7-7 7" />
    </Svg>
  )
}

export function OnboardCityScreen() {
  const { saveCity } = useApp()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [cityId, setCityId] = useState('wien')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const picked = CITIES.find((c) => c.id === cityId) ?? CITIES[0]

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      await saveCity(picked.id)
    } catch {
      setError(t('common.errorGeneric'))
      setLoading(false)
    }
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <MitbringenWordmark size={17} />

        <View style={{ marginTop: 36 }}>
          <View style={s.eyebrowPill}>
            <PinIcon size={14} color={Colors.blue} />
            <Text style={s.eyebrowText}>{t('onboard.cityStep')}</Text>
          </View>
          <Text style={s.headline}>{t('onboard.cityHeadline')}</Text>
          <Text style={s.sub}>{t('onboard.citySub')}</Text>
        </View>

        {/* Dropdown */}
        <View style={{ marginTop: 28 }}>
          <Text style={s.fieldLabel}>{t('onboard.cityLabel')}</Text>

          <View style={{ position: 'relative', marginTop: 8 }}>
            {open && (
              <View style={s.dropdownPanel}>
                {CITIES.map((c, i) => {
                  const active = c.id === cityId
                  return (
                    <TouchableOpacity
                      key={c.id}
                      disabled={!c.live}
                      onPress={() => {
                        if (c.live) {
                          setCityId(c.id)
                          setOpen(false)
                        }
                      }}
                      activeOpacity={c.live ? 0.7 : 1}
                      style={[
                        s.dropdownItem,
                        i > 0 && s.dropdownItemBorder,
                        active && s.dropdownItemActive,
                        !c.live && { opacity: 0.5 },
                      ]}
                    >
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={s.dropdownItemName}>{c.name}</Text>
                        <Text style={s.dropdownItemSub}>{c.sub}</Text>
                      </View>
                      {c.live ? (
                        active ? <CheckIcon size={19} color={Colors.blue} /> : null
                      ) : (
                        <View style={s.soonPill}>
                          <Text style={s.soonText}>{t('onboard.citySoon')}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}

            <TouchableOpacity
              onPress={() => setOpen((o) => !o)}
              activeOpacity={0.85}
              style={[s.dropdownButton, open && s.dropdownButtonActive]}
            >
              <View style={s.dropdownIconTile}>
                <PinIcon size={20} color={Colors.blue} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.dropdownButtonName}>{picked.name}</Text>
                <Text style={s.dropdownButtonSub} numberOfLines={1}>{picked.sub}</Text>
              </View>
              <ChevronDownIcon size={20} color={Colors.ink3} rotated={open} />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.cta} onPress={submit} activeOpacity={0.85} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <>
                <Text style={s.ctaText}>{t('onboard.ctaContinue')}</Text>
                <ArrowIcon size={20} color="#fff" />
              </>}
        </TouchableOpacity>
        <Text style={s.footerNote}>{t('onboard.cityRollout')}</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 40, paddingBottom: 32 },

  eyebrowPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.blueSoft,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  eyebrowText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.blue,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 33,
    color: Colors.ink,
    marginTop: 14,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  sub: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.ink2,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 300,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },

  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.ink3,
    letterSpacing: 0.3,
    marginLeft: 2,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },

  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.line2,
    ...Shadows.card,
  },
  dropdownButtonActive: {
    borderColor: Colors.blue,
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownIconTile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dropdownButtonName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: -0.2,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  dropdownButtonSub: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ink3,
    marginTop: 1,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },

  dropdownPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
    zIndex: 40,
    shadowColor: '#1a2540',
    shadowOffset: { width: 0, height: -18 },
    shadowOpacity: 0.18,
    shadowRadius: 50,
    elevation: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.line },
  dropdownItemActive: { backgroundColor: Colors.blueSoft },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  dropdownItemSub: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink3,
    marginTop: 1,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },

  soonPill: {
    backgroundColor: Colors.amberSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  soonText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.amber,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },

  error: { color: Colors.coral, marginTop: 14, fontSize: 13, fontFamily: 'SchibstedGrotesk_500Medium' },

  footer: { paddingHorizontal: 18, paddingBottom: 22, paddingTop: 10 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.blue,
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 4,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  footerNote: {
    fontSize: 11.5,
    color: Colors.ink3,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
})
