import { AppHeader } from '@/components/theme'; // đảm bảo bạn đã import đúng đường dẫn
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ConnectDAppScreen() {
    const handleAddConnection = () => {
        console.log('Thêm kết nối mới');
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Kết nối DApp" rightIcon="add" onRightIconPress={handleAddConnection} />

            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/841/841364.png' }}
                    style={styles.image}
                />
                <Text style={styles.description}>
                    Kết nối ví của bạn để tương tác với các DApp và thực hiện giao dịch
                </Text>
                <Pressable style={styles.button} onPress={handleAddConnection}>
                    <Text style={styles.buttonText}>Thêm kết nối mới</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 24,
    },
    description: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#3478F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

