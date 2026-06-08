import { Link, Stack } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={s.container}>
        <Text style={s.title}>This screen doesn't exist.</Text>
        <Link href="/" style={s.link}><Text style={s.linkText}>Go to home screen</Text></Link>
      </View>
    </>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: Colors.appBg },
  title: { fontSize: 20, fontWeight: '600', color: Colors.ink },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14, color: Colors.green },
})
