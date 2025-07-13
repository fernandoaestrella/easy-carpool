import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
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
  min?: number;
  max?: number;
  default?: number;
}

interface FormFieldProps {
  config: FormFieldConfig;
  value: any;
  onChangeValue: (key: string, value: any) => void;
  error?: string;
  style?: ViewStyle;
  min?: number;
  max?: number;
  default?: number;
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

  // Local error state for phone validation
  const [phoneError, setPhoneError] = React.useState<string | null>(null);

  const renderInput = () => {
    // Number field with increment/decrement buttons
    if (config.type === "number") {
      const min = typeof config.min === "number" ? config.min : 1;
      const max = typeof config.max === "number" ? config.max : 999;
      const [isFocused, setIsFocused] = React.useState(false);
      // Allow any value while focused, coerce on blur
      const handleBlur = () => {
        setIsFocused(false);
        let coerced = Number(value);
        if (isNaN(coerced)) coerced = min;
        if (coerced < min) coerced = min;
        if (coerced > max) coerced = max;
        if (coerced !== value) onChangeValue(config.key, coerced);
      };
      const handleChange = (text: string) => {
        // Allow empty string for clearing
        if (/^\d{0,3}$/.test(text)) {
          onChangeValue(config.key, text === "" ? "" : Number(text));
        }
      };
      const handleIncrement = () => {
        let v = Number(value) || min;
        if (v < max) onChangeValue(config.key, v + 1);
      };
      const handleDecrement = () => {
        let v = Number(value) || min;
        if (v > min) onChangeValue(config.key, v - 1);
      };
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleDecrement}
            accessibilityRole="button"
            accessibilityLabel="Decrease"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.interactive.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, lineHeight: 28 }}>
              -
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              { width: 64, textAlign: "center" },
            ]}
            value={value === undefined || value === null ? "" : String(value)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChangeText={handleChange}
            placeholder={config.placeholder}
            keyboardType="numeric"
            accessibilityLabel={config.label}
            maxLength={3}
          />
          <TouchableOpacity
            onPress={handleIncrement}
            accessibilityRole="button"
            accessibilityLabel="Increase"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.interactive.primary,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, lineHeight: 28 }}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
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

    // Focus state for border
    const [isFocused, setIsFocused] = React.useState(false);
    const focusBorder = isFocused
      ? "1.5px solid " + colors.interactive.primary
      : "none";

    if (config.type === "dropdown" && config.options) {
      return (
        <select
          style={{
            minHeight: 48,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            border: focusBorder,
            backgroundColor: colors.background.secondary,
          }}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChangeValue(config.key, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
          style={{
            minHeight: 48,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            border: focusBorder,
            backgroundColor: colors.background.secondary,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      );
    }

    if (config.type === "time") {
      return (
        <input
          type="time"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChangeValue(config.key, e.target.value)}
          style={{
            minHeight: 48,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            border: focusBorder,
            backgroundColor: colors.background.secondary,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

    // phone, email, text
    if (config.type === "phone") {
      return (
        <>
          <TextInput
            style={[styles.input, (error || phoneError) && styles.inputError]}
            value={
              typeof value === "string" || typeof value === "number"
                ? String(value)
                : ""
            }
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setPhoneError(null);
                onChangeValue(config.key, text);
              } else {
                setPhoneError("Phone number must contain numbers only");
              }
            }}
            placeholder={config.placeholder}
            keyboardType={getKeyboardType()}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
          />
          {(error || phoneError) && (
            <Text style={styles.errorText}>{error || phoneError}</Text>
          )}
        </>
      );
    }
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

  // For phone, error is rendered inside renderInput
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {config.label}
        {config.required && <Text style={styles.required}> *</Text>}
      </Text>
      {renderInput()}
      {config.type !== "phone" && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
