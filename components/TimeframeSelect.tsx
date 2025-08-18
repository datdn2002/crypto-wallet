// components/TimeframeSelect.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TimeframeOption = "1h" | "24h";

interface Props {
  value: TimeframeOption;
  onChange: (v: TimeframeOption) => void;
}

export function TimeframeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // lấy màu theo theme hiện tại
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");      // màu bề mặt (sheet)
  const muted = useThemeColor({}, "muted");    // text phụ
  const tint = useThemeColor({}, "tint");      // màu chủ đạo (nút active)

  const styles = makeStyles({ bg, text, border, card, muted, tint });

  const handleSelect = (v: TimeframeOption) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button (chip) */}
      <Pressable style={[styles.trigger, { borderColor: border, backgroundColor: card }]} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, { color: text }]}>{value}</Text>
        <Text style={[styles.triggerCaret, { color: muted }]}>▾</Text>
      </Pressable>

      {/* Bottom sheet modal */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        onDismiss={() => setOpen(false)}
      >
        {/* Bấm vào overlay sẽ đóng */}
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          {/* Bấm trong sheet KHÔNG đóng (ăn sự kiện) */}
          <Pressable onPress={() => { }} style={[styles.sheet, { backgroundColor: card }]}>
            <SafeAreaView>
              <View style={[styles.header, { borderColor: border }]}>
                <Text style={[styles.headerTitle, { color: text }]}>Khung thời gian</Text>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Text style={[styles.close, { color: muted }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.option,
                  { borderColor: border },
                  value === "24h" && { backgroundColor: addAlpha(tint, 0.08) },
                ]}
                onPress={() => handleSelect("24h")}
              >
                <Text style={[styles.optionText, { color: text }]}>24h</Text>
                <RadioDot active={value === "24h"} tint={tint} muted={muted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  { borderColor: border },
                  value === "1h" && { backgroundColor: addAlpha(tint, 0.08) },
                ]}
                onPress={() => handleSelect("1h")}
              >
                <Text style={[styles.optionText, { color: text }]}>1h</Text>
                <RadioDot active={value === "1h"} tint={tint} muted={muted} />
              </TouchableOpacity>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function RadioDot({ active, tint, muted }: { active: boolean; tint: string; muted: string }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: active ? tint : muted,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {active ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tint }} /> : null}
    </View>
  );
}

/* ========== styles factory để lấy màu theo theme ========== */
const makeStyles = (c: {
  bg: string; text: string; border: string; card: string; muted: string; tint: string;
}) =>
  StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
    },
    triggerText: { fontSize: 14, fontWeight: "600" },
    triggerCaret: { fontSize: 12 },

    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 16, fontWeight: "700" },
    close: { fontSize: 18, fontWeight: "700" },

    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: { fontSize: 15, fontWeight: "500" },
  });

/** thêm alpha cho màu HEX/RGB */
function addAlpha(color: string, alpha: number) {
  // hỗ trợ rgb(a) hoặc hex #RRGGBB
  if (color.startsWith("rgb")) {
    const [r, g, b] = color
      .replace(/rgba?\(|\)|\s/g, "")
      .split(",")
      .slice(0, 3)
      .map((x) => parseInt(x, 10));
    return `rgba(${r},${g},${b},${alpha})`;
  }
  // hex
  let c = color.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
