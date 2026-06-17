import { Tabs, Redirect } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Svg, { Path, Circle } from 'react-native-svg'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <Path d="M9 21V12h6v9" />
    </Svg>
  )
}

function ListIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </Svg>
  )
}

function ChatIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </Svg>
  )
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </Svg>
  )
}

function TabIcon({ Icon, color, count }: { Icon: React.ComponentType<{ color: string }>; color: string; count?: number }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}>
      <Icon color={color} />
      {(count ?? 0) > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  )
}

export default function TabsLayout() {
  const { items, phase } = useApp()
  const { t } = useTranslation()

  if (phase !== 'app') return <Redirect href="/" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.ink3,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <TabIcon Icon={HomeIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: t('tabs.lists'),
          tabBarIcon: ({ color }) => <TabIcon Icon={ListIcon} color={color} count={items.length} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: t('tabs.assistant'),
          tabBarIcon: ({ color }) => <TabIcon Icon={ChatIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <TabIcon Icon={ProfileIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{ href: null }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
    height: 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
})
