import { useAuthStore } from '@/store/auth';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleContinue = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }
    if (email === 'admin@admin.com') {
      await login(email);
      router.replace('/')
    }
    Alert.alert('Continue with email:', email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Crypto Wallet</Text>

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={styles.heading}>Create an account</Text>
          <Text style={styles.subheading}>
            Enter your email to sign up for this app
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.oauthButton}>
          <FontAwesome name="google" size={20} color="#000" />
          <Text style={styles.oauthText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.oauthButton}>
          <FontAwesome name="apple" size={20} color="#000" />
          <Text style={styles.oauthText}>Continue with Apple</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By clicking continue, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 32,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 14,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  oauthText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 32,
    paddingHorizontal: 8,
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});

