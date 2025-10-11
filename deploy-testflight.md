# Hướng dẫn Deploy lên TestFlight với Xcode

## 📋 Mục lục
1. [TestFlight là gì?](#testflight-là-gì)
2. [Yêu cầu trước khi bắt đầu](#yêu-cầu-trước-khi-bắt-đầu)
3. [Setup App Store Connect](#setup-app-store-connect)
4. [Archive và Upload từ Xcode](#archive-và-upload-từ-xcode)
5. [Cấu hình TestFlight](#cấu-hình-testflight)
6. [Mời Testers](#mời-testers)
7. [Distribute Build](#distribute-build)
8. [Monitor và Feedback](#monitor-và-feedback)
9. [Update Version mới](#update-version-mới)
10. [Troubleshooting](#troubleshooting)

---

## TestFlight là gì?

TestFlight là platform chính thức của Apple để test iOS apps trước khi release lên App Store.

### Ưu điểm
- ✅ **Miễn phí**: Không mất phí gì ngoài Apple Developer Account
- ✅ **Dễ phân phối**: Testers download qua app TestFlight từ App Store
- ✅ **Quản lý testers**: Up to 10,000 testers
- ✅ **Feedback**: Testers có thể gửi feedback và screenshots
- ✅ **Crash reports**: Tự động thu thập crashes
- ✅ **90 ngày testing**: Mỗi build có thể test 90 ngày

### Limitations
- ⏱️ **Review time**: Internal testing nhanh (~5-15 phút), External testing cần review (1-2 ngày)
- ⚠️ **Maximum**: 10,000 external testers, 100 internal testers
- ⚠️ **Build expiry**: Mỗi build hết hạn sau 90 ngày
- ⚠️ **Số builds**: Maximum 100 active builds

---

## Yêu cầu trước khi bắt đầu

### 1. Đã hoàn thành
- [ ] Apple Developer Account (paid, $99/năm)
- [ ] Đã có Xcode project configured
- [ ] App đã build và archive thành công
- [ ] Đã có App ID trên Developer Portal

### 2. Chuẩn bị thông tin
```
App Name: EasyAI Wallet
Bundle ID: com.easyai.wallet
Primary Language: Vietnamese (hoặc English)
SKU: easyai-wallet-001 (unique identifier cho app)
```

### 3. Required materials
- [ ] App icon 1024x1024px (PNG, no transparency)
- [ ] Screenshots (tối thiểu 1 set cho iPhone)
- [ ] Privacy Policy URL
- [ ] Support URL (optional nhưng khuyến nghị)

---

## Setup App Store Connect

### 1. Tạo App trên App Store Connect

#### Bước 1: Truy cập App Store Connect
```
1. Vào https://appstoreconnect.apple.com/
2. Sign in với Apple Developer Account
3. Click "My Apps"
```

#### Bước 2: Tạo app mới
```
1. Click nút "+" (Add Apps)
2. Select "New App"
3. Chọn platform: iOS
4. Điền thông tin:
```

**App Information:**
```
Name: EasyAI Wallet
(Tối đa 30 ký tự, hiển thị trên App Store)

Primary Language: Vietnamese
(Hoặc English tùy target audience)

Bundle ID: com.easyai.wallet
(Select từ dropdown - phải đã tạo trên Developer Portal)

SKU: easyai-wallet-001
(Internal identifier, không hiển thị cho users)

User Access: Full Access
(Hoặc Limited Access nếu muốn restrict)
```

Click **Create**

### 2. Điền App Information

#### General Information
```
App Store Connect > My Apps > EasyAI Wallet > App Information

Subtitle (30 chars): 
Ví crypto an toàn, dễ sử dụng

Category:
Primary Category: Finance
Secondary Category: Utilities (optional)

Content Rights:
☐ Contains third-party content
```

#### Privacy Policy
```
Privacy Policy URL: 
https://yourdomain.com/privacy-policy
(Bắt buộc cho tất cả apps)

Support URL:
https://yourdomain.com/support
(Bắt buộc)

Marketing URL: (optional)
https://yourdomain.com
```

#### App Store Display Name
```
Name: EasyAI Wallet
(30 characters maximum, có thể khác với app name trong Xcode)
```

#### Rating
```
Select appropriate age rating:
- 4+ (if app suitable for all ages)
- 12+ (if có financial/crypto content)
- 17+ (if có unrestricted web access)

Complete questionnaire để get rating
```

### 3. Pricing and Availability

```
App Store Connect > Pricing and Availability

Price: Free
(Hoặc select pricing tier nếu paid app)

Availability:
✅ Make this app available for pre-order
Date: [Select date nếu muốn]

Countries/Regions:
Select countries where app will be available
- All Countries/Regions
- Specific Countries (select từ list)
```

---

## Archive và Upload từ Xcode

### 1. Chuẩn bị Project

#### Check Version & Build Number
```bash
# Mở Xcode
open ios/*.xcworkspace

# Select target > General
Display Name: EasyAI Wallet
Bundle Identifier: com.easyai.wallet
Version: 1.0.0
Build: 1
```

#### Check Signing
```
Target > Signing & Capabilities
✅ Automatically manage signing
Team: [Your Apple Developer Team]
Signing Certificate: Apple Distribution
Provisioning Profile: [App Store profile]
```

### 2. Create Archive

#### Bước 1: Select Device
```
Top toolbar > Select destination
Choose: "Any iOS Device (arm64)"

⚠️ KHÔNG chọn Simulator
⚠️ Phải chọn "Any iOS Device" để archive
```

#### Bước 2: Clean Build (khuyến nghị)
```
Product > Clean Build Folder
(Shortcut: Shift + Cmd + K)
```

#### Bước 3: Archive
```
Product > Archive
(Shortcut: Cmd + B để build trước)

⏱️ Archive process: 5-15 phút
Console sẽ show progress
```

**Archive progress:**
```
▸ Building EasyAIWallet
  ▸ Running script 'Start Packager'
  ▸ Running script 'Build JS Bundle'
  ▸ Compiling source files
  ▸ Linking binary
  ▸ Processing resources
  ▸ Code signing
  ▸ Creating archive

✓ Archive succeeded
```

### 3. Organizer Window

Sau khi Archive xong, Xcode tự mở **Organizer**:
```
Window > Organizer (Cmd + Shift + O)

Tab: Archives
App: EasyAIWallet
Date: Today [time]
Version: 1.0.0 (1)
```

### 4. Distribute to App Store Connect

#### Bước 1: Distribute App
```
1. Select archive vừa tạo
2. Click "Distribute App"
```

#### Bước 2: Select Distribution Method
```
Choose: "App Store Connect"
Next
```

#### Bước 3: Select Destination
```
Choose: "Upload"
(Sẽ upload build lên App Store Connect)

Alternative: "Export" (download IPA, upload sau)
Next
```

#### Bước 4: App Store Connect Options
```
Upload your app's symbols:
✅ Include bitcode for iOS content (if enabled)
✅ Upload your app's symbols to receive symbolicated reports
✅ Manage Version and Build Number (optional)

Next
```

#### Bước 5: Re-sign Options
```
Choose: "Automatically manage signing"
(Xcode sẽ tự chọn correct provisioning profile)

Hoặc: "Manually manage signing"
(Nếu muốn chọn specific profile)

Next
```

#### Bước 6: Review
```
Review summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App: EasyAI Wallet
Bundle ID: com.easyai.wallet  
Version: 1.0.0
Build: 1
Team: [Your Team Name]
Signing: Distribution
Profile: EasyAI Wallet AppStore
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Click "Upload"
```

#### Bước 7: Uploading
```
Uploading...
[Progress bar]

⏱️ Upload time: 5-20 phút (tùy file size và internet speed)

✓ Upload successful
Your app has been uploaded to App Store Connect
```

---

## Cấu hình TestFlight

### 1. Wait for Processing

Sau khi upload:
```
App Store Connect > My Apps > EasyAI Wallet > TestFlight

Status: Processing
⏱️ Processing time: 5-30 phút

Email notification khi ready:
"Your build 1.0.0 (1) has finished processing"
```

### 2. Manage Missing Compliance

#### Export Compliance
```
TestFlight > [Your Build] > Yellow warning icon

"Provide Export Compliance Information"
Click "Provide" hoặc "Manage"

Question: Does your app use encryption?

For crypto wallet app:
- If ONLY using HTTPS (standard encryption): No
- If using custom crypto beyond HTTPS: Yes (need export approval)

For most React Native apps using standard HTTPS:
Select: "No" (app uses standard encryption exempt from export compliance)

Save
```

### 3. What to Test (Internal Testing Notes)

```
TestFlight > [Build] > Test Information

What to Test: (Tùy chọn, nhưng hữu ích cho testers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version 1.0.0 (Build 1)
Initial TestFlight Release

🔍 Focus Areas:
• Wallet creation and import
• Send/receive transactions
• QR code scanning
• Face ID authentication
• Transaction history
• Token swap functionality

⚠️ Known Issues:
• [List any known issues]

📝 Testing Instructions:
1. Create new wallet
2. Test QR scanner
3. Try Face ID login
4. Test transactions

Please provide feedback on:
- Performance
- UI/UX
- Any crashes or bugs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Save
```

---

## Mời Testers

TestFlight có 2 loại testers:

### 1. Internal Testing (Khuyến nghị để test nhanh)

**Internal Testers:**
- Up to 100 testers
- Must có role trong App Store Connect team
- **Không cần review** - có thể test ngay
- Access toàn bộ builds

#### Add Internal Testers

```
TestFlight > Internal Testing > Click "+"

Option 1: Add Individual Testers
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click "+ Add Internal Testers"
2. Select existing team members
   (Hoặc invite new member vào team)
3. Select build to test
4. Save

Option 2: Add Multiple at Once
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. App Store Connect > Users and Access
2. Add new users with "App Manager" or "Admin" role
3. Return to TestFlight > Internal Testing
4. Add các users vừa tạo
```

#### Distribute to Internal Testers
```
1. Select build: 1.0.0 (1)
2. Click "Enable for Testing"
3. Select groups/testers
4. Click "Submit for Testing"

✓ Available immediately (no review)
⏱️ Testers receive email trong vài phút
```

### 2. External Testing (Cho wider audience)

**External Testers:**
- Up to 10,000 testers
- Không cần App Store Connect account
- **Cần review từ Apple** (1-2 ngày)
- Public link hoặc email invite

#### Create External Test Group

```
TestFlight > External Testing > "+" icon

1. Group Name: Beta Testers
2. Enable Automatic Distribution:
   ✅ Automatically distribute new builds
   
3. Add Testers:
   - Click "Add Testers"
   - Enter email addresses (one per line hoặc CSV)
   
   Example:
   ━━━━━━━━━━━━━━━━━━━━━━━━
   tester1@example.com
   tester2@example.com
   tester3@example.com
   ━━━━━━━━━━━━━━━━━━━━━━━━
   
4. Click "Add"

5. Select Build: 1.0.0 (1)

6. Test Information (bắt buộc cho external):
   What to Test: [Describe testing focus]
   
7. App Review Information:
   ⚠️ Cần điền đầy đủ như submit lên App Store
   
8. Click "Submit for Review"
```

#### App Review Information (External Testing)

```
Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━
First Name: [Your Name]
Last Name: [Your Name]
Phone: +84 xxx xxx xxx
Email: support@yourdomain.com
━━━━━━━━━━━━━━━━━━━━━━━━

Sign-In Information (nếu app cần login):
━━━━━━━━━━━━━━━━━━━━━━━━
Username: testuser@example.com
Password: TestPassword123!
Additional Notes: [Instructions for testing]
━━━━━━━━━━━━━━━━━━━━━━━━

Notes:
Detailed instructions about:
- How to test the app
- What features to focus on
- Any special setup needed

Submit
```

#### Review Process
```
Status: Waiting for Review
⏱️ Review time: 1-2 ngày (thường nhanh hơn App Store review)

Email notification khi:
1. "Your build is now in review"
2. "Your build has been approved" ✅
   OR "Your build was rejected" ❌
```

### 3. Public Link (External testers without emails)

```
TestFlight > External Testing > [Group Name]
 
Public Link:
https://testflight.apple.com/join/XXXXXXXX

📋 Copy link và share:
- Website
- Social media
- Forums
- QR code

Anyone with link có thể join và test
⚠️ Still subject to 10,000 tester limit
```

---

## Distribute Build

### Testers Install TestFlight App

#### Bước 1: Download TestFlight
```
1. Tester mở App Store trên iPhone/iPad
2. Search: "TestFlight"
3. Download app (miễn phí)
```

#### Bước 2: Accept Invite

**Via Email:**
```
1. Tester check email: "[App Name] is available to test"
2. Click "View in TestFlight" hoặc "Start Testing"
3. Opens TestFlight app
4. Click "Accept" invite
5. App xuất hiện trong TestFlight
```

**Via Public Link:**
```
1. Click public link
2. Opens TestFlight app
3. App xuất hiện để install
```

#### Bước 3: Install App
```
1. TestFlight app > EasyAI Wallet
2. Click "Install"
3. Enter Apple ID password (nếu cần)
4. App download và install
5. Orange dot badge xuất hiện (beta app indicator)
```

### Using the TestFlight App

Testers có thể:
```
✅ Install/uninstall builds
✅ See "What to Test" notes
✅ Send feedback và screenshots
✅ View previous builds
✅ See build expiry date (90 days)
```

---

## Monitor và Feedback

### 1. TestFlight Dashboard

```
App Store Connect > TestFlight

Overview:
━━━━━━━━━━━━━━━━━━━━━━━━
📊 Testers: 25
📲 Installs: 18
💬 Feedback: 3
⚠️ Crashes: 0
━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. View Feedback

```
TestFlight > [Build] > Feedback

Each feedback includes:
- Tester email (internal only)
- Feedback text
- Screenshots (nếu có)
- Device info (iPhone model, iOS version)
- App version

━━━━━━━━━━━━━━━━━━━━━━━━
Feedback #1
From: tester@example.com
Device: iPhone 14 Pro (iOS 17.0)
Build: 1.0.0 (1)

Message:
"QR scanner không hoạt động trong low light"

Screenshot: [attached]
━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Crash Reports

```
TestFlight > [Build] > Crashes

View:
- Crash count
- Crash logs (symbolicated)
- Device info
- iOS version
- Stack trace

Download và analyze trong Xcode:
Xcode > Window > Organizer > Crashes
```

### 4. Metrics

```
TestFlight > [Build] > Metrics

Installs:
- Total installs
- Installs over time
- By device
- By iOS version

Sessions:
- Session count
- Session duration
- Crashes per session
```

---

## Update Version mới

### 1. Increment Version/Build

#### Option A: New Version (user-facing changes)
```
Xcode > Target > General

Version: 1.0.0 → 1.0.1
Build: 1 → 2
```

#### Option B: New Build (same version)
```
Version: 1.0.0 (keep same)
Build: 1 → 2 (increment only)
```

### 2. Archive và Upload

```
1. Product > Archive
2. Distribute App > App Store Connect
3. Upload
4. Wait for processing
```

### 3. Distribute new build

#### Internal Testing (Automatic)
```
If "Automatically distribute" enabled:
→ Testers get notification automatically
→ Can update trong TestFlight app
```

#### External Testing (Manual)
```
TestFlight > External Testing > [Group]
1. Click "Add Build"
2. Select new build: 1.0.1 (2)
3. Update "What to Test"
4. Submit for Review (nếu external)
```

### 4. Notify Testers

```
TestFlight automatically sends notification khi:
✅ New build available
✅ Update to existing build
✅ Build expiring soon (7 days warning)

Testers receive:
- Push notification (if enabled)
- Email
- In-app badge trong TestFlight
```

---

## Troubleshooting

### 1. Upload Errors

#### "Invalid Bundle - Missing required icon"
```
Solution:
1. Xcode > Assets.xcassets > AppIcon
2. Add 1024x1024 icon
3. Archive lại
```

#### "Invalid Swift Support"
```
Solution:
1. Xcode > Build Settings > Always Embed Swift Standard Libraries
2. Set to "Yes"
3. Clean và Archive lại
```

#### "Invalid Provisioning Profile"
```
Solution:
1. Xcode > Signing & Capabilities
2. Try toggle "Automatically manage signing" off và on
3. Hoặc download mới profiles từ developer portal
4. Archive lại
```

### 2. Processing Stuck

```
Problem: Build stuck ở "Processing" > 1 giờ

Solution:
1. Refresh page App Store Connect
2. Check email cho error notifications
3. Wait thêm (có thể mất đến 2-3 giờ peak times)
4. Nếu > 6 giờ: Upload lại
```

### 3. Export Compliance Warning

```
Problem: "Missing Export Compliance"

Solution:
TestFlight > Build > Provide Export Compliance
Select appropriate answer (usually "No" for standard apps)
```

### 4. Testers Not Receiving Invite

```
Problem: Testers không nhận được email invite

Solutions:
1. Check spam folder
2. Verify email address chính xác
3. Resend invite:
   TestFlight > Testers > Select tester > Resend Invitation
4. Try public link thay vì email
```

### 5. App Won't Install

```
Problem: Testers không install được app

Solutions:
1. Check device có đủ storage
2. iOS version compatible (check minimum deployment target)
3. TestFlight app updated to latest
4. Try delete và reinstall TestFlight app
5. Device UDID added (chỉ cho Ad Hoc builds, không cần cho TestFlight)
```

### 6. Crashes trên TestFlight

```
Problem: App crashes only trên TestFlight, không crash local

Solutions:
1. Check if running Release configuration locally:
   Xcode > Scheme > Edit Scheme > Run > Build Configuration > Release
   
2. Enable crash reporting:
   TestFlight > Automatically send crash data
   
3. Download crash logs:
   Xcode > Window > Organizer > Crashes
   
4. Symbolicate crashes:
   - Ensure "Upload symbols" enabled khi distribute
   - Check dSYM files included
```

### 7. External Testing Rejected

```
Reasons for rejection:
❌ App crashes immediately
❌ Missing functionality described
❌ Privacy policy issues
❌ Inappropriate content
❌ Violates Apple guidelines

Fix và resubmit:
1. Address rejection reason
2. Upload new build
3. Submit for review again
```

---

## Best Practices

### 1. Testing Strategy

```
Phase 1: Internal Testing (1 week)
→ 5-10 internal testers
→ Focus on major features
→ Fix critical bugs

Phase 2: Closed Beta (2-3 weeks)
→ 50-100 external testers
→ Wider device coverage
→ Collect feedback

Phase 3: Open Beta (optional)
→ Unlimited testers via public link
→ Final testing before production
→ Polish based on feedback

Phase 4: App Store Release
→ Submit to App Store
```

### 2. Version Naming

```
Format: Major.Minor.Patch (Build)

Examples:
1.0.0 (1)   - Initial release
1.0.1 (2)   - Bug fixes
1.1.0 (3)   - New features
2.0.0 (4)   - Major update

TestFlight specific:
1.0.0 (1)   - First TestFlight build
1.0.0 (2)   - Fix từ tester feedback
1.0.0 (3)   - Another iteration
1.0.1 (4)   - Ready for production
```

### 3. Communication với Testers

```
✅ Clear "What to Test" notes
✅ List known issues upfront
✅ Provide testing instructions
✅ Respond to feedback quickly
✅ Thank testers cho their time
✅ Update testers on progress
```

### 4. Build Management

```
✅ Don't submit too many builds too quickly
✅ Test thoroughly before uploading
✅ Keep previous builds available (for comparison)
✅ Archive old builds after 90 days
✅ Document changes for each build
```

### 5. Feedback Loop

```
1. Release build to TestFlight
2. Gather feedback (3-7 days)
3. Analyze crashes và feedback
4. Fix issues
5. Release new build
6. Repeat until stable
7. Submit to App Store
```

---

## Commands Cheat Sheet

```bash
# ==================== BUILD FOR TESTFLIGHT ====================

# Archive from Xcode
Product > Archive

# Or command line
xcodebuild -workspace ios/EasyAIWallet.xcworkspace \
  -scheme EasyAIWallet \
  -configuration Release \
  -archivePath build/EasyAIWallet.xcarchive \
  archive

# ==================== EXPORT ====================

# Export manually (if not uploading from Xcode)
xcodebuild -exportArchive \
  -archivePath build/EasyAIWallet.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist

# ==================== UPLOAD ====================

# Upload với Transporter app
# (GUI - drag & drop IPA)

# Or command line (xcrun)
xcrun altool --upload-app \
  --type ios \
  --file "EasyAIWallet.ipa" \
  --username "your@email.com" \
  --password "@keychain:AC_PASSWORD"

# Or notarytool (newer)
xcrun notarytool submit EasyAIWallet.ipa \
  --apple-id "your@email.com" \
  --password "@keychain:AC_PASSWORD" \
  --team-id "TEAM_ID"

# ==================== VERSION MANAGEMENT ====================

# Auto-increment build number (add to build phase)
buildNumber=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${PROJECT_DIR}/${INFOPLIST_FILE}")
buildNumber=$(($buildNumber + 1))
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" "${PROJECT_DIR}/${INFOPLIST_FILE}"

# ==================== TESTING ====================

# Run in Release mode locally (test như TestFlight)
Product > Scheme > Edit Scheme > Run > Build Configuration > Release

# ==================== CLEANUP ====================

# Clear archives
~/Library/Developer/Xcode/Archives/

# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

---

## Useful Links

### TestFlight Resources
- [TestFlight Overview](https://developer.apple.com/testflight/)
- [TestFlight Beta Testing Guide](https://help.apple.com/app-store-connect/#/devdc42b26b8)
- [TestFlight FAQ](https://developer.apple.com/testflight/faq/)

### App Store Connect
- [App Store Connect](https://appstoreconnect.apple.com/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

### Documentation
- [Distributing Apps](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [Beta Testing](https://developer.apple.com/testflight/)

---

## TestFlight Checklist

### Pre-Upload
- [ ] Version và Build number đã update
- [ ] App đã test thoroughly locally
- [ ] All required permissions trong Info.plist
- [ ] App icon 1024x1024 đã add
- [ ] Archive succeeded
- [ ] Signing với Distribution certificate

### Post-Upload
- [ ] Export compliance provided
- [ ] "What to Test" notes đã điền
- [ ] Testers đã được add
- [ ] Build enabled for testing
- [ ] Test email/link sent

### Testing Phase
- [ ] Install app từ TestFlight
- [ ] Test major features work
- [ ] Monitor crashes
- [ ] Collect feedback
- [ ] Fix issues
- [ ] Release updated build

### Pre-Production
- [ ] All critical bugs fixed
- [ ] Positive feedback từ testers
- [ ] Crash-free rate > 99%
- [ ] Performance acceptable
- [ ] Ready to submit to App Store

---

**Chúc bạn deploy thành công lên TestFlight! 🚀**

**Sau khi test ổn định trên TestFlight**, bạn có thể submit app lên App Store để release chính thức.

**Next steps:**
1. Test thoroughly trên TestFlight (1-2 tuần)
2. Gather và address feedback
3. Submit to App Store Review
4. Release to production! 🎉

