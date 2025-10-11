# Hướng dẫn Deploy ứng dụng Crypto Wallet lên iOS với Xcode

## 📋 Mục lục
1. [Yêu cầu trước khi bắt đầu](#yêu-cầu-trước-khi-bắt-đầu)
2. [Setup môi trường](#setup-môi-trường)
3. [Cấu hình Apple Developer Account](#cấu-hình-apple-developer-account)
4. [Generate Native iOS Project](#generate-native-ios-project)
5. [Cấu hình Xcode Project](#cấu-hình-xcode-project)
6. [Certificates và Provisioning Profiles](#certificates-và-provisioning-profiles)
7. [Build và Archive](#build-và-archive)
8. [Export IPA File](#export-ipa-file)
9. [Troubleshooting](#troubleshooting)

---

## Yêu cầu trước khi bắt đầu

### 1. Môi trường phát triển
- macOS 13.0+ (Ventura hoặc mới hơn)
- Xcode 15.0+
- Node.js 18+
- CocoaPods: `sudo gem install cocoapods`
- Expo CLI: `npm install -g expo-cli`
- iPhone/iPad thật (để test trên device) hoặc Simulator

### 2. Apple Developer Account
- **Apple Developer Program**: $99/năm
- Đăng ký tại: https://developer.apple.com/programs/
- Chờ approval (thường 24-48 giờ)
- ⚠️ **Lưu ý**: Cần tài khoản trả phí để deploy lên device thật và App Store

### 3. Kiểm tra dependencies
```bash
# Cài đặt dependencies
npm install

# Kiểm tra versions
node --version      # >= 18.x
npx expo --version
xcodebuild -version # Xcode version
pod --version       # CocoaPods version
```

### 4. Cập nhật macOS và Xcode
```bash
# Update Xcode từ App Store
# Hoặc download từ: https://developer.apple.com/download/

# Install command line tools
xcode-select --install

# Verify installation
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

---

## Setup môi trường

### 1. Install CocoaPods
```bash
# Install CocoaPods
sudo gem install cocoapods

# Update CocoaPods
sudo gem update cocoapods

# Verify
pod --version
```

### 2. Setup Fastlane (Optional nhưng khuyến nghị)
```bash
# Install Fastlane
sudo gem install fastlane -NV

# Verify
fastlane --version
```

### 3. Cài đặt iOS Simulators
```bash
# Mở Xcode
# Xcode > Settings (Cmd+,) > Platforms
# Download iOS Simulators cần thiết

# List available simulators
xcrun simctl list devices
```

---

## Cấu hình Apple Developer Account

### 1. Đăng ký Apple Developer Program

#### Bước 1: Tạo Apple ID
1. Truy cập https://appleid.apple.com/
2. Tạo Apple ID nếu chưa có
3. Enable Two-Factor Authentication (bắt buộc)

#### Bước 2: Enroll in Apple Developer Program
1. Vào https://developer.apple.com/programs/enroll/
2. Sign in với Apple ID
3. Chọn **Entity Type**:
   - **Individual**: Cá nhân
   - **Organization**: Công ty (cần thêm DUNS number)
4. Điền thông tin cá nhân/công ty
5. Thanh toán $99/năm
6. Chờ approval (24-48 giờ)

### 2. Tạo App ID

#### Bước 1: Truy cập Developer Portal
1. Vào https://developer.apple.com/account/
2. Sign in với Apple Developer Account
3. Vào **Certificates, Identifiers & Profiles**

#### Bước 2: Tạo App Identifier
1. Click **Identifiers** > **+** (nút plus)
2. Chọn **App IDs** > **Continue**
3. Chọn **App** > **Continue**
4. Điền thông tin:
   ```
   Description: EasyAI Wallet
   Bundle ID: Explicit
   Bundle ID: com.easyai.wallet (phải match với app.json)
   ```

#### Bước 3: Enable Capabilities
Select các capabilities cần thiết:
- ✅ **Associated Domains** (nếu có deep linking)
- ✅ **Push Notifications** (nếu có notifications)
- ✅ **Sign In with Apple** (nếu dùng Apple Sign In)
- ✅ **Wallet** (nếu có Apple Wallet integration)

Click **Continue** > **Register**

### 3. Add Devices (cho Development)

#### Bước 1: Lấy UDID của device
```bash
# Connect iPhone/iPad qua USB
# Mở Xcode > Window > Devices and Simulators
# Chọn device > Copy Identifier (UDID)

# Hoặc dùng terminal
system_profiler SPUSBDataType | grep "Serial Number" | awk '{print $3}'
```

#### Bước 2: Register device
1. Developer Portal > **Devices** > **+**
2. Chọn platform: **iOS**
3. Điền:
   ```
   Device Name: iPhone 14 Pro (tên bất kỳ)
   Device ID (UDID): [paste UDID]
   ```
4. Click **Continue** > **Register**

---

## Generate Native iOS Project

### Option 1: Với Expo Prebuild (Khuyến nghị cho Expo projects)

```bash
# Generate iOS native folder
npx expo prebuild --platform ios

# Sẽ tạo folder ios/ với Xcode project
```

### Option 2: Với EAS Build
```bash
# Build trên EAS cloud và download
eas build --platform ios --profile production --local
```

### 3. Install iOS Dependencies
```bash
# Navigate to ios folder
cd ios

# Install pods
pod install

# Quay lại root
cd ..
```

⚠️ **Lưu ý**: Sau khi chạy `pod install`, luôn mở file `.xcworkspace` chứ không phải `.xcodeproj`

---

## Cấu hình Xcode Project

### 1. Mở Project trong Xcode
```bash
# Mở workspace (KHÔNG mở .xcodeproj)
open ios/EasyAIWallet.xcworkspace

# Hoặc
cd ios
xed .  # Open current directory in Xcode
```

### 2. Cấu hình Project Settings

#### General Tab
1. Select project trong Navigator (ở trái)
2. Select target **EasyAIWallet**
3. Tab **General**:

```
Display Name: EasyAI Wallet
Bundle Identifier: com.easyai.wallet
Version: 1.0.0
Build: 1

Deployment Info:
  iOS: 13.0 (hoặc minimum bạn muốn support)
  iPhone
  iPad (nếu support)
  
Device Orientation:
  ✅ Portrait
  ☐ Upside Down
  ☐ Landscape Left
  ☐ Landscape Right
```

#### Signing & Capabilities Tab
1. **Automatically manage signing**: ✅ (khuyến nghị cho dễ)
2. **Team**: Chọn Apple Developer Team
3. **Provisioning Profile**: Automatic
4. **Signing Certificate**: Apple Development / Apple Distribution

**Capabilities cần thêm:**
- Click **+ Capability**
- Add: **Face ID** (vì app dùng biometric)

### 3. Info.plist Configuration

Xcode sẽ tự động cấu hình info.plist, nhưng cần check:

```xml
<!-- Privacy - Camera Usage Description -->
<key>NSCameraUsageDescription</key>
<string>Ứng dụng cần dùng camera để quét mã QR.</string>

<!-- Privacy - Face ID Usage Description -->
<key>NSFaceIDUsageDescription</key>
<string>Dùng Face ID để xác thực khi đăng nhập vào ứng dụng</string>

<!-- URL Types (cho deep linking) -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>easyai-wallet</string>
    </array>
  </dict>
</array>
```

### 4. Build Settings

Select target > **Build Settings** tab:

```
Code Signing Identity:
  - Debug: Apple Development
  - Release: Apple Distribution (hoặc iOS Distribution)

Product Bundle Identifier: com.easyai.wallet

Enable Bitcode: No (React Native không support)

Strip Debug Symbols During Copy: Yes (Release only)

Dead Code Stripping: Yes
```

### 5. App Icons

#### Chuẩn bị icons
- Icon phải là 1024x1024px PNG
- Không có transparency
- Không có rounded corners (iOS tự động làm)

#### Add vào Xcode
1. Open **Assets.xcassets** trong Navigator
2. Select **AppIcon**
3. Drag & drop icon 1024x1024 vào ô **App Store iOS 1024pt**
4. Xcode sẽ tự generate các sizes khác

**Hoặc dùng tool:**
```bash
# Generate all icon sizes
npx @expo/configure-splash-screen
```

### 6. Launch Screen (Splash Screen)

Splash screen đã được config qua Expo:
- Check **LaunchScreen.storyboard** trong ios/EasyAIWallet/
- Hoặc sử dụng **SplashScreen.storyboard**

---

## Certificates và Provisioning Profiles

### Tự động (Khuyến nghị cho beginners)

Xcode có thể tự động manage:
1. Xcode > Signing & Capabilities
2. ✅ **Automatically manage signing**
3. Select Team
4. Xcode sẽ tự tạo certificates và profiles

### Thủ công (Advanced)

#### 1. Tạo Certificate

**Development Certificate:**
```bash
# Open Keychain Access
# Keychain Access > Certificate Assistant > Request Certificate from Authority
# Email: your@email.com
# Common Name: Your Name
# Save to disk > Continue

# Sẽ tạo file CertificateSigningRequest.certSigningRequest
```

**Trên Developer Portal:**
1. **Certificates** > **+**
2. Development: **iOS App Development**
3. Production: **iOS Distribution** (App Store and Ad Hoc)
4. Upload CSR file
5. Download certificate (.cer)
6. Double-click để install vào Keychain

#### 2. Tạo Provisioning Profile

**Development Profile:**
1. **Profiles** > **+**
2. **iOS App Development**
3. Select App ID: **com.easyai.wallet**
4. Select Certificate (vừa tạo)
5. Select Devices (test devices)
6. Profile Name: **EasyAI Wallet Dev**
7. Generate và Download

**Distribution Profile (App Store):**
1. **Profiles** > **+**
2. **App Store**
3. Select App ID: **com.easyai.wallet**
4. Select Distribution Certificate
5. Profile Name: **EasyAI Wallet AppStore**
6. Generate và Download

**Install Profiles:**
```bash
# Double-click .mobileprovision files
# Hoặc drag vào Xcode

# Verify trong Xcode
Xcode > Settings > Accounts > [Your Team] > Download Manual Profiles
```

---

## Build và Archive

### 1. Chọn Build Configuration

#### Development Build (test trên device)
```bash
# In Xcode
1. Product > Scheme > Edit Scheme
2. Run > Build Configuration > Debug
3. Select target device (your iPhone)
4. Click Run (▶️) hoặc Cmd+R
```

#### Production Build (App Store)
```
1. Product > Scheme > Edit Scheme
2. Archive > Build Configuration > Release
3. OK
```

### 2. Select Device

```
Top bar > Select device:
- Any iOS Device (arm64) - cho Archive
- [Your iPhone] - cho test trực tiếp
- iPhone 14 Pro Simulator - cho test trên simulator
```

### 3. Clean Project (nếu cần)
```bash
# Xcode
Product > Clean Build Folder (Shift+Cmd+K)

# Hoặc terminal
cd ios
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData/*
pod deintegrate && pod install
```

### 4. Build Project
```
Product > Build (Cmd+B)

# Check console output ở bottom
# Phải thấy "Build Succeeded"
```

### 5. Run on Simulator
```bash
# Select simulator target
Product > Run (Cmd+R)

# App sẽ launch trong simulator
```

### 6. Run on Real Device

#### Enable Developer Mode trên iPhone
```
iOS 16+:
1. Settings > Privacy & Security > Developer Mode
2. Enable Developer Mode
3. Restart iPhone
```

#### Run từ Xcode
```
1. Connect iPhone qua USB
2. Trust computer trên iPhone
3. Xcode > Select your iPhone
4. Product > Run (Cmd+R)

Lần đầu có thể bị lỗi "Untrusted Developer"
→ iPhone Settings > General > VPN & Device Management
→ Trust [Developer Account]
```

### 7. Archive for Distribution

⚠️ **Quan trọng**: Archive để submit lên App Store hoặc TestFlight

```bash
# 1. Select "Any iOS Device (arm64)"
Top bar > Select > Any iOS Device (arm64)

# 2. Archive
Product > Archive

# Xcode sẽ build và mở Organizer khi xong
# Có thể mất 5-15 phút depending on project size
```

**Progress trong Console:**
```
▸ Building EasyAIWallet
▸ Linking EasyAIWallet
▸ Copying resources
▸ Code signing
▸ Archiving
✓ Archive Succeeded
```

---

## Export IPA File

### 1. Open Organizer

Sau khi Archive xong:
```
Window > Organizer (Cmd+Shift+O)
Hoặc tự động mở sau khi Archive
```

### 2. Select Archive

```
Tab: Archives
Chọn app: EasyAIWallet
Chọn archive mới nhất (theo date/time)
```

### 3. Distribute App

Click **Distribute App** > Chọn method:

#### Option 1: App Store Connect (cho TestFlight & Production)
```
1. Select: App Store Connect
2. Next

3. Destination: Upload
   (hoặc Export để upload thủ công sau)
4. Next

5. Distribution Options:
   ✅ Upload your app's symbols (khuyến nghị cho crash reports)
   ✅ Manage Version and Build Number (optional)
   
6. Signing: Automatically manage signing
   (hoặc Manually nếu bạn muốn chọn specific profiles)
7. Next

8. Review summary
   App: EasyAI Wallet
   Bundle ID: com.easyai.wallet
   Version: 1.0.0
   Build: 1
   
9. Upload

⏱️ Upload có thể mất 5-20 phút
```

#### Option 2: Ad Hoc (testing không qua TestFlight)
```
1. Select: Ad Hoc
2. Select devices to include
3. Export
4. Share IPA file với testers
5. Testers install qua Xcode hoặc tools như Diawi
```

#### Option 3: Development (test local)
```
1. Select: Development
2. Select signing
3. Export
4. Install qua Xcode hoặc Apple Configurator
```

#### Option 4: Enterprise (nếu có Enterprise account)
```
1. Select: Enterprise
2. Distribution options
3. Export
4. Host IPA trên web server
```

### 4. Export Success

```
✓ Export succeeded
IPA location: /Users/[you]/Desktop/EasyAIWallet.ipa

IPA có thể:
- Upload lên App Store Connect thủ công
- Share với testers (Ad Hoc)
- Archive để backup
```

---

## Upload lên App Store Connect

### Option 1: Upload từ Xcode (đã làm ở trên)

Nếu chọn "Upload" trong Distribute App, Xcode tự upload.

### Option 2: Upload thủ công với Transporter

#### Bước 1: Download Transporter
```bash
# Download từ Mac App Store
# Search: "Transporter"
# Install
```

#### Bước 2: Upload IPA
```
1. Mở Transporter
2. Sign in với Apple ID (developer account)
3. Drag & drop IPA file
4. Click "Deliver"

⏱️ Upload và processing: 5-30 phút
```

### Option 3: Upload với command line

```bash
# Sử dụng xcrun altool (deprecated nhưng vẫn work)
xcrun altool --upload-app \
  --type ios \
  --file "EasyAIWallet.ipa" \
  --username "your@email.com" \
  --password "app-specific-password"

# Hoặc dùng notarytool (mới hơn)
xcrun notarytool submit EasyAIWallet.ipa \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID"
```

**Tạo App-Specific Password:**
```
1. https://appleid.apple.com/account/manage
2. Sign in
3. App-Specific Passwords > Generate Password
4. Name: "Xcode Upload"
5. Copy password (chỉ hiện 1 lần)
```

---

## Troubleshooting

### 1. Build Errors

#### "No such module 'React'"
```bash
# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Rebuild
```

#### "Command PhaseScriptExecution failed"
```bash
# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean and rebuild
cd ios
xcodebuild clean
cd ..
```

#### "ld: library not found"
```bash
# Check library search paths
Xcode > Build Settings > Search: "Library Search Paths"
# Phải có: $(inherited) và $(PODS_ROOT)

# Reinstall pods
cd ios && pod install && cd ..
```

### 2. Signing Errors

#### "Failed to register bundle identifier"
```
1. Bundle ID đã tồn tại trên App Store Connect
2. Hoặc đã được dùng bởi team khác
3. Phải dùng unique bundle ID
```

#### "No profiles for 'com.easyai.wallet' were found"
```
Solution 1: Automatic signing
- Enable "Automatically manage signing"
- Select team
- Xcode sẽ tạo profile mới

Solution 2: Manual
- Download provisioning profile từ developer portal
- Install vào Xcode
```

#### "The certificate used has expired"
```bash
# Check certificate expiry
Xcode > Settings > Accounts > View Details
# Renew expired certificates

# Download new certificate từ developer portal
```

### 3. Runtime Errors

#### App crashes on launch
```bash
# Check crash logs
Window > Devices and Simulators
Select device > View Device Logs

# Common causes:
- Missing NSCameraUsageDescription
- Missing NSFaceIDUsageDescription
- JavaScript bundle not loaded
```

#### "Unable to load script"
```bash
# Metro bundler không chạy
# Terminal 1:
npm start

# Terminal 2:
# Rebuild from Xcode
```

#### White screen on launch
```bash
# Check if splash screen config correct
npx expo install expo-splash-screen

# Rebuild
rm -rf ios/build
cd ios && pod install && cd ..
```

### 4. Archive Errors

#### "Archive failed - Code signing error"
```
1. Select "Any iOS Device (arm64)"
2. NOT a simulator
3. Check signing settings
4. Archive again
```

#### "No such provisioning profile"
```
Xcode > Settings > Accounts
Select team > Download Manual Profiles
Try archive again
```

#### "The app references non-public symbols"
```
# React Native sometimes causes this
# Check Build Settings:
Other Linker Flags: -ObjC

# Remove any private API usage
```

### 5. Upload Errors

#### "Invalid Bundle - Missing required icon"
```
# Icon 1024x1024 chưa có
Assets.xcassets > AppIcon
Add 1024x1024 icon
Rebuild và archive lại
```

#### "ITMS-90034: Missing or invalid signature"
```
# Re-sign với correct certificate
Product > Clean Build Folder
Archive lại với Distribution certificate
```

#### "Upload failed - Invalid IPA"
```
# IPA bị corrupt hoặc wrong format
# Export lại từ Xcode
# Verify bundle structure

unzip -l EasyAIWallet.ipa
# Should see Payload/EasyAIWallet.app/
```

### 6. Device Testing Issues

#### "Untrusted Developer"
```
iPhone:
Settings > General > VPN & Device Management
Trust [Developer Name]
```

#### "Unable to verify app"
```
# Need internet to verify first time
# Or use offline provisioning (Enterprise only)
```

#### "This app cannot be installed"
```
# Device not in provisioning profile
# Add device UDID to developer portal
# Regenerate profile
# Rebuild
```

---

## Performance Optimization

### 1. Reduce App Size

#### Enable bitcode (if compatible)
```
Build Settings > Enable Bitcode > Yes
⚠️ Check all pods support bitcode
```

#### Strip symbols
```
Build Settings > Strip Debug Symbols During Copy > Yes
Build Settings > Strip Linked Product > Yes (Release)
```

#### Optimize images
```bash
# Use optimized assets
# WebP for images (with fallback)
# Vector icons instead of PNGs
```

### 2. Build Time Optimization

#### Use legacy build system (if new one slow)
```
File > Project Settings > Build System
> Legacy Build System (only if needed)
```

#### Parallelize builds
```
Build Settings > Build Active Architecture Only
- Debug: Yes
- Release: No
```

#### Exclude architectures
```
Build Settings > Excluded Architectures
Add: arm64 (for Simulator on Apple Silicon Macs)
```

### 3. Runtime Performance

#### Release mode optimizations
Already enabled in Release configuration:
```
Optimization Level: -Os (optimize for size)
Dead Code Stripping: Yes
Swift Optimization Level: -O
```

---

## Best Practices

### 1. Version Management

```
Version: 1.0.0 (user-facing)
Build: 1 (integer, auto-increment)

Semantic versioning:
1.0.0 -> Major.Minor.Patch
1.0.1 -> Bug fixes
1.1.0 -> New features  
2.0.0 -> Breaking changes
```

**Auto-increment build number:**
```bash
# Add build phase script
Xcode > Target > Build Phases > + > New Run Script Phase

Script:
if [ $CONFIGURATION = "Release" ]; then
    buildNumber=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${PROJECT_DIR}/${INFOPLIST_FILE}")
    buildNumber=$(($buildNumber + 1))
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" "${PROJECT_DIR}/${INFOPLIST_FILE}"
fi
```

### 2. Code Signing

```
✅ Use automatic signing cho ease of use
✅ Store certificates trong Keychain
✅ Backup certificates và keys
✅ Use match/fastlane cho team collaboration
```

### 3. Testing

```
✅ Test trên nhiều devices (iPhone, iPad)
✅ Test nhiều iOS versions (minimum -> latest)
✅ Test với slow network
✅ Test memory usage (Xcode Instruments)
✅ Test battery impact
```

### 4. Security

```
✅ Enable Face ID/Touch ID authentication
✅ Store sensitive data trong Keychain
✅ Use HTTPS cho API calls
✅ Obfuscate code (limited in React Native)
✅ Regular security audits
```

---

## Useful Commands

```bash
# ==================== PROJECT SETUP ====================

# Generate iOS project
npx expo prebuild --platform ios

# Install dependencies
cd ios && pod install && cd ..

# Update pods
cd ios && pod update && cd ..

# ==================== XCODE ====================

# Open workspace
open ios/*.xcworkspace

# Build from command line
xcodebuild -workspace ios/EasyAIWallet.xcworkspace \
  -scheme EasyAIWallet \
  -configuration Release \
  build

# Archive from command line
xcodebuild -workspace ios/EasyAIWallet.xcworkspace \
  -scheme EasyAIWallet \
  -configuration Release \
  -archivePath build/EasyAIWallet.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/EasyAIWallet.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist

# ==================== SIMULATORS ====================

# List simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot "iPhone 14 Pro"

# Install app on simulator
xcrun simctl install booted path/to/app.app

# Launch app
xcrun simctl launch booted com.easyai.wallet

# ==================== CLEANUP ====================

# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean project
cd ios && xcodebuild clean && cd ..

# Clear pods cache
pod cache clean --all

# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..

# ==================== CERTIFICATES ====================

# List certificates in keychain
security find-identity -v -p codesigning

# List provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/

# ==================== DEVICE INFO ====================

# Get device UDID
system_profiler SPUSBDataType | grep "Serial Number"

# List connected devices
xcrun xctrace list devices

# View device logs
idevicesyslog
```

---

## Useful Links

### Documentation
- [Apple Developer](https://developer.apple.com/)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [React Native iOS Guide](https://reactnative.dev/docs/running-on-device)
- [Expo iOS Documentation](https://docs.expo.dev/workflow/ios-simulator/)

### Tools
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
- [Transporter](https://apps.apple.com/app/transporter/id1450874784)
- [Apple Configurator](https://apps.apple.com/app/apple-configurator/id1037126344)

### Resources
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Developer Portal](https://developer.apple.com/account/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

## Checklist trước khi Archive

- [ ] Version và Build number đã update
- [ ] Bundle ID đúng
- [ ] Signing configuration đúng (Distribution)
- [ ] All capabilities enabled
- [ ] Icons 1024x1024 đã add
- [ ] Privacy descriptions đầy đủ trong Info.plist
- [ ] App đã test kỹ trên devices
- [ ] No console errors/warnings
- [ ] Release build configuration
- [ ] Selected "Any iOS Device (arm64)"

---

**Chúc bạn build thành công với Xcode! 🚀**

**Tiếp theo**: Xem [deploy-testflight.md](./deploy-testflight.md) để deploy lên TestFlight.

