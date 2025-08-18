import { useThemeColor } from "@/hooks/useThemeColor";
import { authenticateBiometric } from "@/store/biometric-auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ThemedModal } from "../theme";

/** ----- Types ------ */
type Props = {
  visible: boolean;
  onClose: () => void;
  onFinish: (payload: { label: string; seed: string[] }) => void;
  wordCount?: 12 | 24; // mặc định 12
  title?: string; // mặc định "Wallet"
  mnemonic: string;
};

function sample<T>(arr: T[], k: number) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, k);
}

/** ----- Component ------ */
export function ManualBackupModal({
  visible,
  onClose,
  onFinish,
  wordCount = 12,
  title = "Wallet",
  mnemonic
}: Props) {
  console.log("mnemonic", mnemonic);
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");
  const seed = useMemo(() => mnemonic.split(" "), [mnemonic]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [label, setLabel] = useState("Ví chính");
  const [ck1, setCk1] = useState(true);
  const [ck2, setCk2] = useState(true);

  // câu hỏi xác nhận: chọn 3 vị trí khác nhau
  const questions = useMemo(() => sample([...Array(wordCount)].map((_, i) => i + 1), 3), [seed]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const canNext1 = label.trim().length > 0 && ck1 && ck2;
  const canNext2 = true;
  const canNext3 = true;
  const canSubmit4 = questions.every((pos) => answers[pos] === seed[pos - 1]);

  const resetAll = () => {
    setStep(1);
    setLabel("Ví chính");
    setCk1(true);
    setCk2(true);
    setAnswers({});
  };

  const closeAndReset = () => {
    resetAll();
    onClose();
  };

  return (
    <ThemedModal visible={visible} onClose={closeAndReset}>
      <View style={[styles.wrap, { backgroundColor: bg }]}>
        {/* Header đơn giản giống ảnh mock */}
        <View style={styles.header}>
          <Pressable onPress={() => (step === 1 ? closeAndReset() : setStep((s) => (s - 1) as any))}>
            <Ionicons name="arrow-back" size={22} color={icon} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: text }]}>
            {step === 1 ? title : step === 2 ? "Sao lưu thủ công" : step === 3 ? "Sao lưu thủ công" : "Xác nhận cụm từ bí mật"}
          </Text>
          <Pressable onPress={closeAndReset}>
            <Ionicons name={step === 1 ? "trash-outline" : "information-circle-outline"} size={20} color={icon} />
          </Pressable>
        </View>

        {/* ----- STEP 1 ----- */}
        {step === 1 && (
          <View style={styles.body}>
            {/* <Text style={[styles.label, { color: text }]}>Tên</Text> */}
            <View style={[styles.inputRow, { borderColor: "#C7C7CC", display: "none" }]}>
              <TextInput
                value={label}
                onChangeText={setLabel}
                style={[styles.input, { color: text }]}
                placeholder="Ví của tôi"
                placeholderTextColor={icon}
              />
              {label ? (
                <Pressable onPress={() => setLabel("")}>
                  <Ionicons name="close-circle" size={18} color={icon} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.tipCard}>
              <View style={{ alignItems: "center", marginBottom: 14 }}>
                <Ionicons name="shield-outline" size={68} color={tint} />
              </View>

              <Text style={[styles.centerNote, { color: icon }]}>ⓘ Chỉ dành cho bạn</Text>
              <Text style={[styles.centerTitle, { color: text }]}>
                Cụm từ bí mật này mở khóa ví của bạn
              </Text>

              <CheckLine
                checked
                text="Ví không có quyền truy cập vào khóa này"
              />
              <CheckLine
                checked
                text="Đừng lưu dưới bất kỳ dạng kỹ thuật số nào, hãy viết ra giấy và cất giữ ở nơi bí mật"
              />
            </View>

            <Pressable
              disabled={!canNext1}
              onPress={async () => {
                const ok = await authenticateBiometric();
                if (ok) {
                  setStep(2);
                }
              }}
              style={[
                styles.primaryBtn,
                { backgroundColor: canNext1 ? tint : "#A6A6AA" },
              ]}
            >
              <Text style={styles.primaryText}>Tiếp tục</Text>
            </Pressable>
          </View>
        )}

        {/* ----- STEP 2 ----- */}
        {step === 2 && (
          <View style={[styles.body, { paddingTop: 6 }]}>
            <SeedGrid words={seed} text={text} icon={icon} />
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.helper, { color: icon }]}>
                ⓘ Đừng bao giờ chia sẻ cụm từ bí mật với bất kỳ ai và hãy lưu trữ cụm từ này một cách an toàn
              </Text>
            </View>
            <Pressable
              disabled={!canNext2}
              onPress={() => setStep(3)}
              style={[
                styles.primaryBtn,
                { backgroundColor: canNext2 ? tint : "#A6A6AA" },
              ]}
            >
              <Text style={styles.primaryText}>Tiếp tục</Text>
            </Pressable>
          </View>
        )}

        {/* ----- STEP 3 ----- */}
        {step === 3 && (
          <View style={[styles.body, { alignItems: "center", justifyContent: "center" }]}>
            <Ionicons name="shield-checkmark-outline" size={120} color={tint} />
            <Text style={[styles.bigWarn, { color: text, marginTop: 16 }]}>
              Không bao giờ để lộ cụm từ bí mật của bạn
            </Text>

            <View style={{ height: 18 }} />

            <Pressable
              disabled={!canNext3}
              onPress={() => setStep(4)}
              style={[
                styles.primaryBtn,
                { backgroundColor: canNext3 ? tint : "#A6A6AA", alignSelf: "stretch" },
              ]}
            >
              <Text style={styles.primaryText}>Tiếp tục</Text>
            </Pressable>
          </View>
        )}

        {/* ----- STEP 4 ----- */}
        {step === 4 && (
          <View style={styles.body}>
            <Text style={[styles.confirmLead, { color: text }]}>
              Vui lòng nhấn vào câu trả lời đúng cho các cụm từ ghi nhớ bên dưới
            </Text>

            <View style={{ height: 12 }} />

            {questions.map((pos) => {
              const correct = seed[pos - 1];
              // 2 lựa chọn nhiễu
              const randoms = sample(seed.filter((w) => w !== correct), 2);
              const options = sample([correct, ...randoms], 3);
              const selected = answers[pos];

              return (
                <View key={pos} style={{ marginBottom: 10 }}>
                  <Text style={[styles.qTitle, { color: text }]}>Từ #{pos}</Text>
                  <View style={styles.optionRow}>
                    {options.map((w) => {
                      const active = selected === w;
                      return (
                        <Pressable
                          key={w}
                          onPress={() =>
                            setAnswers((s) => ({ ...s, [pos]: w }))
                          }
                          style={[
                            styles.optionBtn,
                            {
                              backgroundColor: active ? "rgba(0,122,255,0.15)" : "rgba(142,142,147,0.12)",
                              borderColor: active ? tint : "transparent",
                            },
                          ]}
                        >
                          <Text style={[styles.optionText, { color: text }]}>{w}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <View style={{ height: 8 }} />
            <Pressable
              disabled={!canSubmit4}
              onPress={() => {
                onFinish({ label: label.trim(), seed });
                closeAndReset();
              }}
              style={[
                styles.primaryBtn,
                { backgroundColor: canSubmit4 ? tint : "#A6A6AA" },
              ]}
            >
              <Text style={styles.primaryText}>Xác nhận</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ThemedModal>
  );
}

/** ----- Sub components ------ */

function CheckLine({ checked, text }: { checked: boolean; text: string }) {
  return (
    <View style={styles.checkLine}>
      <Ionicons name={checked ? "checkbox" : "square-outline"} size={18} color="#8E8E93" />
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

function SeedGrid({ words, text, icon }: { words: string[]; text: string; icon: string }) {
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.seedCell}>
      <Text style={[styles.seedIndex, { color: icon }]}>{index + 1}.</Text>
      <Text style={[styles.seedWord, { color: text }]}>{item}</Text>
    </View>
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={(w, i) => `${w}-${i}`}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
    />
  );
}

/** ----- Styles ------ */
const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 18 },
  header: {
    height: 44, flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },

  body: { flex: 1 },

  // Step 1
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  inputRow: {
    height: 44, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, flexDirection: "row", alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, paddingRight: 8 },
  tipCard: {
    marginTop: 16, borderRadius: 12, padding: 16,
    backgroundColor: "rgba(142,142,147,0.12)",
  },
  centerNote: { textAlign: "center", fontSize: 12, marginBottom: 4 },
  centerTitle: { textAlign: "center", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  checkLine: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  checkText: { marginLeft: 8, fontSize: 14, lineHeight: 20 },

  // Step 2
  seedCell: {
    flex: 1, minHeight: 36,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, borderRadius: 8,
    backgroundColor: "transparent",
  },
  seedIndex: { width: 22, fontSize: 13 },
  seedWord: { fontSize: 15, fontWeight: "600" },
  helper: { fontSize: 12, lineHeight: 18 },

  // Step 3
  bigWarn: { fontSize: 16, fontWeight: "700", textAlign: "center" },

  // Step 4
  confirmLead: { fontSize: 14, lineHeight: 20 },
  qTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  optionRow: { flexDirection: "row", gap: 8 },
  optionBtn: {
    flex: 1, height: 40, borderRadius: 8, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  optionText: { fontSize: 14, fontWeight: "600" },

  // Shared
  primaryBtn: {
    height: 46, borderRadius: 24, alignItems: "center",
    justifyContent: "center", marginTop: 16,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
