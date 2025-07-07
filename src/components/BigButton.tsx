import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../styles/colors";

interface BigButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "danger";
}

export const BigButton: React.FC<BigButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = "primary",
}) => {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;

    switch (variant) {
      case "secondary":
        return styles.buttonSecondary;
      case "danger":
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.buttonTextDisabled;

    switch (variant) {
      case "secondary":
        return styles.buttonTextSecondary;
      case "danger":
        return styles.buttonTextDanger;
      default:
        return styles.buttonTextPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 64,
    paddingVertical: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 400,
    minHeight: 96,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: colors.interactive.primary,
    shadowColor: colors.interactive.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.background.tertiary,
    shadowColor: colors.neutral.primary,
  },
  buttonDanger: {
    backgroundColor: colors.semantic.error,
    shadowColor: colors.semantic.error,
  },
  buttonDisabled: {
    backgroundColor: colors.neutral.tertiary,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonTextPrimary: {
    color: colors.text.inverse,
  },
  buttonTextSecondary: {
    color: colors.text.primary,
  },
  buttonTextDanger: {
    color: colors.text.inverse,
  },
  buttonTextDisabled: {
    color: colors.text.tertiary,
  },
});
