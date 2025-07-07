import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../styles/colors";

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, translateY, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  message: {
    backgroundColor: colors.neutral.primary,
    color: colors.text.inverse,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    elevation: 3,
    shadowColor: colors.neutral.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 200,
  },
});
