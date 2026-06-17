import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { MitbringenWordmark } from '@/components/ui/MitbringenMark'

export function OnboardNameScreen() {
  const { listName, setListName, saveListName } = useApp()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const presets = t('onboard.presets', { returnObjects: true }) as string[]

  const submit = async () => {
    if (!listName.trim()) return
    setLoading(true)
    setError('')
    try {
      await saveListName(listName.trim())
    } catch {
      setError(t('common.errorGeneric'))
      setLoading(false)
    }
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <MitbringenWordmark size={17} />

        <View style={{ marginTop: 64 }}>
          <Text style={s.eyebrow}>{t('onboard.stepNOfM', { n: 1, m: 2 })}</Text>
          <Text style={s.headline}>{t('onboard.nameHeadline')}</Text>
          <Text style={s.sub}>{t('onboard.nameSub')}</Text>
        </View>

        <TextInput
          style={s.input} value={listName} onChangeText={setListName}
          placeholder={t('onboard.namePlaceholder')} placeholderTextColor={Colors.ink3}
          autoFocus returnKeyType="done" onSubmitEditing={submit}
        />

        <View style={s.chips}>
          {presets.map((p) => (
            <TouchableOpacity key={p} onPress={() => setListName(p)}
              style={[s.chip, listName === p && s.chipActive]}>
              <Text style={[s.chipText, listName === p && s.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, { opacity: listName.trim() && !loading ? 1 : 0.4 }]}
          onPress={submit} activeOpacity={0.85} disabled={!listName.trim() || loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('onboard.ctaCreateList')} →</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 20 },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  headline: { fontSize: 32, fontWeight: '700', letterSpacing: -0.8, lineHeight: 38, color: Colors.ink, marginTop: 14, fontFamily: 'SchibstedGrotesk_700Bold' },
  sub: { fontSize: 16, color: Colors.ink2, lineHeight: 24, marginTop: 12, fontFamily: 'SchibstedGrotesk_400Regular' },
  input: { marginTop: 36, fontSize: 22, fontWeight: '600', padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.line2, backgroundColor: '#fff', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold', shadowColor: '#23231f', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#fff', shadowColor: '#23231f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  chipActive: { backgroundColor: Colors.ink },
  chipText: { fontSize: 13.5, fontWeight: '600', color: Colors.ink2, fontFamily: 'SchibstedGrotesk_700Bold' },
  chipTextActive: { color: '#fff' },
  error: { fontSize: 12.5, color: Colors.danger, fontWeight: '600', marginTop: 10, fontFamily: 'SchibstedGrotesk_700Bold' },
  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10 },
  btn: { height: 54, borderRadius: 16, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },
})
