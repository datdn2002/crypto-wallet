import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const ActionItem = ({ icon, label }: { icon: keyof typeof Feather.glyphMap, label: string }) => (
    <View className="items-center mx-4">
        <View className="bg-primary/10 dark:bg-white/10 p-4 rounded-full mb-2">
            <Feather name={icon} size={24} className="text-primary dark:text-white" />
        </View>
        <Text className="text-sm text-gray-700 dark:text-gray-200">{label}</Text>
    </View>
);

const TokenItem = ({ img, name, price, cap, change }: any) => (
    <View className="flex-row items-center justify-between bg-white dark:bg-zinc-900 rounded-xl p-4 mb-3">
        <View className="flex-row items-center">
            <Image source={{ uri: img }} className="w-8 h-8 mr-3" />
            <View>
                <Text className="text-sm font-medium text-black dark:text-white">{name}</Text>
                <Text className="text-xs text-gray-500">{cap}</Text>
            </View>
        </View>
        <View className="items-end">
            <Text className="text-sm text-black dark:text-white">{price}</Text>
            <Text className="text-xs text-green-500">{change}</Text>
        </View>
    </View>
);

export default function Earn() {
    const { colorScheme } = useColorScheme();

    return (
        <ScrollView className="flex-1 px-4 py-6 bg-gray-50 dark:bg-black">
            <Text className="text-xl font-bold mb-6 text-black dark:text-white">Earn</Text>

            <View className="flex-row justify-between mb-8">
                <ActionItem icon="arrow-up-circle" label="Rút" />
                <ActionItem icon="arrow-down-circle" label="Nạp" />
                <ActionItem icon="trending-up" label="Lãi" />
                <ActionItem icon="refresh-ccw" label="Hoán đổi" />
            </View>

            <Text className="text-lg font-semibold mb-4 text-black dark:text-white">Danh mục đầu tư</Text>

            {[
                {
                    img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                    name: 'Bitcoin',
                    price: '66,503.12$',
                    cap: '1.3T',
                    change: '+2.5%',
                },
                {
                    img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                    name: 'Ethereum',
                    price: '3,456.80$',
                    cap: '400B',
                    change: '+1.2%',
                },
            ].map((token) => (
                <TokenItem key={token.name} {...token} />
            ))}
        </ScrollView>
    );
}
