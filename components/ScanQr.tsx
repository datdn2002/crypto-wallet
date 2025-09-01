import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ScanQr({ onEndScan }: { onEndScan: (data: string, type: string) => void }) {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<"on" | "off">("off");
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const lastScanAt = useRef<number>(0);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission?.granted]);

  // Bật lại scan khi screen được focus, tắt khi blur
  useFocusEffect(() => {
    setScanningEnabled(true);
    setTorch("off");
    return () => {
      setScanningEnabled(false);
      setTorch("off");
    };
  });

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Cần quyền truy cập Camera để quét QR</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Cấp quyền</Text>
        </Pressable>
      </View>
    );
  }

  const onBarcodeScanned = ({ data, type }: BarcodeScanningResult) => {
    const now = Date.now();
    if (now - lastScanAt.current < 1200) return;
    lastScanAt.current = now;

    // Ngăn quét tiếp trong lúc chuyển màn
    setScanningEnabled(false);
    setTorch("off");

    onEndScan(data, type);
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch === "on"}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanningEnabled ? onBarcodeScanned : undefined}
        />
      )}

      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.frame} />
        <Text style={styles.hint}>Đưa mã QR vào khung để quét</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.controlBtn} onPress={() => setTorch(t => (t === "on" ? "off" : "on"))}>
          <Text style={styles.controlText}>{torch === "on" ? "Tắt đèn" : "Bật đèn"}</Text>
        </Pressable>
        <Pressable style={styles.controlBtn} onPress={() => onEndScan("", "")}>
          <Text style={styles.controlText}>Đóng</Text>
        </Pressable>
      </View>
    </View>
  );
}

const FRAME_SIZE = 260;
/* styles giữ nguyên của bạn */


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  text: { color: "#111", fontSize: 16, marginBottom: 12, textAlign: "center" },
  btn: { backgroundColor: "#111", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "600" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  hint: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  controls: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  controlText: { color: "#fff", fontWeight: "600" },
});
