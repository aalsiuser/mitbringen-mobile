import { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { productsApi } from '@/lib/api'
import type { ApiProduct, ListItem } from '@/lib/types'

const STORE_COLORS: Record<string, string> = {
  hofer:      Colors.store.hofer,
  lidl:       Colors.store.lidl,
  spar:       Colors.store.spar,
  billa:      Colors.store.billa,
  billa_plus: Colors.store.billa_plus,
}

const fmt = (n: number | null | undefined) => n != null ? '€' + n.toFixed(2) : '—'

export default function ListTab() {
  const { listName, items, addItem, removeItem } = useApp()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<ApiProduct[]>([])
  const [searching, setSearching] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await productsApi.search(q.trim())
        setResults(data)
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  const handleAdd = useCallback(async (p: ApiProduct) => {
    if (adding) return
    setAdding(p.name)
    setQ('')
    setResults([])
    try {
      await addItem(p)
    } finally {
      setAdding(null)
    }
  }, [addItem, adding])

  const totalPromo   = items.reduce((s, i) => s + (i.best_price?.promo_price ?? 0), 0)
  const totalRegular = items.reduce((s, i) => s + (i.best_price?.regular_price ?? i.best_price?.promo_price ?? 0), 0)
  const totalSaving  = Math.max(0, totalRegular - totalPromo)

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.listName}>{listName}</Text>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Text style={{ fontSize: 18, color: focused ? Colors.blue : Colors.ink3 }}>⌕</Text>
          <TextInput
            style={s.searchInput}
            value={q}
            onChangeText={setQ}
            placeholder='Add an item — "Milch", "Käse"…'
            placeholderTextColor={Colors.ink3}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            returnKeyType="done"
            onSubmitEditing={() => results[0] && handleAdd(results[0])}
          />
          {searching && <ActivityIndicator size="small" color={Colors.blue} />}
        </View>

        {focused && results.length > 0 && (
          <View style={s.dropdown}>
            {results.slice(0, 6).map((p, i) => (
              <TouchableOpacity
                key={`${p.supermarket}-${p.name}`}
                onPress={() => handleAdd(p)}
                style={[s.dropdownRow, i < Math.min(results.length, 6) - 1 && s.dropdownBorder]}
                activeOpacity={0.7}
              >
                <View style={[s.storeDot, { backgroundColor: STORE_COLORS[p.supermarket] ?? Colors.ink3 }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.dropdownName}>{p.name}</Text>
                  <Text style={s.dropdownMeta}>{p.unit ? `${p.unit} · ` : ''}{p.supermarket_name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.dropdownPrice}>{fmt(p.promo_price)}</Text>
                  {p.regular_price != null && (
                    <Text style={s.dropdownRegular}>{fmt(p.regular_price)}</Text>
                  )}
                </View>
                <Text style={s.dropdownPlus}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* List items */}
      {items.length === 0 ? (
        <View style={s.emptyState}>
          <View style={s.emptyIcon}>
            <Text style={{ fontSize: 28, color: '#fff' }}>☰</Text>
          </View>
          <Text style={s.emptyTitle}>Your list is empty</Text>
          <Text style={s.emptySub}>Search above to add items at their{'\n'}cheapest Vienna price.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 18, paddingBottom: 8, gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ItemRow item={item} onRemove={removeItem} />}
        />
      )}

      {/* Savings footer */}
      {items.length > 0 && (
        <View style={s.savingsFooter}>
          <View style={s.savingsCard}>
            <View style={s.savingsRow}>
              <View>
                <Text style={s.savingsEyebrow}>You'll save</Text>
                <Text style={s.savingsAmount}>{fmt(totalSaving)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.totalLabel}>Basket total</Text>
                <Text style={s.totalAmount}>{fmt(totalPromo)}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.findBtn} onPress={() => router.push('/store-rec')} activeOpacity={0.85}>
              <Text style={s.findBtnText}>📍 Find where to shop</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

function ItemRow({ item, onRemove }: { item: ListItem; onRemove: (id: number) => Promise<void> }) {
  const bp = item.best_price
  const color = STORE_COLORS[bp?.supermarket ?? ''] ?? Colors.ink3

  return (
    <View style={s.itemRow}>
      <View style={s.itemTile}>
        <Text style={s.itemTileLetter}>{item.name[0].toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={s.itemMeta}>
          {bp ? (
            <>
              <View style={[s.storeDot, { backgroundColor: color }]} />
              <Text style={s.itemUnit}>{bp.unit ? `${bp.unit} · ` : ''}{bp.supermarket_name}</Text>
            </>
          ) : (
            <Text style={s.itemUnit}>No price found this week</Text>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
        <Text style={s.itemPromo}>{fmt(bp?.promo_price)}</Text>
        {bp?.regular_price ? (
          <Text style={s.itemRegular}>{fmt(bp.regular_price)}</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)} style={s.trashBtn} activeOpacity={0.7}>
        <Text style={{ fontSize: 16, color: Colors.ink3 }}>🗑</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },
  listName: { fontSize: 21, fontWeight: '800', letterSpacing: -0.4, color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold' },

  searchWrap: { paddingHorizontal: 18, marginTop: 10, zIndex: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    ...Shadows.card,
  },
  searchBarFocused: { borderWidth: 2, borderColor: Colors.blue },
  searchInput: { flex: 1, fontSize: 15, color: Colors.ink, fontFamily: 'SchibstedGrotesk_400Regular' },

  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 56,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
    zIndex: 30,
    ...Shadows.pop,
  },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  dropdownBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.line },
  storeDot: { width: 8, height: 8, borderRadius: 999 },
  dropdownName: { fontSize: 15, fontWeight: '600', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  dropdownMeta: { fontSize: 12.5, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },
  dropdownPrice: { fontSize: 15, fontWeight: '700', color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', lineHeight: 18, fontVariant: ['tabular-nums'] as any },
  dropdownRegular: { fontSize: 11.5, color: Colors.ink3, textDecorationLine: 'line-through', fontFamily: 'SchibstedGrotesk_400Regular' },
  dropdownPlus: { fontSize: 18, color: Colors.blue, marginLeft: 4, fontWeight: '700' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 16, fontSize: 15, fontWeight: '700', color: Colors.ink2, fontFamily: 'SchibstedGrotesk_700Bold' },
  emptySub: { marginTop: 4, fontSize: 13.5, color: Colors.ink3, textAlign: 'center', fontFamily: 'SchibstedGrotesk_400Regular' },

  itemRow: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.card,
  },
  itemTile: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.inset, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemTileLetter: { fontSize: 16, fontWeight: '700', color: Colors.ink2, fontFamily: 'SchibstedGrotesk_700Bold' },
  itemName: { fontSize: 15, fontWeight: '600', color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3 },
  itemUnit: { fontSize: 12.5, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },
  itemPromo: { fontSize: 15, fontWeight: '800', color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold', fontVariant: ['tabular-nums'] as any },
  itemRegular: { fontSize: 12, color: Colors.ink3, textDecorationLine: 'line-through', fontFamily: 'SchibstedGrotesk_400Regular' },
  trashBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  savingsFooter: { paddingHorizontal: 18, paddingBottom: 16, paddingTop: 10 },
  savingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    ...Shadows.cardMd,
  },
  savingsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  savingsEyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.green, fontFamily: 'SchibstedGrotesk_700Bold' },
  savingsAmount: { fontSize: 34, fontWeight: '800', color: Colors.green, fontFamily: 'SchibstedGrotesk_800ExtraBold', letterSpacing: -1, fontVariant: ['tabular-nums'] as any },
  totalLabel: { fontSize: 12, color: Colors.ink3, fontFamily: 'SchibstedGrotesk_400Regular' },
  totalAmount: { fontSize: 18, fontWeight: '700', marginTop: 4, color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold', fontVariant: ['tabular-nums'] as any },
  findBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: 15,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  findBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },
})
