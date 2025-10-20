# Hướng dẫn Build APK cho Android

## 🚀 Bắt đầu nhanh (Quick Start)

Nếu bạn đã có tài khoản Expo và muốn build ngay:

```bash
# 1. Cài đặt EAS CLI (nếu chưa có)
npm install -g eas-cli

# 2. Đăng nhập
eas login

# 3. Build APK (khuyến nghị dùng preview cho test)
eas build --platform android --profile preview

# Hoặc build production
eas build --platform android --profile production
```

**Lưu ý**: File `eas.json` đã được cấu hình để build file **.apk** (không phải .aab), phù hợp cho việc test trực tiếp trên máy Android.

---

## 📝 Hướng dẫn chi tiết

### 1. Cài đặt EAS CLI
```bash
npm install -g eas-cli
```

### 2. Đăng nhập Expo
```bash
eas login
```

Nhập email và password của tài khoản Expo. Nếu chưa có tài khoản, đăng ký tại: https://expo.dev/signup

### 3. Build APK

#### Option 1: Build preview (khuyến nghị cho test) ⭐
Build nhanh hơn, phù hợp để test app:
```bash
eas build --platform android --profile preview
```

#### Option 2: Build production
Build version chính thức:
```bash
eas build --platform android --profile production
```

#### Option 3: Build local
Build trên máy của bạn (cần cài Android Studio và Android SDK):
```bash
eas build --platform android --profile preview --local
```

### 4. Tải APK và cài đặt

Sau khi build xong (~5-15 phút), bạn sẽ nhận được:
- ✅ Link download file APK
- 📱 Hoặc quét QR code để tải trực tiếp về điện thoại

**Cách cài đặt:**
1. Tải file APK về điện thoại Android
2. Vào **Settings > Security** và bật **"Install from Unknown Sources"** (hoặc "Cho phép cài đặt từ nguồn không xác định")
3. Mở file APK và nhấn Install

## Xử lý lỗi "Gradle build failed"

### Nguyên nhân phổ biến:

1. **Thiếu cấu hình splash screen cho Android**
   - ✅ Đã được fix trong `app.json`

2. **Vấn đề với native modules**
   - Kiểm tra các dependencies có native code trong `package.json`
   - Một số thư viện có thể cần cấu hình thêm

3. **Vấn đề với Gradle hoặc Android SDK**

### Giải pháp chi tiết:

#### 1. Xem logs chi tiết
Truy cập link logs trong thông báo lỗi để xem chi tiết:
```
https://expo.dev/accounts/easyai/projects/easyai-wallet/builds/[build-id]
```

#### 2. Clear cache và rebuild
```bash
# Clear npm cache
npm cache clean --force

# Xóa node_modules và reinstall
rm -rf node_modules
npm install

# Build lại
eas build --platform android --profile production --clear-cache
```

#### 3. Build với profile preview thay vì production
Profile preview có cấu hình đơn giản hơn:
```bash
eas build --platform android --profile preview
```

#### 4. Thử build local để debug
Build local sẽ cho bạn xem lỗi chi tiết hơn:
```bash
eas build --platform android --profile production --local
```

#### 5. Kiểm tra dependencies có vấn đề

Các thư viện có native code trong dự án:
- `@trustwallet/wallet-core` - Có thể cần cấu hình Android native
- `expo-camera`
- `expo-local-authentication`
- `react-native-qrcode-svg`
- `react-native-svg`

### Thử với cấu hình đơn giản hơn

Nếu vẫn gặp lỗi, tạo profile mới trong `eas.json`:

```json
{
  "build": {
    "simple": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Sau đó build:
```bash
eas build --platform android --profile simple
```

## Lưu ý quan trọng

1. **Expo SDK 54**: Đảm bảo tất cả dependencies tương thích với Expo SDK 54
2. **New Architecture**: Dự án đang bật `newArchEnabled: true`, có thể tắt nếu gặp vấn đề:
   ```json
   "newArchEnabled": false
   ```
3. **Trust Wallet Core**: Thư viện này khá phức tạp, có thể cần cấu hình native thêm

## Build thành công?

Sau khi build xong, bạn sẽ nhận được:
- Link download file APK
- File APK có thể cài trực tiếp lên điện thoại Android

## Cài đặt APK

1. Tải file APK từ link EAS Build cung cấp
2. Chuyển file sang điện thoại Android
3. Bật "Install from Unknown Sources" trong Settings
4. Mở file APK và cài đặt

## Cần hỗ trợ thêm?

Kiểm tra logs chi tiết tại:
- EAS Build Dashboard: https://expo.dev/accounts/easyai/projects/easyai-wallet/builds
- Expo documentation: https://docs.expo.dev/build/setup/


