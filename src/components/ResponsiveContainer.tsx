import React from "react";
import { View, StyleSheet, useWindowDimensions, ViewStyle } from "react-native";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * ResponsiveContainer limits width to 65% of the screen on desktop/tablet, full width on mobile.
 * Centers content horizontally on large screens.
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <View style={[styles.container, !isMobile && styles.desktop, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },
  desktop: {
    maxWidth: "65%",
    minWidth: 320,
    alignSelf: "center",
  },
});
