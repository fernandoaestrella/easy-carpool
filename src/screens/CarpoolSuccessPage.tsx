import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { colors } from "../styles/colors";
import { BigButton } from "../components/BigButton";
import { SmallButton } from "../components/SmallButton";
import { CopyIcon } from "../components/CopyIcon";
import { PaperAirplaneAnimation } from "../components/PaperAirplaneAnimation";

export const CarpoolSuccessPage: React.FC = () => {
  const { carpoolId } = useLocalSearchParams<{ carpoolId: string }>();
  const [animationTrigger, setAnimationTrigger] = useState(false);

  if (!carpoolId) {
    router.replace("/+not-found");
    return null;
  }

  // Generate URLs for sharing
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://your-app-domain.com";
  const matchingUrl = `${baseUrl}/carpool/${carpoolId}/matching`;
  const editUrl = `${baseUrl}/carpool/${carpoolId}/edit`;

  const handleCopyMatchingUrl = async () => {
    await Clipboard.setStringAsync(matchingUrl);
    setAnimationTrigger(true);
  };

  const handleCopyEditUrl = async () => {
    await Clipboard.setStringAsync(editUrl);
    setAnimationTrigger(true);
  };

  const handleCopyBothUrls = async () => {
    const bothUrls = `Carpool Matching Link: ${matchingUrl}\nCarpool Edit Link: ${editUrl}`;
    await Clipboard.setStringAsync(bothUrls);
    setAnimationTrigger(true);
  };

  const handleGoToMatching = () => {
    router.push(`/carpool/${carpoolId}/matching`);
  };

  const handleGoToEdit = () => {
    router.push(`/carpool/${carpoolId}/edit`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerSection}>
        <Text style={styles.title}>Carpool Created Successfully!</Text>
        <Text style={styles.subtitle}>
          Your carpool has been created. Share these links to get started.
        </Text>
      </View>

      {/* Matching Link Section - Emphasized */}
      <View style={styles.linkSection}>
        <View style={styles.linkHeader}>
          <Text style={styles.linkTitle}>Carpool Matching Page</Text>
          <Text style={styles.linkDescription}>
            This is where participants will join your carpool, register as
            drivers or passengers, and find matches. Share this link with
            everyone who wants to participate.
          </Text>
        </View>

        <View style={styles.urlContainer}>
          <Text style={styles.urlText}>{matchingUrl}</Text>
        </View>

        <View style={styles.copyButtonContainer}>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyMatchingUrl}
          >
            <View style={styles.copyButtonContent}>
              <CopyIcon size={16} color={colors.text.primary} />
              <Text style={styles.copyButtonText}>Copy Link</Text>
            </View>
          </TouchableOpacity>
        </View>

        <BigButton
          title="Go to Matching Page"
          onPress={handleGoToMatching}
          style={styles.primaryButton}
        />
      </View>

      {/* Edit Link Section - Less emphasized */}
      <View style={styles.linkSectionSecondary}>
        <View style={styles.linkHeader}>
          <Text style={styles.linkTitleSecondary}>Carpool Edit Page</Text>
          <Text style={styles.linkDescriptionSecondary}>
            Use this link to update carpool details or delete the carpool. Keep
            this private - only share with carpool organizers.
          </Text>
        </View>

        <View style={styles.urlContainerSecondary}>
          <Text style={styles.urlTextSecondary}>{editUrl}</Text>
        </View>

        <View style={styles.copyButtonContainer}>
          <TouchableOpacity
            style={styles.copyButtonSecondary}
            onPress={handleCopyEditUrl}
          >
            <View style={styles.copyButtonContent}>
              <CopyIcon size={16} color={colors.text.secondary} />
              <Text
                style={[
                  styles.copyButtonText,
                  { color: colors.text.secondary },
                ]}
              >
                Copy Link
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <SmallButton
          title="Go to Edit Page"
          onPress={handleGoToEdit}
          style={styles.secondaryButton}
        />
      </View>

      {/* Copy Both Section */}
      <View style={styles.copyBothSection}>
        <TouchableOpacity
          style={styles.copyBothButton}
          onPress={handleCopyBothUrls}
        >
          <View style={styles.copyButtonContent}>
            <CopyIcon size={16} color={colors.text.primary} />
            <Text style={styles.copyBothButtonText}>Copy Both Links</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Paper Airplane Animation */}
      <PaperAirplaneAnimation
        trigger={animationTrigger}
        onComplete={() => setAnimationTrigger(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
  },
  headerSection: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  linkSection: {
    backgroundColor: colors.interactive.secondary,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  linkSectionSecondary: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  linkHeader: {
    marginBottom: 16,
  },
  linkTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  linkTitleSecondary: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 8,
  },
  linkDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  linkDescriptionSecondary: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  urlContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  urlContainerSecondary: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  urlText: {
    fontSize: 12,
    color: colors.text.primary,
    fontFamily: "monospace",
  },
  urlTextSecondary: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: "monospace",
  },
  copyButtonContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.neutral.secondary,
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.tertiary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  copyButtonSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.tertiary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  copyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  copyBothSection: {
    alignItems: "center",
    marginTop: 16,
  },
  copyBothButton: {
    backgroundColor: colors.neutral.tertiary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  copyBothButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
});
