// src/polyfills.ts
import 'react-native-get-random-values'; // thêm crypto.getRandomValues cho RN
import 'react-native-url-polyfill/auto'; // (tùy chọn) URL, URLSearchParams,...

// Fallback phòng trường hợp môi trường vẫn chưa có getRandomValues
import * as Random from 'expo-random';

const g: any = globalThis as any;
if (!g.crypto) g.crypto = {};
if (typeof g.crypto.getRandomValues !== 'function') {
  g.crypto.getRandomValues = (typedArray: Uint8Array) => {
    const bytes = Random.getRandomBytes(typedArray.length); // đồng bộ
    typedArray.set(bytes);
    return typedArray;
  };
}
