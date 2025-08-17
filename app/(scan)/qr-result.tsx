import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function QrResult() {
  const { data, type } = useLocalSearchParams<{ data?: string; type?: string }>();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Kết quả QR</Text>
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{type}</Text>
      <Text style={styles.label}>Data:</Text>
      <Text selectable style={styles.value}>{data}</Text>

      <View style={{ height: 16 }} />
      <Pressable style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Quét lại</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  label: { fontWeight: "600", marginTop: 8 },
  value: { color: "#333", marginTop: 4 },
  btn: { backgroundColor: "#111", padding: 12, borderRadius: 10, alignSelf: "flex-start" },
  btnText: { color: "#fff", fontWeight: "700" },
});
