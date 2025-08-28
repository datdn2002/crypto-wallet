import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useRef } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { ThemedModal } from "./theme";

export function AddressQR({ value }: { value: string }) {
  const svgRef = useRef<QRCode | null>(null);
  const bg = useThemeColor({}, "background");
  const fg = useThemeColor({}, "text");

  return (
    <View style={{ padding: 16, alignItems: "center", backgroundColor: bg }}>
      <QRCode
        value={value}
        size={220}
        color={fg}
        backgroundColor="transparent"
        getRef={(c) => (svgRef.current = c)}
      />
    </View>
  );
}

export function AddressQRModal({ value, visible, onClose }: { value: string, visible: boolean; onClose: () => void }) {
  const svgRef = useRef<QRCode | null>(null);
  const bg = useThemeColor({}, "background");
  const fg = useThemeColor({}, "text");

  if (!value) return null;

  return (
    <ThemedModal visible={visible} onClose={onClose} showCloseButton>
      {/* <AppHeader title="Mã QR nhận" /> */}
      <View style={{ padding: 16, alignItems: "center", backgroundColor: bg }}>
        <QRCode
          value={value}
          size={220}
          color={fg}
          backgroundColor="transparent"
          getRef={(c) => (svgRef.current = c)}
        />
      </View>
    </ThemedModal>
  );
}
