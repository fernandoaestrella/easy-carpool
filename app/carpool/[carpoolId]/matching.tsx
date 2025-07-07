import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../src/styles/colors";

// Placeholder for Carpool Matching page - will be implemented later
export default function CarpoolMatchingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carpool Matching</Text>
      <Text style={styles.subtitle}>
        This page will be implemented in the next phase
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
