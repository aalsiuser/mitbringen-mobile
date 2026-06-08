import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import { useApp } from '@/lib/AppContext'

function ListIcon({ color, count }: { color: string; count: number }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      {count > 0 && (
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
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.ink3,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <ListIcon color={color as string} count={items.length} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.appBg,
    borderTopColor: Colors.line,
    borderTopWidth: 1,
    paddingTop: 8,
    height: 64,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  badge: {
    position: 'absolute', top: -4, right: -8,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.green,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3, borderWidth: 2, borderColor: Colors.appBg,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
})
