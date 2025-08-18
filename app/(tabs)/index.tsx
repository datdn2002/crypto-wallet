import { Wallets } from '@/components/wallet';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const actionItems = [
  { icon: 'arrow-up-circle', label: 'Rút' },
  { icon: 'arrow-down-circle', label: 'Nạp' },
  { icon: 'flash', label: 'Mua' },
  { icon: 'business', label: 'Bán' },
];

const tokenItems = [
  {
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    name: 'NAME',
    price: '2,05$',
    marketCap: '2,5B',
    change: '+5%',
  },
  {
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    name: 'NAME',
    price: '2,05$',
    marketCap: '2,5B',
    change: '+5%',
  },
];

export default function HomePage() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [isOpenModalWallet, setIsOpenModalWallet] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Modal chọn ví - GIỮ NGUYÊN */}
      <Wallets visible={isOpenModalWallet} onClose={() => setIsOpenModalWallet(false)} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(scan)/qr')} style={styles.headerIconBtn}>
          <Ionicons name="qr-code-outline" size={20} color={theme.icon} />
        </Pressable>

        <Pressable onPress={() => setIsOpenModalWallet(true)} style={styles.walletSwitcher}>
          <Text style={[styles.walletTitle, { color: theme.text }]}>Crypto Wallet</Text>
          <Ionicons name="chevron-down" size={16} color={theme.icon} style={{ marginLeft: 4 }} />
        </Pressable>

        {/* GIỮ CHỨC NĂNG Link /account, chỉ đổi icon cho giống ảnh */}
        <Link href={'/account' as any} asChild>
          <Pressable style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={20} color={theme.icon} />
          </Pressable>
        </Link>
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={[styles.balance, { color: theme.text }]}>0.00$</Text>
        <Text style={[styles.subBalance, { color: theme.icon }]}>0,00$ (0.00%)</Text>
      </View>

      {/* Quick actions */}
      <View style={styles.actionRow}>
        {actionItems.map((item, idx) => (
          <View key={idx} style={styles.actionCol}>
            <View style={[styles.actionIconBox, { borderColor: theme.icon }]}>
              <Ionicons name={item.icon as any} size={32} color="#3C78FF" />
            </View>
            <Text style={[styles.actionLabel, { color: theme.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Trending */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending</Text>
        <Ionicons name="arrow-forward-outline" size={18} color="#3C78FF" />
      </View>

      <View style={styles.tokenRow}>
        {tokenItems.map((t, i) => (
          <View key={i} style={[styles.tokenCard]}>
            <View style={styles.tokenLeft}>
              <View style={styles.tokenLogoWrap}>
                <Image source={{ uri: t.logo }} style={styles.tokenLogo} />
              </View>
              <View>
                <Text style={[styles.tokenName, { color: theme.text }]} numberOfLines={1}>
                  {t.name}
                </Text>
                <Text style={[styles.tokenSub, { color: theme.icon }]}>{t.marketCap}</Text>
              </View>
            </View>

            <View style={styles.tokenRight}>
              <Text style={[styles.tokenPrice, { color: theme.text }]}>{t.price}</Text>
              <Text style={styles.tokenChange}>{t.change}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabsLeft}>
          <Text style={[styles.tabTextActive, { color: theme.text }]}>Tiền mã hóa</Text>
          <View style={[styles.tabIndicator, { backgroundColor: theme.text }]} />
        </View>
        <Text style={[styles.tabText, { color: theme.icon }]}>NFT</Text>
        <View style={{ flex: 1 }} />
        <Ionicons name="options-outline" size={18} color={theme.icon} />
      </View>

      {/* Empty State */}
      <View style={styles.emptyWrap}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>Ví của bạn đang trống!</Text>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Mua tiền mã hóa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Nạp tiền mã hóa</Text>
        </TouchableOpacity>

        <Text style={styles.manageLink}>Quản lý tiền mã hóa</Text>
      </View>
    </ScrollView>
  );
}

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerIconBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  walletTitle: { fontSize: 16, fontWeight: '600' },

  /* Balance */
  balanceSection: { alignItems: 'center', paddingVertical: 6 },
  balance: { fontSize: 28, fontWeight: '700' },
  subBalance: { fontSize: 12, marginTop: 2 },

  /* Quick actions */
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: "10%",
    marginTop: 16,
    marginBottom: 10,

  },
  actionCol: { alignItems: 'center', width: '25%' },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#F5F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  actionLabel: { fontSize: 12, marginTop: 6 },

  /* Section header */
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },

  /* Trending tokens */
  tokenRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 10,
  },
  tokenCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tokenLogoWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF3FF',
  },
  tokenLogo: { width: 20, height: 20, resizeMode: 'contain' },
  tokenName: { fontSize: 13, fontWeight: '600' },
  tokenSub: { fontSize: 11 },
  tokenRight: { alignItems: 'flex-end', justifyContent: 'center' },
  tokenPrice: { fontSize: 13, fontWeight: '600' },
  tokenChange: { fontSize: 11, color: '#12B76A', marginTop: 2 },

  /* Tabs */
  tabsWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  tabsLeft: { alignItems: 'center' },
  tabTextActive: { fontSize: 14, fontWeight: '600' },
  tabIndicator: {
    width: 36,
    height: 2,
    backgroundColor: '#111',
    borderRadius: 2,
    marginTop: 6,
    alignSelf: 'center',
  },
  tabText: { fontSize: 14, marginLeft: 16 },

  /* Empty state */
  emptyWrap: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 },
  emptyTitle: { fontSize: 13, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: '#3C78FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '86%',
    alignItems: 'center',
    ...cardShadow,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#E9ECEF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '86%',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryBtnText: { color: '#111', fontWeight: '600' },
  manageLink: { color: '#3C78FF', fontSize: 12, marginTop: 12 },

  /* Misc */
  iconColor: { color: '#999' },
});
