import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fmtCurrency } from '@/lib/i18n'
import type { GratisDeal } from '@/lib/types'

const GRATIS_GREEN = '#1f8a5b'
const GRATIS_BG    = '#eaf6ef'
const GRATIS_LINE  = '#bfe3cd'
const GRATIS_INK   = '#177349'
const GRATIS_INK2  = '#5ba17e'

export function GratisBadge({ g, scale = 1 }: { g: GratisDeal; scale?: number }) {
  const { t } = useTranslation()
  return (
    <View style={[gs.badge, {
      gap: 4 * scale,
      borderRadius: 7 * scale,
      paddingHorizontal: 8 * scale,
      paddingVertical: 4 * scale,
    }]}>
      <Text style={[gs.badgeLabel, { fontSize: 13 * scale }]}>{g.label}</Text>
      <Text style={[gs.badgeGratis, { fontSize: 9.5 * scale }]}>{t('list.gratisFree')}</Text>
    </View>
  )
}

/** Full-width strip used in the search dropdown for gratis items. */
export function GratisStrip({ g }: { g: GratisDeal }) {
  const { t } = useTranslation()
  return (
    <View style={gs.strip}>
      <GratisBadge g={g} />
      <View style={gs.stripBody}>
        <View>
          <Text style={gs.stripPrimary}>{t('list.gratisFromUnits', { count: g.min_qty, unit: g.unit_name })}</Text>
          <Text style={gs.stripSecondary}>{t('list.gratisDealPricePer', { unit: g.unit_name })}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={gs.stripPrice}>{fmtCurrency(g.bulk_price)}</Text>
          <Text style={gs.stripSingle}>
            {t('list.gratisOneUnit', { unit: g.unit_name })}{' '}
            <Text style={gs.stripSingleStrike}>{fmtCurrency(g.single)}</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

/** Compact two-line treatment used in the item row's right column. */
export function GratisRowSummary({ g }: { g: GratisDeal }) {
  const { t } = useTranslation()
  return (
    <View style={{ alignItems: 'flex-end', gap: 3 }}>
      <GratisBadge g={g} scale={0.82} />
      <Text style={gs.rowSummaryText}>
        {t('list.gratisRowSummary', { count: g.min_qty, price: fmtCurrency(g.bulk_price) })}
      </Text>
    </View>
  )
}

const gs = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRATIS_GREEN,
    alignSelf: 'flex-start',
    shadowColor: GRATIS_GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.32,
    shadowRadius: 7,
    elevation: 2,
  },
  badgeLabel: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: -0.2,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  badgeGratis: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.6,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },

  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 9,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: GRATIS_BG,
    borderWidth: 1,
    borderColor: GRATIS_LINE,
  },
  stripBody: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stripPrimary: {
    fontSize: 12.5,
    fontWeight: '800',
    color: GRATIS_INK,
    letterSpacing: -0.13,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  stripSecondary: {
    fontSize: 10.5,
    fontWeight: '600',
    color: GRATIS_INK2,
    marginTop: 1,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },
  stripPrice: {
    fontWeight: '900',
    fontSize: 19,
    color: GRATIS_GREEN,
    fontVariant: ['tabular-nums'] as any,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  stripSingle: {
    fontSize: 11.5,
    fontWeight: '600',
    fontVariant: ['tabular-nums'] as any,
    fontFamily: 'SchibstedGrotesk_500Medium',
    color: '#9aa3b2',
    marginTop: 2,
  },
  stripSingleStrike: {
    textDecorationLine: 'line-through',
  },

  rowSummaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9aa3b2',
    fontVariant: ['tabular-nums'] as any,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },
})
