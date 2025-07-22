import { useAuthStore } from '@/store/auth';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  console.log(isLoggedIn)

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ẩn header cho toàn bộ màn trong (auth)
      }}
    />
  );
}
