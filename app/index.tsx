import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../src/styles/colors";
import { SmallButton } from "../src/components/SmallButton";

export default function LandingPage() {
  const handleCreateCarpool = () => {
    // TODO: Navigate to Create New One Way Carpool screen
    console.log("Navigate to create carpool");
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
            Rides and passengers are automatically sorted by departure time
            proximity, making it easy to find the best matches.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Easy contact sharing</Text>
          <Text style={styles.featureDescription}>
            Copy contact information of all passengers with a single click to
            coordinate meeting details.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Flexible timing</Text>
          <Text style={styles.featureDescription}>
            Set fixed departure times or flexible time ranges to accommodate
            different schedules and preferences.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Visual availability</Text>
          <Text style={styles.featureDescription}>
            See seat availability at a glance with clear visual indicators for
            available and taken seats in each ride.
          </Text>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why carpool?</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Save money</Text>
          <Text style={styles.featureDescription}>
            Split gas and parking costs with fellow travelers, making trips more
            affordable for everyone.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Reduce environmental impact</Text>
          <Text style={styles.featureDescription}>
            Fewer cars on the road means reduced emissions and a smaller carbon
            footprint for your travels.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Meet new people</Text>
          <Text style={styles.featureDescription}>
            Connect with fellow travelers and make new friends while sharing the
            journey.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Enjoy the ride</Text>
          <Text style={styles.featureDescription}>
            Share conversations, play games, or simply enjoy companionship
            instead of driving alone.
          </Text>
        </View>
      </View>

      {/* Getting Started Section */}
      <View style={styles.gettingStartedSection}>
        <Text style={styles.sectionTitle}>Ready to get started?</Text>
        <Text style={styles.gettingStartedDescription}>
          Create your first carpool in just a few simple steps. No registration
          required - just provide your trip details and contact information to
          connect with other travelers.
        </Text>

        <View style={styles.finalActionSection}>
          <SmallButton
            title="Create new One Way Carpool"
            onPress={handleCreateCarpool}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 48,
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 28,
    maxWidth: 400,
  },
  actionSection: {
    alignItems: "center",
    marginBottom: 64,
  },
  explanationSection: {
    marginBottom: 48,
  },
  benefitsSection: {
    marginBottom: 48,
  },
  gettingStartedSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 32,
    textAlign: "center",
  },
  featureItem: {
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  gettingStartedDescription: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: 500,
  },
  finalActionSection: {
    alignItems: "center",
  },
});
