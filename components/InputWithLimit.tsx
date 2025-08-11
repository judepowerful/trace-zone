import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors, ColorSchemes } from '../constants/Colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder?: string;
  multiline?: boolean;
  error?: string; // 错误提示
  style?: any;
};

export default function InputWithLimit({
  value,
  onChangeText,
  maxLength,
  placeholder,
  multiline = false,
  error,
  style,
}: Props) {
  const isError = !!error;

  return (
    <View style={{ marginBottom: 24 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={Colors.text.placeholder}
        style={[
          styles.input,
          multiline && styles.multiline,
          isError && styles.errorInput,
          style,
        ]}
      />
      <View style={styles.bottomRow}>
        <Text style={[styles.counter, isError && styles.errorText]}>
          {value.length} / {maxLength}
        </Text>
        {isError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: ColorSchemes.input.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: ColorSchemes.input.background,
    color: ColorSchemes.input.text,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    left: 10,
  },
  counter: {
    fontSize: 13,
    color: Colors.text.placeholder,
  },
  errorText: {
    fontSize: 13,
    color: Colors.border.error,
  },
  errorInput: {
    borderColor: Colors.border.error,
  },
});
