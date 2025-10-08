import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList, Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type Bank = { code: string; name: string; short: string; logo?: string };
type Recipient = { id: string; name: string; bank: string; account: string };

const BANKS: Bank[] = [
  { code: "VCB", name: "Vietcombank", short: "VCB", logo: "https://logo.clearbit.com/vietcombank.com.vn" },
  { code: "TCB", name: "Techcombank", short: "TCB", logo: "https://logo.clearbit.com/techcombank.com.vn" },
  { code: "MBB", name: "MB Bank", short: "MB", logo: "https://logo.clearbit.com/mbbank.com.vn" },
  { code: "ACB", name: "ACB", short: "ACB", logo: "https://logo.clearbit.com/acb.com.vn" },
];

const SAVED: Recipient[] = [
  { id: "1", name: "Anh Văn", bank: "VCB", account: "00123456789" },
  { id: "2", name: "Chị B", bank: "TCB", account: "1903xxxxxxx" },
];

const { width } = Dimensions.get("window");

export default function CryptoToVNDStep1() {
  const router = useRouter();

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankModal, setBankModal] = useState(false);

  const [account, setAccount] = useState("");
  const [accName, setAccName] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkOK, setCheckOK] = useState<boolean | null>(null);

  const [alias, setAlias] = useState("Anh Văn");
  const [saveRecipient, setSaveRecipient] = useState(false);

  const canContinue = useMemo(
    () => !!selectedBank && account.length >= 8 && !!accName && checkOK === true,
    [selectedBank, account, accName, checkOK]
  );

  async function handleCheck() {
    if (!selectedBank || account.length < 8) return;
    setChecking(true);
    setCheckOK(null);
    // === GỌI API THẬT Ở ĐÂY ===
    // Ví dụ: const r = await fetch( .../bank/resolve?bankCode=selectedBank.code&account=account )
    // Kết quả giả lập:
    setTimeout(() => {
      // demo: nếu tài khoản kết thúc bằng "0" coi như sai
      const ok = !account.endsWith("0");
      setCheckOK(ok);
      setAccName(ok ? "NGUYEN VAN ANH" : "");
      setChecking(false);
    }, 700);
  }

  function fillFromRecipient(rec: Recipient) {
    const bank = BANKS.find(b => b.code === rec.bank) ?? null;
    setSelectedBank(bank);
    setAccount(rec.account.replace(/\D/g, ""));
    setAccName(rec.name.toUpperCase());
    setCheckOK(true);
    setAlias(rec.name);
  }

  function onContinue() {
    router.push({
      pathname: "/offramp/crypto-to-vnd/step2",
      params: {
        bank: selectedBank?.code,
        account,
        accName,
        alias,
        save: String(saveRecipient),
      },
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Crypto to VND</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subTitle}>Chuyển đổi crypto thành VND và gửi vào tài khoản ngân hàng</Text>

        {/* Stepper 1/4 */}
        <View style={styles.stepper}>
          {[1, 2, 3, 4].map(n => (
            <View key={n} style={styles.stepItem}>
              <View style={[styles.dotWrap, n === 1 ? styles.dotActive : styles.dotInactive]}>
                <Text style={[styles.dotText, n === 1 ? styles.dotTextActive : styles.dotTextInactive]}>{n}</Text>
              </View>
              {n < 4 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 6 }}>
            {/* <View style={styles.cameraBadge}>
              <Ionicons name="camera-outline" size={18} color="#2563eb" />
            </View> */}
            <Text style={styles.cardTitle}>Crypto to VND</Text>
            <Text style={styles.cardSub}>Chuyển đổi crypto thành VND</Text>
          </View>

          {/* Saved recipients */}
          <View style={{ marginTop: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionLabel}>Người nhận đã lưu</Text>
              <Pressable hitSlop={8}><Text style={styles.link}>Tất cả</Text></Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
              {SAVED.map(rec => (
                <Pressable key={rec.id} onPress={() => fillFromRecipient(rec)} style={styles.chip}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{rec.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</Text>
                  </View>
                  <Text style={styles.chipName} numberOfLines={1}>{rec.name}</Text>
                  <Text style={styles.chipBank} numberOfLines={1}>
                    {BANKS.find(b => b.code === rec.bank)?.name ?? rec.bank}
                  </Text>
                </Pressable>
              ))}
              <Pressable style={[styles.chip, styles.addChip]}>
                <View style={[styles.avatar, { backgroundColor: "#EFF1F5", borderStyle: "dashed", borderWidth: 1, borderColor: "#cbd5e1" }]}>
                  <Ionicons name="add" size={20} color="#64748b" />
                </View>
                <Text style={styles.chipName}>Thêm mới</Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* Bank select */}
          <Pressable style={styles.input} onPress={() => setBankModal(true)}>
            <Ionicons name="card-outline" size={18} color="#64748b" style={styles.leftIcon} />
            <Text style={[styles.inputText, !selectedBank && { color: "#9ca3af" }]}>
              {selectedBank ? selectedBank.name : "Chọn ngân hàng"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6b7280" />
          </Pressable>

          {/* Account number */}
          <View style={styles.input}>
            <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#64748b" style={styles.leftIcon} />
            <TextInput
              value={account}
              onChangeText={(t) => { setAccount(t.replace(/\D/g, "")); setCheckOK(null); setAccName(""); }}
              placeholder="1234567890"
              keyboardType="number-pad"
              style={[styles.ti, { flex: 1 }]}
              placeholderTextColor={"#9ca3af"}
            />
            <Pressable
              style={[styles.checkBtn, (!selectedBank || account.length < 8 || checking) && { opacity: 0.5 }]}
              onPress={handleCheck}
              disabled={!selectedBank || account.length < 8 || checking}
            >
              {checking ? <Text style={styles.checkText}>Đang kiểm...</Text> : <Text style={styles.checkText}>Kiểm tra</Text>}
            </Pressable>
          </View>

          {/* Account name (auto) */}
          <View style={[styles.input, { backgroundColor: "#f6f7fb" }]}>
            <Ionicons name="person-outline" size={18} color="#64748b" style={styles.leftIcon} />
            <TextInput
              editable={false}
              value={accName}
              placeholder="Tên người nhận"
              style={[styles.ti, { color: accName ? "#111827" : "#9ca3af" }]}
              placeholderTextColor={"#9ca3af"}
            />
            {checkOK === true && <Ionicons name="checkmark-circle" size={20} color="#16a34a" />}
            {checkOK === false && <Ionicons name="close-circle" size={20} color="#ef4444" />}
          </View>

          {/* Alias (tuỳ chọn) */}
          <View style={styles.input}>
            <Ionicons name="star-outline" size={18} color="#64748b" style={styles.leftIcon} />
            <TextInput
              value={alias}
              onChangeText={setAlias}
              placeholder="Biệt danh người nhận (tuỳ chọn)"
              style={styles.ti}
            />
          </View>

          {/* Save recipient */}
          <Pressable style={[styles.row, { marginTop: 8 }]} onPress={() => setSaveRecipient(!saveRecipient)}>
            <View style={[styles.checkbox, saveRecipient && styles.checkboxOn]}>
              {saveRecipient && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={{ marginLeft: 8, color: "#111827" }}>Lưu người nhận</Text>
          </Pressable>

          {/* Continue */}
          <Pressable
            style={[styles.primaryBtn, !canContinue && { opacity: 0.5 }]}
            onPress={onContinue}
            disabled={!canContinue}
          >
            <Text style={styles.primaryText}>Tiếp tục</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        {/* Footer note */}
        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color="#64748b" />
          <Text style={styles.noteText}> Giao dịch được bảo mật với công nghệ blockchain</Text>
        </View>
      </ScrollView>

      {/* Bank picker modal */}
      <Modal visible={bankModal} transparent animationType="fade" onRequestClose={() => setBankModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setBankModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => { }}>
            <Text style={styles.modalTitle}>Chọn ngân hàng</Text>
            <FlatList
              data={BANKS}
              keyExtractor={(b) => b.code}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.bankItem}
                  onPress={() => { setSelectedBank(item); setBankModal(false); }}
                >
                  <View style={styles.bankLeft}>
                    {item.logo ? (
                      <Image source={{ uri: item.logo }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                    ) : (
                      <View style={styles.bankCircle}><Text style={{ fontWeight: "700" }}>{item.short}</Text></View>
                    )}
                    <Text style={styles.bankName}>{item.name}</Text>
                  </View>
                  {selectedBank?.code === item.code && <Ionicons name="checkmark" size={18} color="#2563eb" />}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5FA" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111", marginBottom: 4 },
  subTitle: { paddingHorizontal: 16, marginTop: 4, color: "#6b7280" },

  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10 },
  stepItem: { flexDirection: "row", alignItems: "center" },
  dotWrap: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: "#2563eb" },
  dotInactive: { backgroundColor: "#E7ECF7" },
  dotText: { fontWeight: "700" },
  dotTextActive: { color: "#fff" },
  dotTextInactive: { color: "#6b7280" },
  stepLine: { width: 24, height: 2, backgroundColor: "#E7ECF7", marginHorizontal: 6 },

  card: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cameraBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#E7F0FF", alignItems: "center", justifyContent: "center", marginTop: -28 },
  cardTitle: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  cardSub: { color: "#6b7280" },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionLabel: { fontWeight: "700", color: "#111" },
  link: { color: "#6b7280" },

  chip: { width: 96, marginRight: 12 },
  addChip: { borderStyle: "dashed" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800", color: "#2563eb" },
  chipName: { marginTop: 8, fontWeight: "700", color: "#111" },
  chipBank: { fontSize: 12, color: "#6b7280" },

  input: {
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    backgroundColor: "#fff",
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  leftIcon: { marginRight: 8 },
  ti: { fontSize: 15, color: "#111827", paddingVertical: 0 },
  inputText: { flex: 1, fontSize: 15, color: "#111827" },

  checkBtn: {
    paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#EEF2FF",
    borderRadius: 10,
  },
  checkText: { color: "#334155", fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: "#2563eb", borderColor: "#2563eb" },

  primaryBtn: {
    marginTop: 16, height: 48, borderRadius: 12,
    backgroundColor: "#2563eb", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  note: { marginTop: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  noteText: { color: "#6b7280" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", alignItems: "center", justifyContent: "center" },
  modalCard: { width: width - 40, maxHeight: 420, backgroundColor: "#fff", borderRadius: 16, padding: 14 },
  modalTitle: { fontWeight: "800", fontSize: 16, marginBottom: 8 },
  bankItem: { padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F7F8FC" },
  bankLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  bankCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  bankName: { fontWeight: "600" },
});
