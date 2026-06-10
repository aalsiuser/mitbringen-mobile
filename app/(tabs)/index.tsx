import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { useTween } from '@/hooks/useTween'
import { fmt } from '@/lib/data'

const MONTH = new Date().toLocaleString('de-AT', { month: 'long' })

// Group items by their cheapest store and pick top 3 by count
function topStores(items: ReturnType<typeof useApp>['items']) {
  const byStore: Record<string, { name: string; color: string; count: number; saving: number }> = {}
  for (const item of items) {
    const bp = item.best_price
    if (!bp) continue
    const slug = bp.supermarket
    if (!byStore[slug]) {
      byStore[slug] = {
        name: bp.supermarket_name,
        color: Colors.store[slug as keyof typeof Colors.store] ?? Colors.ink3,
        count: 0,
        saving: 0,
      }
    }
    byStore[slug].count++
    byStore[slug].saving += Math.max(0, (bp.regular_price ?? 0) - (bp.promo_price ?? 0))
  }
  return Object.entries(byStore)
    .sort((a, b) => b[1].saving - a[1].saving)
    .slice(0, 3)
}

function BigEuro({ value, color = '#fff' }: { value: number; color?: string }) {
  const v = useTween(value)
  const safe = Math.max(0, v)
  const int = Math.floor(safe)
  const dec = Math.round((safe - int) * 100).toString().padStart(2, '0')
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Text style={[s.heroEuroSign, { color }]}>€</Text>
      <Text style={[s.heroAmount, { color }]}>{int}</Text>
      <Text style={[s.heroCents, { color }]}>,{dec}</Text>
    </View>
  )
}

export default function HomeTab() {
  const { saved, goal, items, listName, justBanked, user, signOut } = useApp()
  const router = useRouter()
  const pct = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0
  const remaining = Math.max(0, goal - saved)

  const predicted = items.reduce((s, item) => {
    const bp = item.best_price
    return s + Math.max(0, (bp?.regular_price ?? 0) - (bp?.promo_price ?? 0))
  }, 0)

  const stores = topStores(items)
  const initial = (user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Top bar */}
      <View style={s.topBar}>
        <View>
          <Text style={s.greeting}>Guten Morgen,</Text>
          <Text style={s.greetingName}>{user?.email?.split('@')[0] ?? 'Anna'}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={s.avatar}>
          <Text style={s.avatarText}>{initial}</Text>
        </TouchableOpacity>
      </View>

      {/* Bank toast */}
      {justBanked > 0 && (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastText}>🎉 Banked {fmt(justBanked)} into your savings</Text>
        </View>
      )}

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Blue savings hero card */}
        <LinearGradient
          colors={['#2f6bff', '#1d4fe6', '#1a44c8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.heroCard}
        >
          {/* Decorative circles */}
          <View style={s.decCircle1} />
          <View style={s.decCircle2} />

          <View style={s.heroTop}>
            <Text style={s.heroEyebrow}>Saved in {MONTH}</Text>
            {saved > 0 && (
              <View style={s.weekChip}>
                <Text style={s.weekChipText}>↑ {fmt(predicted > 0 ? predicted : 0)} this week</Text>
              </View>
            )}
          </View>

          <BigEuro value={saved} />

          {goal > 0 && (
            <View style={s.heroProgress}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${pct}%` }]} />
              </View>
              <View style={s.progressMeta}>
                <Text style={s.progressLeft}>{Math.round(pct)}% of {fmt(goal)} goal</Text>
                <Text style={s.progressRight}>{fmt(remaining)} to go</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Quick actions */}
        <View style={s.quickGrid}>
          <TouchableOpacity style={s.quickTile} onPress={() => router.push('/(tabs)/list')} activeOpacity={0.8}>
            <View style={[s.quickIcon, { backgroundColor: Colors.blueSoft }]}>
              <Text style={{ fontSize: 18 }}>＋</Text>
            </View>
            <Text style={s.quickLabel}>New list</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickTile} activeOpacity={0.8}>
            <View style={[s.quickIcon, { backgroundColor: Colors.coralSoft }]}>
              <Text style={{ fontSize: 18 }}>🧾</Text>
            </View>
            <Text style={s.quickLabel}>Scan bill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickTile} activeOpacity={0.8}>
            <View style={[s.quickIcon, { backgroundColor: Colors.greenSoft }]}>
              <Text style={{ fontSize: 18 }}>%</Text>
            </View>
            <Text style={s.quickLabel}>Deals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickTile} activeOpacity={0.8}>
            <View style={[s.quickIcon, { backgroundColor: Colors.violetSoft }]}>
              <Text style={{ fontSize: 18 }}>◎</Text>
            </View>
            <Text style={s.quickLabel}>Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Your list section */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Your list</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/list')}>
            <Text style={s.sectionLink}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={s.listCard}>
          <View style={s.listCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.listName}>{listName}</Text>
              <Text style={s.listMeta}>{items.length} item{items.length === 1 ? '' : 's'}{items.length > 0 ? ' · ready to shop' : ''}</Text>
            </View>
            <TouchableOpacity style={s.listBtn} onPress={() => router.push('/(tabs)/list')} activeOpacity={0.8}>
              <Text style={{ color: '#fff', fontSize: 18 }}>↻</Text>
            </TouchableOpacity>
          </View>

          {items.length > 0 && (
            <View style={s.emojiRow}>
              {items.slice(0, 5).map((item) => (
                <View key={item.id} style={s.emojiBubble}>
                  <Text style={{ fontSize: 16 }}>{item.name[0].toUpperCase()}</Text>
                </View>
              ))}
              {items.length > 5 && (
                <View style={[s.emojiBubble, s.overflowBubble]}>
                  <Text style={s.overflowText}>+{items.length - 5}</Text>
                </View>
              )}
              {predicted > 0 && (
                <View style={s.savesPill}>
                  <Text style={s.savesText}>saves {fmt(predicted)}</Text>
                </View>
              )}
            </View>
          )}

          {items.length === 0 && (
            <Text style={s.emptyHint}>Empty — tap Open to add items</Text>
          )}
        </View>

        {/* Where to save this week */}
        {stores.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Where to save this week</Text>
            </View>
            <View style={s.storesCard}>
              {stores.map(([slug, store], idx) => (
                <TouchableOpacity
                  key={slug}
                  style={[s.storeRow, idx < stores.length - 1 && s.storeRowBorder]}
                  onPress={() => router.push('/store-rec')}
                  activeOpacity={0.7}
                >
                  <View style={[s.storeMonogram, { backgroundColor: store.color }]}>
                    <Text style={s.storeMonogramText}>{store.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.storeName}>{store.name}</Text>
                    <Text style={s.storeItemCount}>{store.count} of your items on offer</Text>
                  </View>
                  <Text style={s.storeSaving}>{fmt(store.saving)}</Text>
                  <Text style={s.storeChev}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
  },
  greeting: { fontSize: 14, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },
  greetingName: { fontSize: 22, fontWeight: '800', color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold', marginTop: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'SchibstedGrotesk_700Bold' },

  // Toast
  toast: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    backgroundColor: Colors.green,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    zIndex: 100,
    ...Shadows.green,
  },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'SchibstedGrotesk_700Bold' },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 32 },

  // Blue hero card
  heroCard: {
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    ...Shadows.blue,
  },
  decCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -50,
    top: -50,
  },
  decCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: 30,
    bottom: -40,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  heroEyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontFamily: 'SchibstedGrotesk_700Bold' },
  weekChip: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  weekChipText: { color: '#fff', fontSize: 11, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },

  heroEuroSign: { fontSize: 24, fontWeight: '800', marginTop: 8, marginRight: 2, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  heroAmount: { fontSize: 54, fontWeight: '800', lineHeight: 54, letterSpacing: -1, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  heroCents: { fontSize: 24, fontWeight: '800', marginTop: 8, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },

  heroProgress: { marginTop: 18 },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 999, backgroundColor: '#fff' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressLeft: { fontSize: 12, color: '#fff', fontFamily: 'SchibstedGrotesk_400Regular' },
  progressRight: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'SchibstedGrotesk_400Regular' },

  // Quick actions
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  quickTile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    ...Shadows.card,
  },
  quickIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '600', color: Colors.ink2, textAlign: 'center', fontFamily: 'SchibstedGrotesk_700Bold' },

  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  sectionLink: { fontSize: 14, fontWeight: '600', color: Colors.blue, fontFamily: 'SchibstedGrotesk_700Bold' },

  // List card
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    ...Shadows.card,
  },
  listCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  listName: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3, color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold' },
  listMeta: { fontSize: 13, color: Colors.ink3, marginTop: 2, fontFamily: 'SchibstedGrotesk_400Regular' },
  listBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emojiRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 },
  emojiBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.inset,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  overflowBubble: { backgroundColor: Colors.line2 },
  overflowText: { fontSize: 11, fontWeight: '700', color: Colors.ink3, fontFamily: 'SchibstedGrotesk_700Bold' },
  savesPill: {
    marginLeft: 'auto',
    backgroundColor: Colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  savesText: { fontSize: 12, fontWeight: '700', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  emptyHint: { fontSize: 13, color: Colors.ink3, marginTop: 10, fontFamily: 'SchibstedGrotesk_400Regular' },

  // Where to save
  storesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    ...Shadows.card,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  storeRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.line },
  storeMonogram: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  storeMonogramText: { color: '#fff', fontWeight: '700', fontSize: 16, fontFamily: 'SchibstedGrotesk_700Bold' },
  storeName: { fontSize: 15, fontWeight: '700', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  storeItemCount: { fontSize: 12, color: Colors.ink3, marginTop: 1, fontFamily: 'SchibstedGrotesk_400Regular' },
  storeSaving: { fontSize: 15, fontWeight: '700', color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  storeChev: { fontSize: 20, color: Colors.ink3, marginLeft: 2 },
})
