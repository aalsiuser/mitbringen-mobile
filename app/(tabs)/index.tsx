import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { MoneyHero } from '@/components/ui/MoneyHero'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useApp } from '@/lib/AppContext'
import { fmt } from '@/lib/data'

const MONTH = new Date().toLocaleString('de-AT', { month: 'long' })

export default function HomeTab() {
  const { saved, goal, items, listName, shops, justBanked, setAssistantOpen, signOut } = useApp()
  const router = useRouter()
  const pct = goal > 0 ? (saved / goal) * 100 : 0
  const remaining = Math.max(0, goal - saved)
  const predicted = items.reduce((s, item) => {
    const bp = item.best_price
    return s + Math.max(0, (bp?.regular_price ?? 0) - (bp?.promo_price ?? 0))
  }, 0)

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.appbar}>
        <View>
          <View style={s.wordmark}><View style={s.dot} /><Text style={s.wordmarkText}>mitbringen</Text></View>
          <Text style={s.subtitle}>Servus 👋</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={s.logoutBtn}>
          <Text style={s.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Savings hero */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>Saved in {MONTH}</Text>
          <View style={{ alignItems: 'center', marginTop: 14, position: 'relative' }}>
            <MoneyHero value={saved} size={84} />
            {justBanked > 0 && (
              <View style={s.justBankedPill}>
                <Text style={s.justBankedText}>+{fmt(justBanked)}</Text>
              </View>
            )}
          </View>

          {goal > 0 ? (
            <View style={{ marginTop: 22, paddingHorizontal: 4 }}>
              <ProgressBar pct={pct} height={14} />
              <View style={s.progressLabels}>
                <Text style={[s.progressLabel, { color: Colors.green }]}>{Math.round(pct)}% of {fmt(goal)}</Text>
                <Text style={[s.progressLabel, { color: Colors.ink3 }]}>{fmt(remaining)} to goal</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={s.setGoalBtn}>
              <Text style={s.setGoalText}>⊙ Set a monthly goal</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stat strip */}
        <View style={s.statStrip}>
          <View style={[s.statCard, { flex: 1 }]}>
            <Text style={s.statEyebrow}>Shops</Text>
            <Text style={s.statNum}>{shops}</Text>
            <Text style={s.statSub}>this month</Text>
          </View>
          <TouchableOpacity style={[s.statCard, s.assistantCard, { flex: 1 }]} onPress={() => setAssistantOpen(true)} activeOpacity={0.85}>
            <View style={s.soonPill}><Text style={s.soonText}>SOON</Text></View>
            <View style={s.assistantIcon}><Text style={{ fontSize: 19 }}>💬</Text></View>
            <Text style={s.assistantTitle}>Assistant</Text>
            <Text style={s.assistantSub}>Ask anything in Vienna</Text>
          </TouchableOpacity>
        </View>

        {/* Current list card */}
        <TouchableOpacity style={s.listCard} onPress={() => router.push('/(tabs)/list')} activeOpacity={0.85}>
          <View style={s.listCardHeader}>
            <Text style={s.eyebrow}>Current list</Text>
            <Text style={{ color: Colors.green, fontSize: 18 }}>→</Text>
          </View>
          <Text style={s.listName}>{listName}</Text>
          <View style={s.listMeta}>
            <Text style={s.listItemCount}>{items.length} item{items.length === 1 ? '' : 's'}</Text>
            {predicted > 0 && (
              <View style={s.savesPill}><Text style={s.savesText}>saves {fmt(predicted)}</Text></View>
            )}
          </View>
          {items.length === 0 && <Text style={s.emptyHint}>Empty — tap to add items</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.appBg },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12, },
  logoutBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: Colors.line },
  logoutText: { fontSize: 13, color: Colors.ink2, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: Colors.green },
  wordmarkText: { fontSize: 17, fontWeight: '700', letterSpacing: -0.5, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  subtitle: { fontSize: 12.5, color: Colors.ink3, marginTop: 2, marginLeft: 16, fontFamily: 'HankenGrotesk_400Regular' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 24 },
  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },
  justBankedPill: { position: 'absolute', top: -14, right: -44, backgroundColor: Colors.green, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 },
  justBankedText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'HankenGrotesk_700Bold' },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressLabel: { fontSize: 13.5, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  setGoalBtn: { marginTop: 22, height: 46, paddingHorizontal: 18, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#23231f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  setGoalText: { fontSize: 14, color: Colors.ink, fontFamily: 'HankenGrotesk_400Regular' },
  statStrip: { flexDirection: 'row', gap: 12, marginTop: 22 },
  statCard: { backgroundColor: Colors.card, borderRadius: 22, padding: 16, shadowColor: '#23231f', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  statEyebrow: { fontSize: 10.5, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },
  statNum: { fontSize: 28, fontWeight: '600', marginTop: 6, color: Colors.ink, fontFamily: 'SpaceGrotesk_600SemiBold' },
  statSub: { fontSize: 12.5, color: Colors.ink3, marginTop: 2, fontFamily: 'HankenGrotesk_400Regular' },
  assistantCard: { overflow: 'hidden' },
  soonPill: { position: 'absolute', top: 13, right: 13, backgroundColor: Colors.amberSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  soonText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6, color: Colors.amber, fontFamily: 'HankenGrotesk_700Bold' },
  assistantIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  assistantTitle: { fontSize: 16, fontWeight: '700', marginTop: 11, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  assistantSub: { fontSize: 12.5, color: Colors.ink3, marginTop: 2, fontFamily: 'HankenGrotesk_400Regular' },
  listCard: { marginTop: 14, backgroundColor: Colors.card, borderRadius: 22, padding: 18, shadowColor: '#23231f', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  listCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listName: { fontSize: 21, fontWeight: '700', letterSpacing: -0.4, marginTop: 8, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  listItemCount: { fontSize: 14, fontWeight: '600', color: Colors.ink2, fontFamily: 'HankenGrotesk_600SemiBold' },
  savesPill: { backgroundColor: Colors.greenSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  savesText: { fontSize: 13, fontWeight: '700', color: Colors.green, fontFamily: 'HankenGrotesk_700Bold' },
  emptyHint: { fontSize: 13.5, color: Colors.ink3, marginTop: 8, fontFamily: 'HankenGrotesk_400Regular' },
})
