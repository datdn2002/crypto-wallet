// app/(tabs)/trending.tsx
import { getTokens, Token } from "@/api";
import { AppHeader } from "@/components/theme";
import { TimeframeSelect } from "@/components/TimeframeSelect";
import { useThemeColor } from "@/hooks/useThemeColor";
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
    TouchableOpacity,
    View,
} from "react-native";

/** Utils */
function addAlpha(color: string, alpha: number) {
    if (color.startsWith("rgb")) {
        const [r, g, b] = color
            .replace(/rgba?\(|\)|\s/g, "")
            .split(",")
            .slice(0, 3)
            .map((x) => parseInt(x, 10));
        return `rgba(${r},${g},${b},${alpha})`;
    }
    let c = color.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

/** Hook styles theo theme */
function useStyles() {
    const bg = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const border = useThemeColor({}, "border");
    const card = useThemeColor({}, "card");
    const muted = useThemeColor({}, "muted");
    const tint = useThemeColor({}, "tint");

    // bề mặt phụ nhẹ cho avatar/logo
    const softSurface = addAlpha(border, 0.25);

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: bg },

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
            borderColor: border,
            backgroundColor: card,
            justifyContent: 'center'
        },
        chipActive: {
            backgroundColor: addAlpha(tint, 0.08),
            borderColor: addAlpha(tint, 0.6),
        },
        chipText: { fontSize: 13, color: text },
        chipTextActive: { color: tint, fontWeight: "600" },

        loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
        emptyList: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
        emptyText: { color: muted },

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
            backgroundColor: softSurface,
        },
        chainBadge: {
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: card,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: border,
        },
        chainLogo: { width: 14, height: 14 },

        nameCol: { flex: 1 },
        symbol: { fontSize: 16, fontWeight: "600", color: text },
        subText: { fontSize: 12, color: muted, marginTop: 2 },

        right: { alignItems: "flex-end" },
        price: { fontSize: 16, fontWeight: "700", color: text },
        percent: { marginTop: 4, fontSize: 13, fontWeight: "600" },
        up: { color: "#059669" },
        down: { color: "#DC2626" },
    });

    return { styles };
}

export default function TrendingTokensScreen() {
    const { styles } = useStyles();
    const { access_token } = useAuthStore();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // UI filters
    const [timeframe, setTimeframe] = useState<"24h" | "1h">("24h");
    const [segment, setSegment] = useState<"all" | "gainers" | "losers">("all");
    const [chainFilter, setChainFilter] = useState<string | "all">("all");

    const fetchData = useCallback(async () => {
        if (!access_token) return;
        try {
            setLoading(true);
            const res = await getTokens({
                token: access_token,
                params: { includeMarketData: true, timeframes: timeframe },
            });
            if (res?.statusCode === 200) {
                setTokens(res.data);
            }
        } finally {
            setLoading(false);
        }
    }, [access_token, timeframe]);

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

    const data = useMemo(() => {
        let arr = [...tokens];
        if (chainFilter !== "all") arr = arr.filter((t) => t.chain === chainFilter);
        if (segment === "gainers") {
            arr = arr.filter(
                (t) => Number(t.market_data?.price_change_percentage_24h ?? 0) > 0
            );
        } else if (segment === "losers") {
            arr = arr.filter(
                (t) => Number(t.market_data?.price_change_percentage_24h ?? 0) < 0
            );
        }
        arr.sort(
            (a, b) =>
                (b.market_data?.volume_24h ?? 0) - (a.market_data?.volume_24h ?? 0)
        );
        return arr;
    }, [tokens, chainFilter, segment]);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Token thịnh hành" />
            <View style={{ height: 16 }} />
            <Filters
                timeframe={timeframe}
                setTimeframe={setTimeframe}
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
                        <View>
                            <Text style={styles.emptyText}>Không có token nào</Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#007AFF",
                                    padding: 15,
                                    borderRadius: 8,
                                    marginTop: 10,
                                    alignItems: 'center'
                                }}
                                onPress={onRefresh}
                            >
                                <Text style={{ color: '#fff' }}>Làm mới</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

/* ============================ Row ============================ */

function TokenRow({ item }: { item: Token }) {
    const { styles } = useStyles();
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
    const { styles } = useStyles();
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
    timeframe,
    setTimeframe,
    segment,
    setSegment,
    chainFilter,
    setChainFilter,
}: {
    timeframe: "24h" | "1h";
    setTimeframe: (v: "24h" | "1h") => void;
    segment: "all" | "gainers" | "losers";
    setSegment: (v: "all" | "gainers" | "losers") => void;
    chainFilter: string | "all";
    setChainFilter: (v: string | "all") => void;
}) {
    const { styles } = useStyles();
    return (
        <View style={styles.filtersRow}>
            <TimeframeSelect value={timeframe} onChange={setTimeframe} />

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
            <Chip
                active={chainFilter === "ethereum"}
                label="Ethereum"
                onPress={() => setChainFilter("ethereum")}
            />
            <Chip

                active={chainFilter === "polygon"}
                label="Polygon"
                onPress={() => setChainFilter("polygon")}
            />
            <Chip
                active={chainFilter === "base"}
                label="Base"
                onPress={() => setChainFilter("base")}
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
    const { styles } = useStyles();
    return (
        <Pressable
            onPress={onPress}
            style={[styles.chip, active ? styles.chipActive : undefined]}
        >
            <Text style={[styles.chipText, active ? styles.chipTextActive : undefined]}>
                {label}
            </Text>
        </Pressable>
    );
}

/* ============================ Formatters ============================ */

function formatUSD(n: number) {
    if (!isFinite(n)) return "-";
    return `${n.toLocaleString(undefined, { maximumFractionDigits: 6 })} $`;
}
function formatPercent(n: number) {
    return `${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}
function formatVolume(n: number) {
    if (!isFinite(n)) return "-";
    const million = n / 1_000_000;
    return `${million.toLocaleString(undefined, { maximumFractionDigits: 2 })} $M`;
}
