import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'
import type { AuthMode } from '@/lib/types'

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

export function AuthScreen() {
  const { signUp, signIn } = useApp()
  const [mode, setMode] = useState<AuthMode>('signup')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
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
      setApiError(e.message || 'Something went wrong. Please try again.')
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
        <View style={s.wordmark}>
          <View style={s.dot} />
          <Text style={s.wordmarkText}>mitbringen</Text>
        </View>

        <View style={{ marginTop: 44 }}>
          <Text style={s.headline}>
            {isSignup ? 'Save money on\nevery shop' : 'Welcome back'}
          </Text>
          <Text style={s.sub}>
            {isSignup
              ? 'Track the cheapest prices in Vienna and watch your savings add up.'
              : 'Log in to pick up your list where you left off.'}
          </Text>
        </View>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerLabel}>sign in with email</Text>
          <View style={s.dividerLine} />
        </View>

        {/* Email */}
        <View style={{ gap: 10 }}>
          <TextInput
            style={[s.input, touched && !emailValid && s.inputError]}
            value={email} onChangeText={(v) => { setEmail(v); setApiError('') }}
            placeholder="you@email.com" placeholderTextColor={Colors.ink3}
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            returnKeyType="next"
          />

          {/* Password with show/hide */}
          <View style={s.pwWrap}>
            <TextInput
              style={[s.input, s.pwInput, touched && !pwValid && s.inputError]}
              value={pw} onChangeText={(v) => { setPw(v); setApiError('') }}
              placeholder="Password (min. 6 characters)" placeholderTextColor={Colors.ink3}
              secureTextEntry={!showPw}
              returnKeyType="done" onSubmitEditing={submit}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw((v) => !v)} activeOpacity={0.7}>
              <Text style={s.eyeIcon}>{showPw ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {touched && !valid && (
            <Text style={s.error}>
              {!emailValid ? 'Enter a valid email address.' : 'Password must be at least 6 characters.'}
            </Text>
          )}
          {apiError ? <Text style={s.error}>{apiError}</Text> : null}

          {!isSignup && (
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} activeOpacity={0.7}>
              <Text style={s.forgotPw}>Forgot password?</Text>
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
            : <Text style={[s.btnText, { color: '#fff' }]}>{isSignup ? 'Create account' : 'Log in'} →</Text>
          }
        </TouchableOpacity>
        {isSignup && (
          <Text style={s.legal}>
            By continuing you agree to our{' '}
            <Text style={{ color: Colors.ink2, fontWeight: '600' }}>Terms</Text>
            {' & '}
            <Text style={{ color: Colors.ink2, fontWeight: '600' }}>Privacy Policy</Text>.
          </Text>
        )}
        <Text style={s.toggle}>
          {isSignup ? 'Already have an account? ' : 'New to mitbringen? '}
          <Text style={{ color: Colors.green, fontWeight: '700' }} onPress={switchMode}>
            {isSignup ? 'Log in' : 'Create account'}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 20 },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: Colors.green },
  wordmarkText: { fontSize: 17, fontWeight: '700', letterSpacing: -0.5, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  headline: { fontSize: 31, fontWeight: '700', letterSpacing: -0.8, lineHeight: 36, color: Colors.ink, fontFamily: 'HankenGrotesk_700Bold' },
  sub: { fontSize: 15.5, color: Colors.ink2, lineHeight: 23, marginTop: 10, maxWidth: 300, fontFamily: 'HankenGrotesk_400Regular' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 28, marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.line },
  dividerLabel: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  btn: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  btnGreen: { backgroundColor: Colors.green, shadowColor: Colors.green, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { fontSize: 16, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  input: { height: 54, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.line2, backgroundColor: '#fff', paddingHorizontal: 16, fontSize: 16, color: Colors.ink, fontFamily: 'HankenGrotesk_400Regular' },
  inputError: { borderColor: Colors.danger },
  pwWrap: { position: 'relative' },
  pwInput: { paddingRight: 52 },
  eyeBtn: { position: 'absolute', right: 12, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', width: 38 },
  eyeIcon: { fontSize: 18 },
  forgotPw: { fontSize: 13, fontWeight: '600', color: Colors.green, fontFamily: 'HankenGrotesk_600SemiBold' },
  error: { fontSize: 12.5, color: Colors.danger, fontWeight: '600', fontFamily: 'HankenGrotesk_600SemiBold' },
  footer: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 10, gap: 8 },
  legal: { fontSize: 11.5, color: Colors.ink3, textAlign: 'center', lineHeight: 17, fontFamily: 'HankenGrotesk_400Regular' },
  toggle: { fontSize: 14, color: Colors.ink2, textAlign: 'center', marginTop: 4, fontFamily: 'HankenGrotesk_400Regular' },
})
