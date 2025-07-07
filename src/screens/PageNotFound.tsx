import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { colors } from "../styles/colors";
import { SmallButton } from "../components/SmallButton";
import { ResponsiveContainer } from "../components/ResponsiveContainer";

const HEADING_MESSAGES = [
  "Looks like this ride took a wrong turn!",
  "This page carpooled away without us",
  "Oops! This page missed its carpool",
  "This route doesn't exist in our GPS",
  "Page not found - it must have taken the scenic route",
];

const BODY_MESSAGES = [
  "Don't worry, even the best drivers sometimes miss an exit. Let's get you back on the right road!",
  "This page seems to have hitched a ride elsewhere. Good thing you know someone with a car!",
  "Looks like this link got lost without a co-pilot. Time to navigate back to safety!",
  "Even carpoolers sometimes end up at the wrong destination. Let's find your way back!",
];

const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export const PageNotFound: React.FC = () => {
  const handleGoHome = () => {
    // For now, just reload the page to go back to home
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const randomHeading = getRandomMessage(HEADING_MESSAGES);
  const randomBody = getRandomMessage(BODY_MESSAGES);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ResponsiveContainer>
        {/* Illustration */}
        <View style={styles.illustrationSection}>
          <Image
            source={require("../../assets/lost_in_mountains.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>{randomHeading}</Text>
        </View>

        {/* Body Text */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyText}>{randomBody}</Text>
        </View>

        {/* Suggestion */}
        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionText}>
            Make sure to type or enter the link correctly, or ask your carpool
            group to resend the correct link.
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <SmallButton title="Back to Safe Roads" onPress={handleGoHome} />
        </View>
      </ResponsiveContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  illustration: {
    width: 280,
    height: 200,
    opacity: 0.9,
  },
  headingSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 34,
  },
  bodySection: {
    marginBottom: 32,
    alignItems: "center",
  },
  bodyText: {
    fontSize: 18,
    color: colors.neutral.primary,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 400,
  },
  suggestionSection: {
    marginBottom: 40,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    maxWidth: 420,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
  actionSection: {
    alignItems: "center",
  },
});
