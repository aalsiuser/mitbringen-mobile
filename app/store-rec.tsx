import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { MoneyHero } from '@/components/ui/MoneyHero'
import { useApp } from '@/lib/AppContext'
import { api } from '@/lib/api'

const fmt = (n: number) => '€' + n.toFixed(2)

interface OptimiseStop {
  supermarket: string
  supermarket_name: string
  covered_count: number
  promo_total: number
  saving: number
  items: { name: string }[]
}

interface OptimiseResult {
  stops: OptimiseStop[]
  total_saving: number
  items_covered: number
  total_items: number
}

export default function StoreRecScreen() {
  const { currentListId, items, bankSavings } = useApp()
  const router = useRouter()
  const [result, setResult] = useState<OptimiseResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentListId) return
    api.get<OptimiseResult>(`/shopping_lists/${currentListId}/optimise`)
      .then(setResult)
      .finally(() => setLoading(false))
  }, [currentListId])

  const handleBank = () => {
    bankSavings(result?.total_saving ?? 0)
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Where to shop</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={Colors.green} />
          <Text style={s.loadingText}>Finding best deals…</Text>
        </View>
      ) : !result || result.stops.length === 0 ? (
        <View style={s.centered}>
          <Text style={s.emptyText}>No matching deals found this week.</Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={s.heroCard}>
              <Text style={[s.eyebrow, { color: Colors.green }]}>Best plan for your basket</Text>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <MoneyHero value={result.total_saving} size={64} />
              </View>
              <Text style={s.heroSub}>
                {result.items_covered} of {result.total_items} item{result.total_items === 1 ? '' : 's'} on promo this week
              </Text>
            </View>

            {/* Store cards */}
            <View style={{ gap: 12, marginTop: 18 }}>
              {result.stops.map((stop, idx) => {
                const best = idx === 0
                return (
                  <View key={stop.supermarket} style={[s.stopCard, best && s.stopCardBest]}>
                    {best && (
                      <View style={s.ribbon}>
                        <Text style={s.ribbonText}>✦ MOST SAVINGS</Text>
                      </View>
                    )}

                    <View style={s.stopHeader}>
                      <View style={[s.storeDot, { backgroundColor: STORE_COLORS[stop.supermarket] ?? Colors.ink3 }]} />
                      <Text style={s.storeName}>{stop.supermarket_name}</Text>
                    </View>

                    <View style={[s.statsRow, { borderTopColor: best ? Colors.greenSoft : Colors.line }]}>
                      {[
                        { label: 'COVERS', value: `${stop.covered_count} item${stop.covered_count === 1 ? '' : 's'}`, green: false },
                        { label: 'SPEND', value: fmt(stop.promo_total), green: false },
                        { label: 'SAVE', value: fmt(stop.saving), green: true },
                      ].map((stat, si) => (
                        <View key={stat.label} style={[s.statCell, si < 2 && { borderRightWidth: 1, borderRightColor: best ? Colors.greenSoft : Colors.line }]}>
                          <Text style={[s.statLabel, stat.green && { color: Colors.green }]}>{stat.label}</Text>
                          <Text style={[s.statValue, stat.green && { color: Colors.green }]}>{stat.value}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={s.chips}>
                      {stop.items.map((item) => (
                        <View key={item.name} style={s.chip}>
                          <Text style={s.chipText}>{item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )
              })}
            </View>
          </ScrollView>

          <View style={s.footer}>
            <TouchableOpacity style={s.bankBtn} onPress={handleBank} activeOpacity={0.85}>
              <Text style={s.bankBtnText}>✓ I shopped — bank {fmt(result.total_saving)}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const STORE_COLORS: Record<string, string> = {
  hofer:      '#d8462a',
  lidl:       '#2a64b4',
  spar:       '#1f8a5b',
  billa:      '#e0a43a',
  billa_plus: '#e0a43a',
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: Colors.appBg },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  backBtn:       { width: 60 },
  backText:      { fontSize: 16, color: Colors.ink2, fontFamily: 'HankenGrotesk_400Regular' },
  headerTitle:   { fontSize: 16, fontWeight: '700', color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  centered:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:   { fontSize: 15, color: Colors.ink3, fontFamily: 'HankenGrotesk_400Regular' },
  emptyText:     { fontSize: 15, color: Colors.ink3, fontFamily: 'HankenGrotesk_400Regular' },
  content:       { paddingHorizontal: 22, paddingBottom: 24 },
  eyebrow:       { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },
  heroCard:      { backgroundColor: Colors.card, borderRadius: 22, padding: 22, alignItems: 'center', ...Shadows.card },
  heroSub:       { fontSize: 14, color: Colors.ink2, fontWeight: '600', marginTop: 8, fontFamily: 'HankenGrotesk_600SemiBold' },
  stopCard:      { backgroundColor: Colors.card, borderRadius: 22, overflow: 'hidden', ...Shadows.card },
  stopCardBest:  { borderWidth: 2, borderColor: Colors.green, shadowColor: Colors.green, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  ribbon:        { backgroundColor: Colors.green, paddingHorizontal: 18, paddingVertical: 8 },
  ribbonText:    { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.7, fontFamily: 'HankenGrotesk_700Bold' },
  stopHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, paddingBottom: 14 },
  storeDot:      { width: 12, height: 12, borderRadius: 999 },
  storeName:     { fontSize: 20, fontWeight: '700', color: Colors.ink, letterSpacing: -0.3, fontFamily: 'HankenGrotesk_700Bold' },
  statsRow:      { flexDirection: 'row', borderTopWidth: 1 },
  statCell:      { flex: 1, padding: 12 },
  statLabel:     { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.4, color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },
  statValue:     { fontSize: 16, fontWeight: '700', marginTop: 3, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  chips:         { flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 16 },
  chip:          { backgroundColor: Colors.greenTint, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 },
  chipText:      { fontSize: 12.5, fontWeight: '600', color: Colors.ink, fontFamily: 'HankenGrotesk_600SemiBold' },
  footer:        { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10 },
  bankBtn:       { height: 54, borderRadius: 16, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', ...Shadows.green },
  bankBtnText:   { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'HankenGrotesk_600SemiBold' },
})
