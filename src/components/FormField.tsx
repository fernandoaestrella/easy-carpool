import React from "react";
import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../styles/colors";
import { TimezoneSearchDropdown } from "./TimezoneSearchDropdown";

export interface FormFieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "number"
    | "checkbox"
    | "date"
    | "time"
    | "dropdown"
    | "multiline_text"
    | "display"
    | "timezone";
  required?: boolean;
  placeholder?: string;
  value?: string | boolean | number;
  options?: { label: string; value: string }[]; // for dropdown
  disabled?: boolean; // for display
}

interface FormFieldProps {
  config: FormFieldConfig;
  value: any;
  onChangeValue: (key: string, value: any) => void;
  error?: string;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChangeValue,
  error,
  style,
}) => {
  const getKeyboardType = () => {
    switch (config.type) {
      case "email":
        return "email-address";
      case "phone":
        return "phone-pad";
      case "number":
        return "numeric";
      default:
        return "default";
    }
  };

  const renderInput = () => {
    if (config.type === "timezone") {
      return (
        <TimezoneSearchDropdown
          value={typeof value === "string" ? value : ""}
          onSelect={(timezoneId) => onChangeValue(config.key, timezoneId)}
          placeholder={config.placeholder || "Select timezone"}
          error={error}
        />
      );
    }

    if (config.type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChangeValue(config.key, e.target.checked)}
          style={{ width: 20, height: 20 }}
        />
      );
    }

    if (config.type === "dropdown" && config.options) {
      return (
        <select
          style={{ minHeight: 48, borderRadius: 8, padding: 12, fontSize: 16 }}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChangeValue(config.key, e.target.value)}
        >
          <option value="" disabled>
            {config.placeholder || "Select an option"}
          </option>
          {config.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (config.type === "date") {
      return (
        <input
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChangeValue(config.key, e.target.value)}
          style={{ minHeight: 48, borderRadius: 8, padding: 12, fontSize: 16 }}
        />
      );
    }

    if (config.type === "time") {
      return (
        <input
          type="time"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChangeValue(config.key, e.target.value)}
          style={{ minHeight: 48, borderRadius: 8, padding: 12, fontSize: 16 }}
        />
      );
    }

    if (config.type === "multiline_text") {
      return (
        <TextInput
          style={[styles.input, error && styles.inputError, { minHeight: 80 }]}
          value={typeof value === "string" ? value : ""}
          onChangeText={(text) => onChangeValue(config.key, text)}
          placeholder={config.placeholder}
          multiline
          numberOfLines={4}
        />
      );
    }

    if (config.type === "display") {
      return (
        <Text style={[styles.input, { backgroundColor: "transparent" }]}>
          {String(value ?? "")}
        </Text>
      );
    }

    // phone, number, email, text
    // React Native TextInput does not support inputMode prop as a string; use keyboardType only.
    return (
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={
          typeof value === "string" || typeof value === "number"
            ? String(value)
            : ""
        }
        onChangeText={(text) => onChangeValue(config.key, text)}
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
    backgroundColor: colors.background.secondary,
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
