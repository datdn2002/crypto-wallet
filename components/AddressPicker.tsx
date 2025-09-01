import { WalletAddress } from "@/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useWalletStore } from "@/store/wallet";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppHeader, ThemedModal } from "./theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (address: WalletAddress) => void;
};

export function AddressPicker({ visible, onClose, onPick }: Props) {
  const { addressBooks } = useWalletStore();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  // const [query, setQuery] = useState("");
  // const data = useMemo(() => {
  //   const filterTokens = tokens.filter(token => !excludedTokens.includes(token.chain + token.symbol))
  //   const q = query.trim().toLowerCase();
  //   if (!q) return filterTokens;
  //   return filterTokens.filter(
  //     (t) =>
  //       t.symbol.toLowerCase().includes(q) ||
  //       t.name.toLowerCase().includes(q) ||
  //       (t.chain && t.chain.toLowerCase().includes(q))
  //   );
  // }, [query, tokens, excludedTokens]);
  const goAdd = () => router.replace("/(tabs)/address-book/add");
  if (!visible) return null;
  return (
    <ThemedModal visible={visible} onClose={onClose} header={<AppHeader title="Chọn địa chỉ" rightIcon="add" onRightIconPress={goAdd} />}>
      {
        addressBooks.length > 0 ? <FlatList
          data={addressBooks}
          keyExtractor={(item) => "address-" + item.note + item.address}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => onPick(item)}>
                <View
                  style={{ backgroundColor: tint + "20", borderRadius: 8, marginBlockEnd: 12, padding: 12, gap: 4, justifyContent: "space-between", }}

                >
                  <Text style={{ fontSize: 16, fontWeight: "500", color: text }}>{item.note || "No name"}</Text>
                  <Text style={{ fontSize: 14, color: icon, marginTop: 2 }}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
        /> :
          <View style={styles.emptyWrap}>
            <View style={styles.iconStack}>
              <MaterialIcons name="perm-contact-cal" size={93} color={tint} />
            </View>

            <Text style={[styles.caption, { color: icon }]}>
              Danh bạ của bạn và địa chỉ ví của họ sẽ xuất hiện tại đây
            </Text>

            <Pressable style={[styles.cta, { backgroundColor: tint }]} onPress={goAdd}>
              <Text style={[styles.ctaText, { color: bg }]}>Thêm địa chỉ ví</Text>
            </Pressable>
          </View>
      }

    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  /* Misc */
  iconColor: { color: "#999" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
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
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconStack: {
    width: 140,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  caption: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  cta: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 220,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});