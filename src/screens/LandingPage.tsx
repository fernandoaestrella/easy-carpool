import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { colors } from "../styles/colors";
import { SmallButton } from "../components/SmallButton";

export const LandingPage: React.FC = () => {
  const handleCreateCarpool = () => {
    router.push("/create-carpool");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Easy Carpool</Text>
        <Text style={styles.subtitle}>
          Find carpool matches in the easiest way possible
        </Text>
      </View>

      {/* Main Action */}
      <View style={styles.actionSection}>
        <SmallButton
          title="Create new One Way Carpool"
          onPress={handleCreateCarpool}
        />
      </View>

      {/* Explanation Section */}
      <View style={styles.explanationSection}>
        <Text style={styles.sectionTitle}>How it works</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>No account creation needed</Text>
          <Text style={styles.featureDescription}>
            Jump right in and start organizing carpools without the hassle of
            creating accounts or managing passwords.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Automatic cleanup</Text>
          <Text style={styles.featureDescription}>
            Ride and passenger registrations are automatically deleted a few
            hours after the trip time, keeping lists clean and relevant.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Smart sorting</Text>
          <Text style={styles.featureDescription}>
            All rides and waitlist passengers are automatically sorted by
            departure times closest to your intended time, making it easy to
            find the perfect match.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Easy contact sharing</Text>
          <Text style={styles.featureDescription}>
            Copy contact information of all passengers in a ride with a single
            click, then paste into your messaging app to coordinate with
            everyone at once.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Compare departure options</Text>
          <Text style={styles.featureDescription}>
            The interface makes it simple to compare different departure times
            and dates, helping you find the most convenient option.
          </Text>
        </View>
      </View>

      {/* How to use Section */}
      <View style={styles.usageSection}>
        <Text style={styles.sectionTitle}>Getting started</Text>

        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>1</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create a carpool</Text>
            <Text style={styles.stepDescription}>
              Set up a new carpool with your trip name, email, and time zone
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>2</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Share the link</Text>
            <Text style={styles.stepDescription}>
              Share the carpool link with potential riders and passengers
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>3</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Register your trip</Text>
            <Text style={styles.stepDescription}>
              Choose to offer a ride or join as a passenger, with all trip
              details
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>4</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Connect with others</Text>
            <Text style={styles.stepDescription}>
              View matches, copy contact info, and coordinate your shared ride
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  actionSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  explanationSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 24,
  },
  featureItem: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    marginBottom: 16,
    borderRadius: 0, // No rounded borders for non-interactive elements
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  usageSection: {
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.background.tertiary,
    padding: 20,
    marginBottom: 16,
    borderRadius: 0, // No rounded borders for non-interactive elements
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.interactive.primary,
    marginRight: 16,
    minWidth: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
