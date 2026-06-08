import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'

const PRESETS = ['Wocheneinkauf', 'Bauernmarkt', 'Vorrat auffüllen', 'WG-Einkauf']

export function OnboardNameScreen() {
  const { listName, setListName, saveListName } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!listName.trim()) return
    setLoading(true)
    setError('')
    try {
      await saveListName(listName.trim())
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <View style={s.wordmark}>
          <View style={s.dot} />
          <Text style={s.wordmarkText}>mitbringen</Text>
        </View>

        <View style={{ marginTop: 64 }}>
          <Text style={s.eyebrow}>Schritt 1 von 2</Text>
          <Text style={s.headline}>Name your first{'\n'}shopping list</Text>
          <Text style={s.sub}>Every shop starts with a list. We'll find the cheapest price in Vienna for everything you add.</Text>
        </View>

        <TextInput
          style={s.input} value={listName} onChangeText={setListName}
          placeholder="z. B. Wocheneinkauf" placeholderTextColor={Colors.ink3}
          autoFocus returnKeyType="done" onSubmitEditing={submit}
        />

        <View style={s.chips}>
          {PRESETS.map((p) => (
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
            : <Text style={s.btnText}>Create list →</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 20 },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: Colors.green },
  wordmarkText: { fontSize: 17, fontWeight: '700', letterSpacing: -0.5, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.green, fontFamily: 'HankenGrotesk_700Bold' },
  headline: { fontSize: 32, fontWeight: '700', letterSpacing: -0.8, lineHeight: 38, color: Colors.ink, marginTop: 14, fontFamily: 'HankenGrotesk_700Bold' },
  sub: { fontSize: 16, color: Colors.ink2, lineHeight: 24, marginTop: 12, fontFamily: 'HankenGrotesk_400Regular' },
  input: { marginTop: 36, fontSize: 22, fontWeight: '600', padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.line2, backgroundColor: '#fff', color: Colors.ink, fontFamily: 'HankenGrotesk_600SemiBold', shadowColor: '#23231f', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#fff', shadowColor: '#23231f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  chipActive: { backgroundColor: Colors.ink },
  chipText: { fontSize: 13.5, fontWeight: '600', color: Colors.ink2, fontFamily: 'HankenGrotesk_600SemiBold' },
  chipTextActive: { color: '#fff' },
  error: { fontSize: 12.5, color: Colors.danger, fontWeight: '600', marginTop: 10, fontFamily: 'HankenGrotesk_600SemiBold' },
  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10 },
  btn: { height: 54, borderRadius: 16, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.green, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'HankenGrotesk_600SemiBold' },
})
