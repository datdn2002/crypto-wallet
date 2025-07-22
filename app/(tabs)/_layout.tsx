import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  Compass,
  DollarSign,
  Home,
  Repeat,
  TrendingUp,
} from 'react-native-feather';

import { useAppInit } from '@/hooks';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isReady = useAppInit();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#3A89FF', // Màu nền tab
          height: 70,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarIconStyle: { marginTop: 8 },
        tabBarIcon: ({ color, focused }) => {
          const IconMap: Record<string, React.ReactNode> = {
            index: <Home color={color} />,
            trending: <TrendingUp color={color} />,
            swap: <Repeat color={color} />,
            explore: <Compass color={color} />,
            earn: <DollarSign color={color} />,
          };

          return (
            <View style={{ alignItems: 'center' }}>
              {IconMap[route.name]}
              {focused && (
                <View
                  style={{
                    height: 4,
                    width: '100%',
                    backgroundColor: 'black',
                    marginTop: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="trending" options={{ title: 'Thịnh hành' }} />
      <Tabs.Screen name="swap" options={{ title: 'Hoán đổi' }} />
      <Tabs.Screen name="explore" options={{ title: 'Khám phá' }} />
      <Tabs.Screen name="earn" options={{ title: 'Earn' }} />
    </Tabs>
  );
}
