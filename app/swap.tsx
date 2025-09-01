import { getSwapInfoApi, swapTxApi } from '@/api';
import { CountdownCircle } from '@/components/CountdownCircle';
import { AppHeader } from '@/components/theme';
import { TokenPicker } from '@/components/TokenPicker';
import { TokenView } from '@/components/TokenView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/auth';
import { Token, useWalletStore } from '@/store/wallet';
import { CHAIN_ID_MAP, ChainKey } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SwapScreen() {
    const bg = useThemeColor({}, 'background');
    const isFocused = useIsFocused();
    const { tokens, defaultWallet } = useWalletStore();
    const { access_token } = useAuthStore();
    const [fromToken, setFromToken] = useState<Token>(tokens?.[0]);
    const [toToken, setToToken] = useState<Token>(tokens?.[1]);
    const [showSelectToken, setShowSelectToken] = useState<'to' | 'from' | null>(null);
    const [swapInfo, setSwapInfo] = useState<any>({});
    const [value, setValue] = useState("0");
    const [refetch, setRefetch] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!access_token) return;
            if (parseInt(value) <= 0 || Number.isNaN(parseInt(value))) {
                return setSwapInfo({});
            }
            const res = await getSwapInfoApi({
                token: access_token,
                params: {
                    chainId: (CHAIN_ID_MAP?.[fromToken.chain as ChainKey] || "1") + "",
                    amount: value,
                    fromTokenAddress: fromToken.token_address,
                    toTokenAddress: toToken.token_address,
                }
            })
            if (res.statusCode === 200) {
                setSwapInfo(res.data)
            }
        };
        fetchData();
    }, [fromToken, toToken, value, access_token, isFocused, refetch])

    const handleChangeToken = (type: 'to' | 'from') => {
        setShowSelectToken(type);
    }

    const handlePickToken = (token: Token) => {
        if (showSelectToken === "from") {
            setFromToken(token);
        } else if (showSelectToken === "to") {
            setToToken(token);
        }
        setShowSelectToken(null);
    }

    const handleSwap = async () => {
        if (!access_token) return;
        const res = swapTxApi({
            token: access_token, params: {
                chainId: (CHAIN_ID_MAP?.[fromToken.chain as ChainKey] || "1") + "",
                amount: value,
                fromTokenAddress: fromToken.token_address,
                toTokenAddress: toToken.token_address,
                slippage: 2,
                userAddress: defaultWallet?.walletAddresses?.length ? defaultWallet.walletAddresses[0].address : "",
            }
        })
    }

    return (
        <View style={{ backgroundColor: bg, height: '100%' }}>
            <AppHeader title='Hoán đổi' />
            <View style={styles.container}>
                <View style={styles.boxContainer}>
                    {/* From */}
                    <View style={styles.box}>
                        <View style={styles.boxHeader}>
                            <Text style={styles.boxTitle}>Từ</Text>
                            <Text style={styles.boxBalance}>Khả dụng: {fromToken.balance}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TokenView token={fromToken} onPress={() => handleChangeToken('from')} />
                            <TextInput
                                value={value}
                                onChangeText={setValue}
                                keyboardType={Platform.select({ ios: "decimal-pad", android: "numeric" })}
                                style={{ textAlign: 'right', fontSize: 16, fontWeight: '500', color: '#222' }}
                            />
                        </View>
                    </View>

                    {/* Arrow Between */}
                    <View style={styles.switchIconContainer}>
                        <TouchableOpacity onPress={() => {
                            const temp = fromToken;
                            setFromToken(toToken);
                            setToToken(temp);
                        }}>
                            <Ionicons name="swap-vertical" size={20} color="#3C78FF" />
                        </TouchableOpacity>
                    </View>

                    {/* To */}
                    <View style={styles.box}>
                        <View style={styles.boxHeader}>
                            <Text style={styles.boxTitle}>Đến</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TokenView token={toToken} onPress={() => handleChangeToken("to")} />
                            <Text style={styles.amount}>{swapInfo?.dstAmount}</Text>
                        </View>
                    </View>
                </View>

                {/* Rate */}
                {swapInfo?.summary?.direct && <View style={styles.boxContainer}>
                    <View style={[styles.box, { gap: 6 }]}>
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <CountdownCircle onComplete={async () => setRefetch(pre => ++pre)} />
                            <Text style={styles.rateText}>{swapInfo?.summary?.direct}</Text>
                        </View>
                        <View style={styles.rateRow}>
                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Phí tổng hợp:</Text>
                            <Text>{swapInfo?.gas}</Text>
                        </View>
                    </View>
                </View>}

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
                excludedTokens={showSelectToken === 'to' ? [fromToken.chain + fromToken.symbol] : [toToken.chain + toToken.symbol]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    chip: {
        backgroundColor: '#eef3ff',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    chipText: {
        fontSize: 13,
        color: '#3C78FF',
    },
    rateRow: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: "space-between"
    },
    rateText: {
        fontSize: 13,
        color: '#000',
    },
    rateGreen: {
        fontSize: 13,
        color: 'green',
        marginLeft: 6,
    },
    boxContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    box: {
        backgroundColor: '#f2f7ff',
        padding: 12,
    },
    boxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    boxTitle: {
        fontSize: 13,
        color: '#555',
    },
    boxBalance: {
        fontSize: 12,
        color: '#3C78FF',
    },
    boxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    coin: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    amount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    switchIconContainer: {
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: '#f2f7ff',
    },
    button: {
        backgroundColor: '#3C78FF',
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
