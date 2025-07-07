import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

interface CopyIconProps {
  size?: number;
  color?: string;
}

export const CopyIcon: React.FC<CopyIconProps> = ({
  size = 16,
  color = colors.text.secondary,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer rectangle */}
      <View
        style={[
          styles.outerRect,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderColor: color,
            top: size * 0.25,
            left: size * 0.25,
          },
        ]}
      />
      {/* Inner rectangle */}
      <View
        style={[
          styles.innerRect,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderColor: color,
            backgroundColor: colors.background.primary,
            top: 0,
            left: 0,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  outerRect: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 2,
  },
  innerRect: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 2,
  },
});
