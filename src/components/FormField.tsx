import React from "react";
import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../styles/colors";
import { TimezoneSearchDropdown } from "./TimezoneSearchDropdown";

export interface FormFieldConfig {
  key: string;
  label: string;
  type: "text" | "email" | "timezone";
  required?: boolean;
  placeholder?: string;
  value?: string;
}

interface FormFieldProps {
  config: FormFieldConfig;
  value: string;
  onChangeText: (key: string, text: string) => void;
  error?: string;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChangeText,
  error,
  style,
}) => {
  const getKeyboardType = () => {
    switch (config.type) {
      case "email":
        return "email-address";
      default:
        return "default";
    }
  };

  const renderInput = () => {
    if (config.type === "timezone") {
      return (
        <TimezoneSearchDropdown
          value={value}
          onSelect={(timezoneId) => onChangeText(config.key, timezoneId)}
          placeholder={config.placeholder || "Select timezone"}
          error={error}
        />
      );
    }

    return (
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={(text) => onChangeText(config.key, text)}
        placeholder={config.placeholder}
        keyboardType={getKeyboardType()}
        autoCapitalize={config.type === "email" ? "none" : "words"}
        autoCorrect={false}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {config.label}
        {config.required && <Text style={styles.required}> *</Text>}
      </Text>
      {renderInput()}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.semantic.error,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 48,
  },
  inputError: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.semantic.error,
    marginTop: 4,
  },
});
