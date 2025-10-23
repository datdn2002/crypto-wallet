import { getSwapInfoApi, swapTxApi } from "@/api";
import { CountdownCircle } from "@/components/CountdownCircle";
import { PercentageSelector } from "@/components/PercentageSelector";
import { AppHeader } from "@/components/theme";
import { TokenPicker } from "@/components/TokenPicker";
import { TokenView } from "@/components/TokenView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { Token, useWalletStore } from "@/store/wallet";
import { CHAIN_ID_MAP, ChainKey } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SwapScreen() {
	const bg = useThemeColor({}, "background");
	const isFocused = useIsFocused();
	const { tokens = [], defaultWallet } = useWalletStore();
	const { access_token } = useAuthStore();

	const [fromToken, setFromToken] = useState<Token | undefined>(tokens[0]);
	const [toToken, setToToken] = useState<Token | undefined>(tokens[1]);
	const [showSelectToken, setShowSelectToken] = useState<"to" | "from" | null>(null);
	const [showPercentageSelector, setShowPercentageSelector] = useState(false);
	const [slippage, setSlippage] = useState(2);
	const [swapInfo, setSwapInfo] = useState<any>({});
	const [value, setValue] = useState("0");
	const [refetch, setRefetch] = useState(0);

	const amount = Number.parseFloat(value.replace(",", "."));
	const canQuote = !!access_token && !!fromToken && !!toToken && Number.isFinite(amount) && amount > 0;

	useEffect(() => {
		if (!isFocused) return;
		let canceled = false;
		const t = setTimeout(async () => {
			if (!canQuote) {
				if (!canceled) setSwapInfo({});
				return;
			}
			try {
				const chainId = (CHAIN_ID_MAP?.[fromToken!.chain as ChainKey] || "1") + "";
				const res = await getSwapInfoApi({
					token: access_token!,
					params: {
						chainId,
						amount: value,
						fromTokenAddress: fromToken!.token_address,
						toTokenAddress: toToken!.token_address,
					},
				});
				if (!canceled && res?.statusCode === 200) {
					setSwapInfo(res.data);
				}
			} catch (e) {
				if (!canceled) setSwapInfo({});
			}
		}, 400);
		return () => {
			canceled = true;
			clearTimeout(t);
		};
	}, [fromToken, toToken, value, access_token, isFocused, refetch]);

	const handleChangeToken = (type: "to" | "from") => setShowSelectToken(type);

	const handlePickToken = (token: Token) => {
		if (showSelectToken === "from") {
			setFromToken(token);
			if (toToken && toToken.chain + toToken.symbol === token.chain + token.symbol) {
				setToToken(undefined);
			}
		} else if (showSelectToken === "to") {
			setToToken(token);
			if (fromToken && fromToken.chain + fromToken.symbol === token.chain + token.symbol) {
				setFromToken(undefined);
			}
		}
		setShowSelectToken(null);
	};

	const handleSwap = async () => {
		if (!access_token || !fromToken || !toToken || !canQuote || !defaultWallet?.walletAddresses?.length) return;
		Toast.show({ text1: "Đang xử lí...", type: "info" });
		try {
			const res = await swapTxApi({
				token: access_token,
				params: {
					chainId: (CHAIN_ID_MAP?.[fromToken.chain as ChainKey] || "1") + "",
					amount: value,
					fromTokenAddress: fromToken.token_address,
					toTokenAddress: toToken.token_address,
					slippage: slippage,
					userAddress: defaultWallet.walletAddresses[0].address,
				},
			});
			if (!(res as any)?.success) {
				Toast.show({
					type: "error",
					text1: (res as any)?.message || "Lỗi khi hoán đổi",
				});
			} else {
				Toast.show({ text1: "Hoán đổi thành công", type: "success" });
			}
		} catch (e) {
			Toast.show({
				type: "error",
				text1: "Lỗi khi hoán đổi",
			});
		}
	};

	return (
		<View style={{ backgroundColor: bg, height: "100%" }}>
			<AppHeader
				title="Hoán đổi"
				rightElement={
					<Pressable
						style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#ccc", padding: 4, borderRadius: 8 }}
						onPress={() => setShowPercentageSelector(true)}
					>
						<Text>{slippage}%</Text>
						<MaterialIcons name="tune" size={20} color="#333" />
					</Pressable>
				}
			/>
			<View style={styles.container}>
				<View style={styles.boxContainer}>
					{/* From */}
					<View style={styles.box}>
						<View style={styles.boxHeader}>
							<Text style={styles.boxTitle}>Từ</Text>
							<Text style={styles.boxBalance}>Khả dụng: {fromToken?.balance ?? "--"}</Text>
						</View>

						<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<TokenView token={fromToken} onPress={() => handleChangeToken("from")} />
							<TextInput
								value={value}
								onChangeText={setValue}
								keyboardType={Platform.select({ ios: "decimal-pad", android: "numeric" })}
								// gợi ý: thêm inputMode="decimal" để Android hiện phím dấu chấm trên 1 số máy
								inputMode="decimal"
								placeholder="0.0"
								placeholderTextColor="#9aa3af"
								style={{ textAlign: "right", fontSize: 16, fontWeight: "500", color: "#222" }}
							/>
						</View>
					</View>

					{/* Arrow Between */}
					<View style={styles.switchIconContainer}>
						<TouchableOpacity
							onPress={() => {
								const temp = fromToken;
								setFromToken(toToken);
								setToToken(temp);
							}}
						>
							<MaterialIcons name="swap-vert" size={28} color="#3C78FF" />
						</TouchableOpacity>
					</View>

					{/* To */}
					<View style={styles.box}>
						<View style={styles.boxHeader}>
							<Text style={styles.boxTitle}>Đến</Text>
						</View>
						<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<TokenView token={toToken} onPress={() => handleChangeToken("to")} />
							<Text style={styles.amount}>{swapInfo?.dstAmount ?? "--"}</Text>
						</View>
					</View>
				</View>

				{/* Rate */}
				{swapInfo?.summary?.direct && (
					<View style={styles.boxContainer}>
						<View style={[styles.box, { gap: 6 }]}>
							<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
								<CountdownCircle onComplete={async () => setRefetch((pre) => pre + 1)} />
								<Text style={styles.rateText}>{swapInfo.summary.direct}</Text>
							</View>
							<View style={styles.rateRow}>
								<Text style={{ fontSize: 14, fontWeight: "500" }}>Phí tổng hợp:</Text>
								<Text>{swapInfo?.gas ?? "--"}</Text>
							</View>
						</View>
					</View>
				)}

				{/* Continue Button */}
				<TouchableOpacity
					style={[styles.button, !swapInfo?.dstAmount ? { backgroundColor: "#ccc" } : null]}
					disabled={!swapInfo?.dstAmount}
					onPress={handleSwap}
				>
					<Text style={styles.buttonText}>Xác nhận</Text>
				</TouchableOpacity>
			</View>

			<TokenPicker
				visible={showSelectToken !== null}
				onClose={() => setShowSelectToken(null)}
				onPick={handlePickToken}
				excludedTokens={
					showSelectToken === "to"
						? [fromToken ? fromToken.chain + fromToken.symbol : ""]
						: [toToken ? toToken.chain + toToken.symbol : ""]
				}
			/>

			<PercentageSelector
				visible={showPercentageSelector}
				onClose={() => setShowPercentageSelector(false)}
				value={slippage}
				onChange={setSlippage}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	chipContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 8,
	},
	chip: {
		backgroundColor: "#eef3ff",
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 12,
	},
	chipText: {
		fontSize: 13,
		color: "#3C78FF",
	},
	rateRow: {
		flexDirection: "row",
		gap: 8,
		justifyContent: "space-between",
	},
	rateText: {
		fontSize: 13,
		color: "#000",
	},
	rateGreen: {
		fontSize: 13,
		color: "green",
		marginLeft: 6,
	},
	boxContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 20,
	},
	box: {
		backgroundColor: "#f2f7ff",
		padding: 12,
	},
	boxHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	boxTitle: {
		fontSize: 13,
		color: "#555",
	},
	boxBalance: {
		fontSize: 12,
		color: "#3C78FF",
	},
	boxRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	coin: {
		fontSize: 16,
		fontWeight: "500",
		color: "#222",
	},
	amount: {
		fontSize: 16,
		fontWeight: "500",
		color: "#222",
	},
	switchIconContainer: {
		alignItems: "center",
		paddingVertical: 6,
		backgroundColor: "#f2f7ff",
	},
	button: {
		backgroundColor: "#3C78FF",
		paddingVertical: 14,
		borderRadius: 20,
		alignItems: "center",
		marginHorizontal: 20,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
});
