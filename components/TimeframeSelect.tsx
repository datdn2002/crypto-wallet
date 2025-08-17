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

type TimeframeOption = "1H" | "24H";

interface Props {
  value: TimeframeOption;
  onChange: (v: TimeframeOption) => void;
}

export function TimeframeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (v: TimeframeOption) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <>
      {/* Nút hiển thị */}
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{value}</Text>
      </Pressable>

      {/* Modal */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Khung thời gian</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.option, value === "24H" && styles.optionActive]}
              onPress={() => handleSelect("24H")}
            >
              <Text style={styles.optionText}>24H</Text>
              {value === "24H" && <Text style={styles.check}>◉</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, value === "1H" && styles.optionActive]}
              onPress={() => handleSelect("1H")}
            >
              <Text style={styles.optionText}>1H</Text>
              {value === "1H" && <Text style={styles.check}>◉</Text>}
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  triggerText: { fontSize: 14, fontWeight: "500" },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  close: { fontSize: 18, fontWeight: "600" },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionActive: { backgroundColor: "#F9FAFB" },
  optionText: { fontSize: 15 },
  check: { fontSize: 16, color: "#2563EB" },
});
