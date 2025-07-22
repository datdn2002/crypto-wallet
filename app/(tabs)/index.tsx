import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const actionItem = (icon: any, label: string) => (
  <View style={styles.actionItem}>
    <Ionicons name={icon} size={28} color={styles.iconColor.color} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const tokenItem = (
  logo: string,
  name: string,
  price: string,
  volume: string,
  change: string
) => (
  <View style={[styles.tokenCard, { borderColor: styles.iconColor.color }]}>
    <Image source={{ uri: logo }} style={styles.tokenLogo} />
    <Text style={styles.tokenName}>{name}</Text>
    <Text>{price}</Text>
    <Text>{volume}</Text>
    <Text style={{ color: 'green' }}>{change}</Text>
  </View>
);

const actionItems = [
  {
    icon: 'arrow-up-circle',
    label: 'Rút',
  },
  {
    icon: 'arrow-down-circle',
    label: 'Nạp',
  },
  {
    icon: 'flash',
    label: 'Mua',
  },
  {
    icon: 'business',
    label: 'Bán',
  },
];

const tokenItems = [
  {
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    name: 'BTC',
    price: '2,05$',
    marketCap: '2,5B',
    change: '+5%',
  },
  {
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    name: 'ETH',
    price: '2,05$',
    marketCap: '2,5B',
    change: '+5%',
  },
];


export default function HomePage() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="qr-code-outline" size={22} color={theme.icon} />
        <Text style={[styles.title, { color: theme.text }]}>Crypto Wallet ▼</Text>
        <Ionicons name="person-outline" size={22} color={theme.icon} />
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={[styles.balance, { color: theme.text }]}>0.00$</Text>
        <Text style={[styles.subBalance, { color: theme.text }]}>0,00$ (0.00%)</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        {actionItems.map((item, index) => (
          <View key={index} style={styles.actionItem}>
            <Ionicons name={item.icon as any} size={28} color={theme.icon} />
            <Text style={[styles.label, { color: theme.text }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Trending */}
      <View style={styles.trendingHeader}>
        <Text style={[styles.trendingTitle, { color: theme.text }]}>Trending</Text>
        <Ionicons name="arrow-forward-outline" size={18} color="#3C78FF" />
      </View>
      <View style={styles.tokenRow}>
        {tokenItems.map((item, index) => (
          <View style={[styles.tokenCard, { borderColor: styles.iconColor.color }]} key={index}>
            <Image source={{ uri: item.logo }} style={styles.tokenLogo} />
            <Text style={[styles.tokenName, { color: theme.text }]}>{item.name}</Text>
            <Text style={{ color: theme.text }}>{item.price}</Text>
            <Text style={{ color: theme.text }}>{item.marketCap}</Text>
            <Text style={{ color: 'green' }}>{item.change}</Text>
          </View>
        ))}
      </View>


      {/* Tabs */}
      <View style={styles.tabRow}>
        <Text style={[styles.tab, styles.tabActive, { color: theme.text }]}>Tiền mã hóa</Text>
        <Text style={[styles.tab, { color: theme.icon }]}>NFT</Text>
        <Ionicons name="grid-outline" size={16} color={theme.icon} />
      </View>

      {/* Empty Wallet */}
      <View style={styles.walletEmpty}>
        <Text style={[styles.emptyText, { color: theme.text }]}>Ví của bạn đang trống!</Text>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Mua tiền mã hóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Nạp tiền mã hóa</Text>
        </TouchableOpacity>
        <Text style={[styles.linkText, { color: '#3C78FF' }]}>Quản lý tiền mã hóa</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subBalance: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  actionItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  trendingTitle: {
    fontWeight: 'bold',
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tokenCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '45%',
    alignItems: 'center',
  },
  tokenLogo: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  tokenName: {
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  tab: {
    fontSize: 14,
  },
  tabActive: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  walletEmpty: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#3C78FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  secondaryBtnText: {
    color: '#111',
  },
  linkText: {
    fontSize: 13,
  },
  iconColor: {
    color: '#999',
  },
});
