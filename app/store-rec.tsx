import { useEffect, useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { MoneyHero } from '@/components/ui/MoneyHero'
import { useApp } from '@/lib/AppContext'
import { api } from '@/lib/api'

const STORE_COLORS: Record<string, string> = {
  hofer:      '#d8462a',
  lidl:       '#2a64b4',
  spar:       '#1f8a5b',
  billa:      '#e0a43a',
  billa_plus: '#e0a43a',
}

const fmt = (n: number | null | undefined) => n != null ? '€' + Number(n).toFixed(2) : '—'
const discountPct = (promo: number | null, regular: number | null) => {
  if (!promo || !regular || regular <= 0) return 0
  return Math.round((1 - promo / regular) * 100)
}

interface OptimiseItem {
  name: string
  unit: string | null
  promo_price: number | null
  regular_price: number | null
}

interface OptimiseStop {
  supermarket: string
  supermarket_name: string
  covered_count: number
  promo_total: number
  saving: number
  items: OptimiseItem[]
}

interface OptimiseResult {
  stops: OptimiseStop[]
  total_saving: number
  items_covered: number
  total_items: number
}

export default function StoreRecScreen() {
  const { currentListId, bankSavings } = useApp()
  const router = useRouter()
  const [result, setResult] = useState<OptimiseResult | null>(null)
  const [loading, setLoading] = useState(true)

  const stops = useMemo(() => {
    if (!result) return []
    return [...result.stops].sort((a, b) => b.saving - a.saving)
  }, [result])

  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (stops.length > 0 && openId === null) {
      setOpenId(stops[0].supermarket)
    }
  }, [stops])

  useEffect(() => {
    if (!currentListId) return
    api.get<OptimiseResult>(`/shopping_lists/${currentListId}/optimise`)
      .then(setResult)
      .finally(() => setLoading(false))
  }, [currentListId])

  const handleBank = async () => {
    await bankSavings(result?.total_saving ?? 0)
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
      ) : !result || stops.length === 0 ? (
        <View style={s.centered}>
          <Text style={s.emptyText}>No matching deals found this week.</Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={s.heroCard}>
              <Text style={[s.eyebrow, { color: Colors.green }]}>Most you can save</Text>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <MoneyHero value={result.total_saving} size={64} />
              </View>
              <Text style={s.heroSub}>
                across {result.total_items} item{result.total_items === 1 ? '' : 's'} this shop
              </Text>
            </View>

            <Text style={[s.eyebrow, { marginTop: 22, marginBottom: 10 }]}>Compare stores</Text>

            <View style={{ gap: 12 }}>
              {stops.map((stop, idx) => {
                const best = idx === 0
                const open = openId === stop.supermarket
                const color = STORE_COLORS[stop.supermarket] ?? Colors.ink3

                return (
                  <View key={stop.supermarket} style={[s.stopCard, best && s.stopCardBest]}>
                    {best && (
                      <View style={s.ribbon}>
                        <Text style={s.ribbonText}>✦  MOST SAVINGS</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => setOpenId(open ? null : stop.supermarket)}
                      style={s.summaryRow}
                      activeOpacity={0.7}
                    >
                      <View style={[s.monogram, { backgroundColor: color }]}>
                        <Text style={s.monogramText}>{stop.supermarket_name[0]}</Text>
                      </View>

                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={s.storeName}>{stop.supermarket_name}</Text>
                          <View style={s.rankPill}>
                            <Text style={s.rankText}>#{idx + 1}</Text>
                          </View>
                        </View>
                        <Text style={s.itemsOnOffer}>
                          {stop.covered_count} item{stop.covered_count === 1 ? '' : 's'} on offer
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[s.savesEyebrow, { color: best ? Colors.green : Colors.ink3 }]}>You save</Text>
                        <Text style={s.savesAmount}>{fmt(stop.saving)}</Text>
                      </View>

                      <Text style={[s.chevron, open && { transform: [{ rotate: '180deg' }] }]}>⌄</Text>
                    </TouchableOpacity>

                    {open && (
                      <View style={[s.expanded, { borderTopColor: best ? Colors.greenSoft : Colors.line }]}>
                        <View style={s.expandedHeader}>
                          <Text style={s.expandedLabel}>Products on offer here</Text>
                          <Text style={s.expandedSpend}>spend {fmt(stop.promo_total)}</Text>
                        </View>
                        <View style={{ gap: 8 }}>
                          {stop.items.map((item) => {
                            const pct = discountPct(item.promo_price, item.regular_price)
                            return (
                              <View key={item.name} style={s.productRow}>
                                <View style={s.productTile}>
                                  <Text style={s.productLetter}>{item.name[0].toUpperCase()}</Text>
                                </View>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                  <Text style={s.productName} numberOfLines={1}>{item.name}</Text>
                                  {item.unit ? <Text style={s.productUnit}>{item.unit}</Text> : null}
                                </View>
                                {pct > 0 && (
                                  <View style={s.discountBadge}>
                                    <Text style={s.discountText}>−{pct}%</Text>
                                  </View>
                                )}
                                <View style={{ alignItems: 'flex-end', minWidth: 52 }}>
                                  <Text style={s.productPromo}>{fmt(item.promo_price)}</Text>
                                  {item.regular_price ? (
                                    <Text style={s.productRegular}>{fmt(item.regular_price)}</Text>
                                  ) : null}
                                </View>
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </ScrollView>

          <View style={s.footer}>
            <TouchableOpacity style={s.bankBtn} onPress={handleBank} activeOpacity={0.85}>
              <Text style={s.bankBtnText}>✓  I shopped — bank {fmt(result.total_saving)}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.appBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: Colors.ink2, fontFamily: 'HankenGrotesk_400Regular' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: Colors.ink3, fontFamily: 'HankenGrotesk_400Regular' },
  emptyText: { fontSize: 15, color: Colors.ink3, fontFamily: 'HankenGrotesk_400Regular' },
  content: { paddingHorizontal: 22, paddingBottom: 24 },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },

  heroCard: { backgroundColor: Colors.card, borderRadius: 22, padding: 22, alignItems: 'center', ...Shadows.card },
  heroSub: { fontSize: 14, color: Colors.ink2, fontWeight: '600', marginTop: 8, fontFamily: 'HankenGrotesk_600SemiBold' },

  stopCard: { backgroundColor: Colors.card, borderRadius: 22, overflow: 'hidden', ...Shadows.card },
  stopCardBest: { borderWidth: 2, borderColor: Colors.green, shadowColor: Colors.green, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },

  ribbon: { backgroundColor: Colors.green, paddingHorizontal: 18, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  ribbonText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.7, fontFamily: 'HankenGrotesk_700Bold' },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, paddingHorizontal: 16 },

  monogram: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  monogramText: { color: '#fff', fontWeight: '700', fontSize: 18, fontFamily: 'HankenGrotesk_700Bold' },

  storeName: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  rankPill: { backgroundColor: Colors.line, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  rankText: { fontSize: 11, fontWeight: '700', color: Colors.ink3, fontFamily: 'HankenGrotesk_700Bold' },
  itemsOnOffer: { fontSize: 13, color: Colors.ink3, fontWeight: '600', marginTop: 3, fontFamily: 'HankenGrotesk_600SemiBold' },

  savesEyebrow: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'HankenGrotesk_700Bold' },
  savesAmount: { fontSize: 24, fontWeight: '600', color: Colors.green, fontFamily: 'SpaceGrotesk_600SemiBold', letterSpacing: -0.5, lineHeight: 28 },

  chevron: { fontSize: 22, color: Colors.ink3, flexShrink: 0, marginBottom: 4 },

  expanded: { borderTopWidth: 1, padding: 16, paddingTop: 0 },
  expandedHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 2 },
  expandedLabel: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  expandedSpend: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },

  productRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  productTile: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.greenTint, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  productLetter: { fontSize: 14, fontWeight: '700', color: Colors.green, fontFamily: 'HankenGrotesk_700Bold' },
  productName: { fontSize: 14.5, fontWeight: '600', color: Colors.ink, fontFamily: 'HankenGrotesk_600SemiBold' },
  productUnit: { fontSize: 12, color: Colors.ink3, marginTop: 1, fontFamily: 'HankenGrotesk_400Regular' },
  discountBadge: { backgroundColor: Colors.greenSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, flexShrink: 0 },
  discountText: { fontSize: 11, fontWeight: '700', color: Colors.green, fontFamily: 'HankenGrotesk_700Bold' },
  productPromo: { fontSize: 14.5, fontWeight: '700', color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  productRegular: { fontSize: 11.5, color: Colors.ink3, textDecorationLine: 'line-through', fontFamily: 'HankenGrotesk_400Regular' },

  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10 },
  bankBtn: { height: 54, borderRadius: 16, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', ...Shadows.green },
  bankBtnText: { fontSize: 16, fontWeight: '600', color: '#fff', fontFamily: 'HankenGrotesk_600SemiBold' },
})
