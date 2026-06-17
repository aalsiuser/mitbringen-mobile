import { useState, useRef, useEffect } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, Pressable, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { usersApi } from '@/lib/api'
import { setAppLang, fmtCurrency, type SupportedLang } from '@/lib/i18n'

// ── icons ────────────────────────────────────────────────────────────────────
import Svg, { Circle, Path } from 'react-native-svg'

function PersonIcon({ size = 20, color = Colors.ink2 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </Svg>
  )
}

function MailIcon({ size = 20, color = Colors.ink2 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Path d="M22 6l-10 7L2 6" />
    </Svg>
  )
}

function EditIcon({ size = 17, color = Colors.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  )
}

function LogOutIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <Path d="m16 16 4-4-4-4" />
      <Path d="M20 12H9" />
    </Svg>
  )
}

function SparkIcon({ size = 15, color = Colors.green }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </Svg>
  )
}

function XIcon({ size = 17, color = Colors.ink2 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  )
}

function GlobeIcon({ size = 19, color = Colors.ink2 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="9" />
      <Path d="M3 12h18" />
      <Path d="M12 3a14 14 0 0 1 0 18" />
      <Path d="M12 3a14 14 0 0 0 0 18" />
    </Svg>
  )
}

function CheckMarkIcon({ size = 18, color = Colors.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────
const eur = fmtCurrency

// ── Field row ─────────────────────────────────────────────────────────────────
function Field({
  icon, label, value, onPress,
}: { icon: 'person' | 'mail' | 'globe'; label: string; value: string; onPress: () => void }) {
  const IconCmp = icon === 'person' ? PersonIcon : icon === 'mail' ? MailIcon : GlobeIcon
  return (
    <TouchableOpacity style={s.prow} onPress={onPress} activeOpacity={0.7}>
      <View style={s.pico}>
        <IconCmp size={19} color={Colors.ink2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.plab}>{label}</Text>
        <Text style={s.pval} numberOfLines={1}>{value}</Text>
      </View>
      <EditIcon size={17} color={Colors.ink3} />
    </TouchableOpacity>
  )
}

// ── Language toggle (inline segmented control) ────────────────────────────────
function LangToggle({ current, onPick }: { current: SupportedLang; onPick: (l: SupportedLang) => void }) {
  const options: { code: SupportedLang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ]
  return (
    <View style={s.langToggleRow}>
      <View style={s.pico}>
        <SparkIcon size={19} color={Colors.ink2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.plab}>Language · Sprache</Text>
        <View style={s.langSegmented}>
          {options.map((opt) => {
            const active = current === opt.code
            return (
              <TouchableOpacity
                key={opt.code}
                style={[s.langSegment, active && s.langSegmentActive]}
                onPress={() => onPick(opt.code)}
                activeOpacity={0.85}
              >
                <Text style={[s.langSegmentText, active && s.langSegmentTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

// ── Edit sheet ────────────────────────────────────────────────────────────────
type EditField = { key: 'name' | 'email'; title: string; label: string; placeholder: string; type: 'default' | 'email-address' }

function EditSheet({
  field, initialValue, onSave, onClose,
}: { field: EditField; initialValue: string; onSave: (v: string) => Promise<void>; onClose: () => void }) {
  const { t } = useTranslation()
  const [val, setVal] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<TextInput>(null)

  useEffect(() => { setTimeout(() => ref.current?.focus(), 90) }, [])

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val.trim())
  const valid = field.key === 'email' ? emailValid : val.trim().length > 0

  const submit = async () => {
    if (!valid || saving) return
    setSaving(true)
    setError('')
    try {
      await onSave(val.trim())
      onClose()
    } catch (e: any) {
      setError(e.message || t('common.errorGeneric'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Pressable style={s.sheetBack} onPress={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={s.sheetTitle}>{field.title}</Text>
            <TouchableOpacity style={s.sheetClose} onPress={onClose}>
              <XIcon size={17} color={Colors.ink2} />
            </TouchableOpacity>
          </View>
          <Text style={s.eyebrow}>{field.label}</Text>
          <TextInput
            ref={ref}
            style={s.sfield}
            value={val}
            onChangeText={setVal}
            placeholder={field.placeholder}
            placeholderTextColor={Colors.ink3}
            keyboardType={field.type === 'email-address' ? 'email-address' : 'default'}
            autoCapitalize={field.key === 'name' ? 'words' : 'none'}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          {field.key === 'email' && val.trim().length > 0 && !emailValid && (
            <Text style={s.fieldError}>{t('profile.errorEmail')}</Text>
          )}
          {error ? <Text style={s.fieldError}>{error}</Text> : null}
          <TouchableOpacity
            style={[s.btn, { opacity: valid ? 1 : 0.45 }]}
            onPress={submit}
            activeOpacity={0.8}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>{t('profile.saveChanges')}</Text>}
          </TouchableOpacity>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  )
}

// ── Sign-out confirmation ─────────────────────────────────────────────────────
function ConfirmSheet({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <Pressable style={s.sheetBack} onPress={onClose}>
      <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
        <View style={s.coralBox}>
          <LogOutIcon size={24} color={Colors.coral} />
        </View>
        <Text style={[s.sheetTitle, { marginTop: 15 }]}>{t('profile.signOutTitle')}</Text>
        <Text style={s.sheetSub}>{t('profile.signOutSub')}</Text>
        <TouchableOpacity style={[s.btn, s.btnCoral]} onPress={onConfirm} activeOpacity={0.8}>
          <LogOutIcon size={19} color="#fff" />
          <Text style={s.btnText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
          <Text style={s.cancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { user, saved, signOut, updateProfile } = useApp()
  const { t, i18n } = useTranslation()
  const [editing, setEditing] = useState<EditField | null>(null)
  const [confirmOut, setConfirmOut] = useState(false)
  const [localEmail, setLocalEmail] = useState<string | null>(null)
  const [localName, setLocalName] = useState<string | null>(null)

  // Fetch fresh user data on mount in case context hasn't loaded it yet
  useEffect(() => {
    usersApi.me().then((me) => {
      setLocalEmail(me.email)
      setLocalName(me.name)
    }).catch(() => {})
  }, [])

  const displayEmail = localEmail ?? user?.email ?? ''
  const displayName = localName ?? user?.name ?? ''
  const initial = displayName.trim()[0]?.toUpperCase() || displayEmail[0]?.toUpperCase() || '?'
  const currentLang: SupportedLang = (i18n.language?.startsWith('de') ? 'de' : 'en')

  const editName = () => setEditing({ key: 'name', title: t('profile.editNameTitle'), label: t('profile.yourNameLabel'), placeholder: t('profile.nameInputPlaceholder'), type: 'default' })
  const editEmail = () => setEditing({ key: 'email', title: t('profile.editEmailTitle'), label: t('profile.emailAddressLabel'), placeholder: t('profile.emailInputPlaceholder'), type: 'email-address' })

  const saveField = async (value: string) => {
    await updateProfile({ [editing!.key]: value })
    if (editing!.key === 'name') setLocalName(value)
    if (editing!.key === 'email') setLocalEmail(value)
  }

  const handleSignOut = async () => {
    setConfirmOut(false)
    await signOut()
  }

  const pickLang = async (l: SupportedLang) => {
    await setAppLang(l)
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* avatar card */}
        <View style={[s.card, { padding: 26, alignItems: 'center' }]}>
          <LinearGradient
            colors={['#2f6bff', '#1748d8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.avatar}
          >
            <Text style={s.avatarText}>{initial}</Text>
          </LinearGradient>
          <Text style={s.profileName}>{displayName || displayEmail.split('@')[0] || ''}</Text>
          <Text style={s.profileEmail}>{displayEmail}</Text>
          <View style={s.savedPill}>
            <SparkIcon size={14} color={Colors.green} />
            <Text style={s.savedPillText}>{t('profile.savedWith', { amount: eur(saved) })}</Text>
          </View>
        </View>

        {/* account section */}
        <Text style={s.secLabel}>{t('profile.account')}</Text>
        <View style={[s.card, { padding: 3 }]}>
          <Field icon="person" label={t('profile.name')} value={displayName || '—'} onPress={editName} />
          <View style={s.divider} />
          <Field icon="mail" label={t('profile.email')} value={displayEmail} onPress={editEmail} />
        </View>

        {/* preferences section */}
        <Text style={s.secLabel}>{t('profile.preferences')}</Text>
        <View style={[s.card, { padding: 4 }]}>
          <LangToggle current={currentLang} onPick={pickLang} />
        </View>

        {/* sign out */}
        <TouchableOpacity style={s.signoutBtn} onPress={() => setConfirmOut(true)} activeOpacity={0.8} >
          <LogOutIcon size={18} color={Colors.coral} />
          <Text style={s.signoutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* edit sheet */}

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        {editing && (
          <EditSheet
            field={editing}
            initialValue={editing.key === 'name' ? displayName : displayEmail}
            onSave={saveField}
            onClose={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* confirm sign-out sheet */}
      <Modal visible={confirmOut} transparent animationType="fade" onRequestClose={() => setConfirmOut(false)}>
        <ConfirmSheet onConfirm={handleSignOut} onClose={() => setConfirmOut(false)} />
      </Modal>
    </SafeAreaView>
  )
}

// ── styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 16, paddingTop: 8, gap: 0 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: '#1a2540',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 8,
  },

  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarText: { fontSize: 33, fontWeight: '800', color: '#fff', fontFamily: 'SchibstedGrotesk_800ExtraBold' },

  profileName: {
    fontSize: 22, fontWeight: '800', letterSpacing: -0.5,
    color: Colors.ink, marginTop: 15,
    fontFamily: 'SchibstedGrotesk_800ExtraBold',
  },
  profileEmail: {
    fontSize: 13.5, fontWeight: '600', color: Colors.ink2, marginTop: 3,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },
  savedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 16, backgroundColor: Colors.greenSoft,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
  },
  savedPillText: {
    fontSize: 13, fontWeight: '700', color: Colors.green,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },

  secLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.ink2,
    letterSpacing: 0.3, marginBottom: 8, marginTop: 8, marginLeft: 4,
    fontFamily: 'SchibstedGrotesk_700Bold', textTransform: 'uppercase',
  },

  prow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  pico: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.inset,
    alignItems: 'center', justifyContent: 'center',
  },
  plab: { fontSize: 11.5, fontWeight: '600', color: Colors.ink3, fontFamily: 'SchibstedGrotesk_500Medium' },
  pval: { fontSize: 15, fontWeight: '600', color: Colors.ink, marginTop: 1, fontFamily: 'SchibstedGrotesk_700Bold' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.line, marginLeft: 68 },

  signoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 16, paddingVertical: 15, borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  signoutText: { fontSize: 15, fontWeight: '700', color: Colors.coral, fontFamily: 'SchibstedGrotesk_700Bold' },

  // sheet
  sheetBack: {
    flex: 1, backgroundColor: 'rgba(13,18,32,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4, color: Colors.ink, fontFamily: 'SchibstedGrotesk_800ExtraBold' },
  sheetSub: { fontSize: 14, fontWeight: '500', color: Colors.ink2, marginTop: 6, lineHeight: 21, fontFamily: 'SchibstedGrotesk_400Regular' },
  sheetClose: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.inset, alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.5,
    textTransform: 'uppercase', marginTop: 20, marginBottom: 8,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  sfield: {
    height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.line2,
    paddingHorizontal: 16, fontSize: 15, fontWeight: '600',
    color: Colors.ink, backgroundColor: Colors.inset,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  fieldError: { fontSize: 12.5, fontWeight: '600', color: Colors.coral, marginTop: 8, fontFamily: 'SchibstedGrotesk_500Medium' },
  btn: {
    height: 54, borderRadius: 16, backgroundColor: Colors.blue,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    marginTop: 18,
    shadowColor: Colors.blue, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20,
    elevation: 4,
  },
  btnCoral: { backgroundColor: Colors.coral, shadowColor: Colors.coral },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'SchibstedGrotesk_700Bold' },

  coralBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.coralSoft, alignItems: 'center', justifyContent: 'center',
  },
  cancelBtn: { height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  cancelText: { fontSize: 15, fontWeight: '700', color: Colors.ink2, fontFamily: 'SchibstedGrotesk_700Bold' },

  // Inline language toggle (Preferences card)
  langToggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    padding: 14,
  },
  langSegmented: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  langSegment: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.inset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langSegmentActive: {
    backgroundColor: Colors.blue,
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  langSegmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ink2,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  langSegmentTextActive: { color: '#fff' },
})
