// app/(tabs)/trending.tsx
import { getTokens, Token } from "@/api";
import { AppHeader } from "@/components/theme";
import { TimeframeSelect } from "@/components/TimeframeSelect";
import { useAuthStore } from "@/store/auth";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";


export default function TrendingTokensScreen() {
    const { access_token } = useAuthStore();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // UI filters (placeholder – bạn có thể nối API sau)
    const [range, setRange] = useState<"24H" | "1H">("24H");
    const [segment, setSegment] = useState<"all" | "gainers" | "losers">("all");
    const [chainFilter, setChainFilter] = useState<string | "all">("all");

    const fetchData = useCallback(async () => {
        if (!access_token) return;
        try {
            setLoading(true);
            const res = await getTokens({
                token: access_token,
                params: { includeMarketData: true },
            });
            if (res?.statusCode === 200) {
                setTokens(res.data);
            }
        } finally {
            setLoading(false);
        }
    }, [access_token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        if (!access_token) return;
        setRefreshing(true);
        try {
            const res = await getTokens({
                token: access_token,
                params: { includeMarketData: true },
            });
            if (res?.statusCode === 200) {
                setTokens(res.data as Token[]);
            }
        } finally {
            setRefreshing(false);
        }
    }, [access_token]);

    // filter/sort demo (hiện sắp xếp theo volume desc – giống “thịnh hành”)
    const data = useMemo(() => {
        let arr = [...tokens];
        if (chainFilter !== "all") {
            arr = arr.filter((t) => t.chain === chainFilter);
        }
        if (segment === "gainers") {
            arr = arr.filter(
                (t) => Number(t.market_data?.price_change_percentage_24h ?? 0) > 0
            );
        } else if (segment === "losers") {
            arr = arr.filter(
                (t) => Number(t.market_data?.price_change_percentage_24h ?? 0) < 0
            );
        }
        // sort theo volume_24h desc
        arr.sort(
            (a, b) =>
                (b.market_data?.volume_24h ?? 0) - (a.market_data?.volume_24h ?? 0)
        );
        return arr;
    }, [tokens, chainFilter, segment]);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Token thịnh hành" />
            <View style={{ height: 16 }}></View>
            <Filters
                range={range}
                setRange={setRange}
                segment={segment}
                setSegment={setSegment}
                chainFilter={chainFilter}
                setChainFilter={setChainFilter}
            />

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TokenRow item={item} />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={data.length === 0 && styles.emptyList}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có token nào</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

/* ============================ Row ============================ */

function TokenRow({ item }: { item: Token }) {
    const md = item.market_data;
    const price = md?.current_price ?? 0;
    const change24 = Number(md?.price_change_percentage_24h ?? 0);
    const volume = md?.volume_24h ?? 0;

    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <View style={styles.logoWrap}>
                    <Image
                        source={{ uri: item.logo_url }}
                        style={styles.logo}
                        resizeMode="cover"
                    />
                    {md?.chain_logo ? (
                        <View style={styles.chainBadge}>
                            <Image
                                source={{ uri: md.chain_logo }}
                                style={styles.chainLogo}
                                resizeMode="contain"
                            />
                        </View>
                    ) : null}
                </View>

                <View style={styles.nameCol}>
                    <Text style={styles.symbol}>{item.symbol}</Text>
                    <Text style={styles.subText}>{formatVolume(volume)}</Text>
                </View>
            </View>

            <View style={styles.right}>
                <Text style={styles.price}>{formatUSD(price)}</Text>
                <PercentText value={change24} />
            </View>
        </View>
    );
}

function PercentText({ value }: { value: number }) {
    const isUp = value >= 0;
    return (
        <Text style={[styles.percent, isUp ? styles.up : styles.down]}>
            {isUp ? "+" : ""}
            {formatPercent(value)}
        </Text>
    );
}

/* ============================ Filters (UI only) ============================ */

function Filters({
    range,
    setRange,
    segment,
    setSegment,
    chainFilter,
    setChainFilter,
}: {
    range: "24H" | "1H";
    setRange: (v: "24H" | "1H") => void;
    segment: "all" | "gainers" | "losers";
    setSegment: (v: "all" | "gainers" | "losers") => void;
    chainFilter: string | "all";
    setChainFilter: (v: string | "all") => void;
}) {
    return (
        <View style={styles.filtersRow}>
            <TimeframeSelect value={range} onChange={setRange} />

            <View style={{ width: 8 }} />

            <Chip
                active={segment === "all"}
                label="Tất cả"
                onPress={() => setSegment("all")}
            />
            <Chip
                active={segment === "gainers"}
                label="Tăng"
                onPress={() => setSegment("gainers")}
            />
            <Chip
                active={segment === "losers"}
                label="Giảm"
                onPress={() => setSegment("losers")}
            />

            {/* Demo chain filter – bạn có thể thay bằng menu chọn chain động */}
            <View style={{ width: 8 }} />
            <Chip
                active={chainFilter === "all"}
                label="Tất cả chain"
                onPress={() => setChainFilter("all")}
            />
            <Chip
                active={chainFilter === "bsc"}
                label="BNB Smart Chain"
                onPress={() => setChainFilter("bsc")}
            />
        </View>
    );
}

function Chip({
    active,
    label,
    onPress,
}: {
    active?: boolean;
    label: string;
    onPress?: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                active ? styles.chipActive : undefined,
            ]}
        >
            <Text style={[styles.chipText, active ? styles.chipTextActive : undefined]}>
                {label}
            </Text>
        </Pressable>
    );
}

/* ============================ Utils ============================ */

function formatUSD(n: number) {
    if (!isFinite(n)) return "-";
    // giữ giống screenshot: có thể dùng dấu phẩy thập phân
    return `${n.toLocaleString(undefined, {
        maximumFractionDigits: 6,
    })} $`;
}
function formatPercent(n: number) {
    return `${Math.abs(n).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}%`;
}
function formatVolume(n: number) {
    if (!isFinite(n)) return "-";
    // volume là USD → compact theo triệu (M)
    const million = n / 1_000_000;
    return `${million.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })} $M`;
}

/* ============================ Styles ============================ */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    filtersRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    chip: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
    },
    chipActive: {
        backgroundColor: "#EEF2FF",
        borderColor: "#C7D2FE",
    },
    chipText: { fontSize: 13, color: "#374151" },
    chipTextActive: { color: "#1E40AF", fontWeight: "600" },

    loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyList: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { color: "#6B7280" },

    separator: { height: 12 },

    row: {
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    logoWrap: { width: 44, height: 44 },
    logo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F3F4F6",
    },
    chainBadge: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    chainLogo: { width: 14, height: 14 },

    nameCol: { flex: 1 },
    symbol: { fontSize: 16, fontWeight: "600", color: "#111827" },
    subText: { fontSize: 12, color: "#6B7280", marginTop: 2 },

    right: { alignItems: "flex-end" },
    price: { fontSize: 16, fontWeight: "700", color: "#111827" },
    percent: { marginTop: 4, fontSize: 13, fontWeight: "600" },
    up: { color: "#059669" },
    down: { color: "#DC2626" },
});
