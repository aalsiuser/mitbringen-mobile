import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'

function TabIcon({ label, icon, color, count }: { label: string; icon: string; color: string; count?: number }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}>
      <Text style={{ fontSize: 20, color }}>{icon}</Text>
      {(count ?? 0) > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  )
}

export default function TabsLayout() {
  const { items } = useApp()

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
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon label="Home" icon="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <TabIcon label="Lists" icon="☰" color={color} count={items.length} />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Deals',
          tabBarIcon: ({ color }) => <TabIcon label="Deals" icon="%" color={color} />,
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon label="Profile" icon="◉" color={color} />,
          href: null,
        }}
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
