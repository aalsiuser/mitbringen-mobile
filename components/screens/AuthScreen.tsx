import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import { MitbringenWordmark } from '@/components/ui/MitbringenMark'
import type { AuthMode } from '@/lib/types'

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

export function AuthScreen() {
  const { signUp, signIn } = useApp()
  const { t } = useTranslation()
  const [mode, setMode] = useState<AuthMode>('signup')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const isSignup = mode === 'signup'
  const emailValid = emailOk(email)
  const pwValid = pw.length >= 6
  const valid = emailValid && pwValid

  const submit = async () => {
    setTouched(true)
    if (!valid) return
    setLoading(true)
    setApiError('')
    try {
      if (isSignup) {
        await signUp(email.trim(), pw)
      } else {
        await signIn(email.trim(), pw)
      }
    } catch (e: any) {
      setApiError(e.message || t('common.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup')
    setApiError('')
    setTouched(false)
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <MitbringenWordmark size={17} />

        <View style={{ marginTop: 44 }}>
          <Text style={s.headline}>
            {isSignup ? t('auth.headlineSignup') : t('auth.headlineLogin')}
          </Text>
          <Text style={s.sub}>
            {isSignup ? t('auth.subSignup') : t('auth.subLogin')}
          </Text>
        </View>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerLabel}>{t('auth.dividerEmail')}</Text>
          <View style={s.dividerLine} />
        </View>

        {/* Email */}
        <View style={{ gap: 10 }}>
          <TextInput
            style={[s.input, touched && !emailValid && s.inputError]}
            value={email} onChangeText={(v) => { setEmail(v); setApiError('') }}
            placeholder={t('auth.emailPlaceholder')} placeholderTextColor={Colors.ink3}
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            returnKeyType="next"
          />

          <TextInput
            style={[s.input, touched && !pwValid && s.inputError]}
            value={pw} onChangeText={(v) => { setPw(v); setApiError('') }}
            placeholder={t('auth.passwordPlaceholder')} placeholderTextColor={Colors.ink3}
            secureTextEntry
            returnKeyType="done" onSubmitEditing={submit}
          />

          {touched && !valid && (
            <Text style={s.error}>
              {!emailValid ? t('auth.errorEmail') : t('auth.errorPassword')}
            </Text>
          )}
          {apiError ? <Text style={s.error}>{apiError}</Text> : null}

          {!isSignup && (
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} activeOpacity={0.7}>
              <Text style={s.forgotPw}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, s.btnGreen, { opacity: valid && !loading ? 1 : 0.55 }]}
          onPress={submit}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={[s.btnText, { color: '#fff' }]}>{isSignup ? t('auth.ctaCreate') : t('auth.ctaLogin')} →</Text>
          }
        </TouchableOpacity>
        {isSignup && (
          <Text style={s.legal}>
            {t('auth.termsPrefix')}
            <Text style={{ color: Colors.ink2, fontWeight: '600' }}>{t('auth.terms')}</Text>
            {t('auth.and')}
            <Text style={{ color: Colors.ink2, fontWeight: '600' }}>{t('auth.privacy')}</Text>
            {t('auth.termsSuffix')}
          </Text>
        )}
        <Text style={s.toggle}>
          {isSignup ? t('auth.switchToLogin') : t('auth.switchToSignup')}
          <Text style={{ color: Colors.blue, fontWeight: '700' }} onPress={switchMode}>
            {isSignup ? t('auth.linkLogin') : t('auth.linkCreate')}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 20 },
  headline: { fontSize: 31, fontWeight: '700', letterSpacing: -0.8, lineHeight: 36, color: Colors.ink, fontFamily: 'SchibstedGrotesk_700Bold' },
  sub: { fontSize: 15.5, color: Colors.ink2, lineHeight: 23, marginTop: 10, maxWidth: 300, fontFamily: 'SchibstedGrotesk_400Regular' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 28, marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.line },
  dividerLabel: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },
  btn: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  btnGreen: { backgroundColor: Colors.blue, shadowColor: Colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { fontSize: 16, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },
  input: { height: 54, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.line2, backgroundColor: '#fff', paddingHorizontal: 16, fontSize: 16, color: Colors.ink, fontFamily: 'SchibstedGrotesk_400Regular' },
  inputError: { borderColor: Colors.danger },
  forgotPw: { fontSize: 13, fontWeight: '600', color: Colors.blue, fontFamily: 'SchibstedGrotesk_700Bold' },
  error: { fontSize: 12.5, color: Colors.danger, fontWeight: '600', fontFamily: 'SchibstedGrotesk_700Bold' },
  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10, gap: 8 },
  legal: { fontSize: 11.5, color: Colors.ink3, textAlign: 'center', lineHeight: 17, fontFamily: 'SchibstedGrotesk_400Regular' },
  toggle: { fontSize: 14, color: Colors.ink2, textAlign: 'center', marginTop: 4, fontFamily: 'SchibstedGrotesk_400Regular' },
})
