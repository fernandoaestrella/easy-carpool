import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../styles/colors";

interface SmallButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SmallButton: React.FC<SmallButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.interactive.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    elevation: 2,
    shadowColor: colors.neutral.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: colors.neutral.tertiary,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonTextDisabled: {
    color: colors.text.tertiary,
  },
});
