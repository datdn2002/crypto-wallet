import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={22} color={theme.text} />
        <TextInput
          placeholder="Tìm kiếm hoặc nhập URL của DApp"
          placeholderTextColor="#999"
          style={[styles.searchBox, { color: theme.text, backgroundColor: theme.background }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Promo Box */}
        <View style={[styles.promoBox, { backgroundColor: '#E0EDFF' }]}>
          <Text style={styles.promoTitle}>Gia hạn Stablecoin hằng ngày trong ứng dụng.</Text>
          <View style={styles.promoRow}>
            <MaterialCommunityIcons name="gift" size={16} color="#000" />
            <Text style={styles.promoText}>Nhận thưởng hằng ngày</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.promoAction}>Bắt đầu ngay &gt;</Text>
          </View>
        </View>

        {/* News section */}
        <Text style={[styles.sectionTitle, { color: theme.tint }]}>News 24/7</Text>
        <View style={[styles.newsBox, { backgroundColor: '#E0EDFF' }]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.newsItem}>
              <Ionicons name="mail-outline" size={16} color={theme.text} />
            </View>
          ))}
        </View>

        {/* Distribution bar */}
        <Text style={[styles.sectionTitle, { color: theme.tint }]}>Phân bổ trong biến động giá</Text>
        <View style={styles.barContainer}>
          <View style={styles.redBar} />
          <View style={styles.greenBar} />
        </View>
        <View style={styles.barLabelRow}>
          <Text style={styles.redText}>35%</Text>
          <Text style={styles.greenText}>65%</Text>
        </View>

        {/* Discord CTA */}
        <TouchableOpacity style={styles.discordRow}>
          <Ionicons name="logo-discord" size={20} color="#5865F2" />
          <Text style={styles.discordText}>Join our discord!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  promoBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  promoTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoText: {
    fontSize: 13,
    color: '#000',
  },
  promoAction: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  newsBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  newsItem: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 8,
  },
  barContainer: {
    flexDirection: 'row',
    height: 10,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
  },
  redBar: {
    width: '35%',
    backgroundColor: '#EF4444',
  },
  greenBar: {
    width: '65%',
    backgroundColor: '#22C55E',
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 4,
    marginBottom: 20,
  },
  redText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  greenText: {
    color: '#15803D',
    fontWeight: '600',
  },
  discordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discordText: {
    color: '#5865F2',
    fontWeight: 'bold',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    fontSize: 13,
  },
});

