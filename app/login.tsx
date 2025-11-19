import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Book } from 'lucide-react-native';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.errorTitle'), t('login.errorAllFields'));
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(t('login.errorTitle'), t('login.errorInvalidCredentials'));
    } else {
      // The onAuthStateChange listener in AuthContext will handle the redirect to the main app.
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <Book color="#3B82F6" size={48} strokeWidth={2} />
            </View>
          </View>

          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('login.emailLabel')}</Text>
            <AuthInput
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Text style={styles.label}>{t('login.passwordLabel')}</Text>
            <AuthInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
            />

            <AuthButton
              title={t('login.signInButton')}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>{t('login.noAccount')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    fontWeight: '600',
  },
});
