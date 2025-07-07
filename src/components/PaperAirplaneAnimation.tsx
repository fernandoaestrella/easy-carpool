import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { colors } from "../styles/colors";

interface PaperAirplaneAnimationProps {
  trigger: boolean;
  onComplete: () => void;
}

export const PaperAirplaneAnimation: React.FC<PaperAirplaneAnimationProps> = ({
  trigger,
  onComplete,
}) => {
  const translateX = useRef(new Animated.Value(-150)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    if (trigger) {
      // Reset position
      translateX.setValue(-150);
      translateY.setValue(0);

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: screenWidth + 50,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -30,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete();
      });
    }
  }, [trigger, translateX, translateY, screenWidth, onComplete]);

  if (!trigger) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: screenHeight * 0.7,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      <View style={styles.airplane}>
        <View style={styles.topWing} />
        <View style={styles.bottomWing} />
        <View style={styles.mainBody} />
        <View style={styles.centerFold} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
    elevation: 1000,
  },
  airplane: {
    width: 96,
    height: 96,
    position: "relative",
  },
  // Main triangular body of the paper airplane
  mainBody: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 60,
    borderRightWidth: 0,
    borderBottomWidth: 30,
    borderTopWidth: 30,
    borderLeftColor: "white",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    top: 18,
    left: 36,
  },
  // Top wing fold
  topWing: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderRightWidth: 12,
    borderBottomWidth: 0,
    borderTopWidth: 18,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "#666666",
    top: 24,
    left: 12,
    transform: [{ rotate: "45deg" }],
  },
  // Bottom wing fold
  bottomWing: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderRightWidth: 12,
    borderBottomWidth: 18,
    borderTopWidth: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#666666",
    borderTopColor: "transparent",
    top: 54,
    left: 12,
    transform: [{ rotate: "-45deg" }],
  },
  // Center fold line
  centerFold: {
    position: "absolute",
    width: 40,
    height: 2,
    backgroundColor: "#666666",
    top: 47,
    left: 28,
    opacity: 0.7,
  },
});
