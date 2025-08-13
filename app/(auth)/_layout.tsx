import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ẩn header cho toàn bộ màn trong (auth)
      }}
    />
  );
}
