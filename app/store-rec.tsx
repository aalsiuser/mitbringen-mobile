import { useEffect, useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { api } from '@/lib/api'
import { useTween } from '@/hooks/useTween'

const STORE_COLORS: Record<string, string> = {
  hofer:      Colors.store.hofer,
  lidl:       Colors.store.lidl,
  spar:       Colors.store.spar,
  billa:      Colors.store.billa,
  billa_plus: Colors.store.billa_plus,
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

function BigSaving({ value }: { value: number }) {
  const v = useTween(value)
  const safe = Math.max(0, v)
  const int = Math.floor(safe)
  const dec = Math.round((safe - int) * 100).toString().padStart(2, '0')
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Text style={[s.heroEuroSign, { color: '#fff' }]}>€</Text>
      <Text style={[s.heroAmount, { color: '#fff' }]}>{int}</Text>
      <Text style={[s.heroCents, { color: '#fff' }]}>,{dec}</Text>
    </View>
  )
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
      {/* Back header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Where to shop</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={Colors.blue} />
          <Text style={s.loadingText}>Finding best deals…</Text>
        </View>
      ) : !result || stops.length === 0 ? (
        <View style={s.centered}>
          <Text style={s.emptyText}>No matching deals found this week.</Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            {/* Blue summary hero */}
            <LinearGradient
              colors={['#2f6bff', '#1d4fe6', '#1a44c8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.heroCard}
            >
              <View style={s.decCircle1} />
              <View style={s.decCircle2} />
              <Text style={s.heroEyebrow}>Most you can save</Text>
              <BigSaving value={result.total_saving} />
              <Text style={s.heroSub}>
                across {result.total_items} item{result.total_items === 1 ? '' : 's'} this shop
              </Text>
            </LinearGradient>

            <Text style={s.compareLabel}>Compare stores</Text>

            <View style={{ gap: 12 }}>
              {stops.map((stop, idx) => {
                const best = idx === 0
                const open = openId === stop.supermarket
                const color = STORE_COLORS[stop.supermarket] ?? Colors.ink3

                return (
                  <View key={stop.supermarket} style={[s.stopCard, best && s.stopCardBest]}>
                    {/* BEST CHOICE ribbon — first child so overflow:hidden doesn't clip */}
                    {best && (
                      <View style={s.ribbon}>
                        <Text style={s.ribbonText}>✦  BEST CHOICE</Text>
                      </View>
                    )}

                    {/* Summary row (tappable toggle) */}
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
                        <Text style={s.savesEyebrow}>You save</Text>
                        <Text style={s.savesAmount}>{fmt(stop.saving)}</Text>
                      </View>

                      <Text style={[s.chevron, open && { transform: [{ rotate: '180deg' }] }]}>⌄</Text>
                    </TouchableOpacity>

                    {/* Expanded product list */}
                    {open && (
                      <View style={[s.expanded, { borderTopColor: best ? Colors.blueSoft : Colors.line }]}>
                        <View style={s.expandedHeader}>
                          <Text style={s.expandedLabel}>Products on offer here</Text>
                          <Text style={s.expandedSpend}>spend {fmt(stop.promo_total)}</Text>
                        </View>
                        <View style={{ gap: 10 }}>
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

          {/* Dark bank CTA */}
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
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: Colors.ink2, fontFamily: 'SchibstedGrotesk_400Regular' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },
  emptyText: { fontSize: 15, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },

  content: { paddingHorizontal: 18, paddingBottom: 24 },

  // Blue hero card
  heroCard: {
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    overflow: 'hidden',
    ...Shadows.blue,
  },
  decCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -40,
    top: -40,
  },
  decCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    left: -20,
    bottom: -30,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'SchibstedGrotesk_700Bold',
    marginBottom: 10,
  },
  heroEuroSign: { fontSize: 22, fontWeight: '800', marginTop: 6, marginRight: 2, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  heroAmount: { fontSize: 50, fontWeight: '800', lineHeight: 50, letterSpacing: -1, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  heroCents: { fontSize: 22, fontWeight: '800', marginTop: 6, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginTop: 10, fontFamily: 'SchibstedGrotesk_500Medium' },

  compareLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.ink3,
    fontFamily: 'SchibstedGrotesk_700Bold',
    marginTop: 22,
    marginBottom: 10,
  },

  // Store cards
  stopCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    ...Shadows.card,
  },
  stopCardBest: {
    borderWidth: 2,
    borderColor: Colors.blue,
    shadowColor: Colors.blue,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  ribbon: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ribbonText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.7, fontFamily: 'SchibstedGrotesk_800ExtraBold' },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 16,
  },

  monogram: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  monogramText: { color: '#fff', fontWeight: '700', fontSize: 18, fontFamily: 'SchibstedGrotesk_700Bold' },

  storeName: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  rankPill: { backgroundColor: Colors.line, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  rankText: { fontSize: 11, fontWeight: '700', color: Colors.ink3, fontFamily: 'SchibstedGrotesk_700Bold' },
  itemsOnOffer: { fontSize: 13, color: Colors.ink3, marginTop: 3, fontFamily: 'SchibstedGrotesk_400Regular' },

  savesEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  savesAmount: { fontSize: 20, fontWeight: '800', color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', letterSpacing: -0.5, fontVariant: ['tabular-nums'] as any, lineHeight: 26 },

  chevron: { fontSize: 22, color: Colors.ink3, flexShrink: 0, marginBottom: 4 },

  expanded: { borderTopWidth: 1, padding: 16, paddingTop: 0 },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  expandedLabel: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },
  expandedSpend: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },

  productRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  productTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.inset,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  productLetter: { fontSize: 14, fontWeight: '700', color: Colors.ink2, fontFamily: 'SchibstedGrotesk_700Bold' },
  productName: { fontSize: 14.5, fontWeight: '600', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  productUnit: { fontSize: 12, color: Colors.ink3, marginTop: 1, fontFamily: 'SchibstedGrotesk_400Regular' },
  discountBadge: { backgroundColor: Colors.greenSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, flexShrink: 0 },
  discountText: { fontSize: 11, fontWeight: '700', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  productPromo: { fontSize: 14.5, fontWeight: '700', color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  productRegular: { fontSize: 11.5, color: Colors.ink3, textDecorationLine: 'line-through', fontFamily: 'SchibstedGrotesk_400Regular' },

  footer: { paddingHorizontal: 18, paddingBottom: 36, paddingTop: 10 },
  bankBtn: {
    height: 54,
    borderRadius: 15,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },
})
