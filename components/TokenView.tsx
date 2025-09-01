import { Token } from "@/store/wallet";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function TokenView({ token, onPress }: { token: Token; onPress?: () => void }) {
  const Element = onPress ? TouchableOpacity : View;
  return (
    <Element style={styles.rowLeft} onPress={onPress}>
      <Image source={{ uri: token.logo }} style={styles.tokenCircle} resizeMode="cover" />
      <View style={{ marginLeft: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={[styles.symbol, { color: "#000" }]}>{token.symbol}</Text>
          {token.chain ? (
            <View style={styles.chainTag}>
              <Text style={styles.chainText}>{token.chain}</Text>
            </View>
          ) : null}
          {onPress && <Ionicons name="chevron-forward-outline" />}
        </View>
        <Text style={[styles.name, { color: "#000" }]}>{token.name}</Text>
      </View>
    </Element>
  )
}

const styles = StyleSheet.create({
  rowLeft: { flexDirection: "row", alignItems: "center" },
  tokenCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D0D3D6",
  },
  symbol: { fontSize: 15, fontWeight: "600" },
  name: { fontSize: 13 },
  chainTag: {
    backgroundColor: "#E5E5EA",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  chainText: { fontSize: 11, color: "#333" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});