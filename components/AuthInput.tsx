import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

type AuthInputProps = TextInputProps & {
  placeholder: string;
};

export default function AuthInput({ placeholder, style, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
});
