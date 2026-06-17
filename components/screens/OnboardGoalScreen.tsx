import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import Slider from '@react-native-community/slider'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'

const PRESETS = [30, 50, 80, 120]

export function OnboardGoalScreen() {
  const { goal, setGoal, saveGoal } = useApp()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const submit = async (goalValue: number | null) => {
    setLoading(true)
    try {
      await saveGoal(goalValue)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={s.root}>
      <View style={s.content}>
        <Text style={s.eyebrow}>{t('onboard.stepNOfM', { n: 2, m: 2 })}</Text>
        <Text style={s.headline}>{t('onboard.goalHeadline')}</Text>
        <Text style={s.sub}>{t('onboard.goalSub')}</Text>

        <View style={s.heroNum}>
          <Text style={s.euro}>€</Text>
          <Text style={s.amount}>{goal}</Text>
        </View>
        <Text style={s.perMonth}>{t('onboard.perMonth')}</Text>

        <View style={s.sliderWrap}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={10} maximumValue={200} step={5}
            value={goal} onValueChange={(v) => setGoal(Math.round(v))}
            minimumTrackTintColor={Colors.blue}
            maximumTrackTintColor={Colors.blueSoft}
            thumbTintColor={Colors.blue}
          />
        </View>

        <View style={s.chips}>
          {PRESETS.map((p) => (
            <TouchableOpacity key={p} onPress={() => setGoal(p)}
              style={[s.chip, goal === p && s.chipActive]}>
              <Text style={[s.chipText, goal === p && s.chipTextActive]}>€{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={[s.btn, { opacity: loading ? 0.6 : 1 }]} onPress={() => submit(goal)} activeOpacity={0.85} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('onboard.ctaStart')} →</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity style={s.btnGhost} onPress={() => submit(null)} activeOpacity={0.7} disabled={loading}>
          <Text style={s.btnGhostText}>{t('onboard.ctaSkip')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 60 },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  headline: { fontSize: 32, fontWeight: '700', letterSpacing: -0.8, lineHeight: 38, color: Colors.ink, marginTop: 14, fontFamily: 'SchibstedGrotesk_700Bold' },
  sub: { fontSize: 16, color: Colors.ink2, lineHeight: 24, marginTop: 12, fontFamily: 'SchibstedGrotesk_400Regular' },
  heroNum: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginTop: 40 },
  euro: { fontSize: 40, color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', marginTop: 8 },
  amount: { fontSize: 84, color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', letterSpacing: -2, lineHeight: 88 },
  perMonth: { textAlign: 'center', fontSize: 14, color: Colors.ink3, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },
  sliderWrap: { marginTop: 26, paddingHorizontal: 4 },
  chips: { flexDirection: 'row', gap: 8, marginTop: 22 },
  chip: { flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', shadowColor: '#23231f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  chipActive: { backgroundColor: Colors.blue, shadowColor: Colors.blue, shadowOpacity: 0.4 },
  chipText: { fontSize: 15, fontWeight: '700', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  chipTextActive: { color: '#fff' },
  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10, gap: 4 },
  btn: { height: 54, borderRadius: 16, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },
  btnGhost: { height: 48, alignItems: 'center', justifyContent: 'center' },
  btnGhostText: { fontSize: 15, color: Colors.ink2, fontFamily: 'SchibstedGrotesk_400Regular' },
})
