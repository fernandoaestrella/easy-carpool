import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  DimensionValue,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TabMenu } from "../../../src/components/TabMenu";
import { BigButton } from "../../../src/components/BigButton";
import { RegistrationModal } from "../../../src/components/RegistrationModal";
import { RideRegistrationData } from "../../../src/components/RideRegistrationForm";
import { PassengerRegistrationData } from "../../../src/components/PassengerRegistrationForm";
import { Toast } from "../../../src/components/Toast";
import { colors } from "../../../src/styles/colors";
import { ResponsiveContainer } from "../../../src/components/ResponsiveContainer";
import { Dialog } from "../../../src/components/Dialog";

// Field configs for ride and passenger registration
const luggageOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const rideFields = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "phone" },
  { key: "date", label: "Departure Date", type: "date", required: true },
  {
    key: "isFlexibleTime",
    label: "Flexible Departure Time",
    type: "checkbox",
    default: false,
  },
  // Time fields will be conditionally rendered in RegistrationModal
  {
    key: "departureTimeStart",
    label: "Departure Time Start",
    type: "time",
    required: true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
  },
  {
    key: "seatsTotal",
    label: "Seats Available",
    type: "number",
    required: true,
  },
  {
    key: "luggageSpace",
    label: "Luggage Space",
    type: "dropdown",
    options: luggageOptions,
  },
  {
    key: "preferToDrive",
    label: "I prefer to drive",
    type: "checkbox",
    default: true,
  },
  { key: "canDrive", label: "I can drive", type: "checkbox", default: true },
  { key: "notes", label: "Notes", type: "multiline_text" },
];

const passengerFields = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "phone" },
  { key: "date", label: "Departure Date", type: "date", required: true },
  {
    key: "isFlexibleTime",
    label: "Flexible Departure",
    type: "checkbox",
    default: false,
  },
  {
    key: "departureTimeStart",
    label: "Departure Time Start",
    type: "time",
    required: true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
  },
  {
    key: "canDrive",
    label: "I can drive if needed",
    type: "checkbox",
    default: false,
  },
  { key: "notes", label: "Notes", type: "multiline_text" },
];
const MatchingScreen: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  // Responsive width logic: 65% of window width if >= 768px, else 100%
  const getContentContainerStyle = (): {
    width: DimensionValue;
    alignSelf: "center";
  } => {
    if (windowWidth >= 768) {
      return {
        width: Math.round(windowWidth * 0.65),
        alignSelf: "center",
      };
    }
    return {
      width: "100%" as DimensionValue,
      alignSelf: "center",
    };
  };
  const { carpoolId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("myRegistration");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userRegistration, setUserRegistration] = useState<
    RideRegistrationData | PassengerRegistrationData | null
  >(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Check if user has existing registration
    // If no registration exists, auto-open registration modal
    const hasExistingRegistration = checkForExistingRegistration();
    if (!hasExistingRegistration) {
      if (typeof window !== "undefined") {
        const dismissed = sessionStorage.getItem(
          "hasDismissedRegistrationDialog"
        );
        if (!dismissed) {
          setShowDialog(true);
        } else {
          setShowRegistrationModal(true);
        }
      } else {
        setShowRegistrationModal(true);
      }
    }
  }, []);

  const checkForExistingRegistration = (): boolean => {
    // This would check Firebase for existing user registration
    // For now, we'll check local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`registration_${carpoolId}`);
      if (saved) {
        try {
          setUserRegistration(JSON.parse(saved));
          return true;
        } catch (error) {
          console.error("Failed to load registration:", error);
        }
      }
    }
    return false;
  };

  const handleRegistrationSubmit = (
    data: RideRegistrationData | PassengerRegistrationData,
    intent: "offer" | "join" | null
  ) => {
    // Save registration to Firebase and local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `registration_${carpoolId}`,
        JSON.stringify({ ...data, intent })
      );
    }

    setUserRegistration(data);
    setShowRegistrationModal(false);

    showToast(
      intent === "offer"
        ? "Ride offer submitted successfully!"
        : "Waitlist registration submitted successfully!"
    );

    // TODO: Save to Firebase Realtime Database
    console.log("Submitting registration:", { carpoolId, data, intent });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const mainTabs = [
    { key: "myRegistration", label: "My Registration" },
    { key: "allRegistrations", label: "All Registrations" },
  ];

  const allRegistrationTabs = [
    { key: "rides", label: "Rides" },
    { key: "waitlist", label: "Waitlist" },
  ];

  const [allRegistrationsActiveTab, setAllRegistrationsActiveTab] =
    useState("rides");

  const renderMyRegistration = () => {
    return (
      <View style={getContentContainerStyle()}>
        {!userRegistration ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Registration Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your registration to start finding carpool matches
            </Text>
            <BigButton
              title="Register Your Departure"
              onPress={() => setShowRegistrationModal(true)}
              style={styles.registerButton}
            />
          </View>
        ) : (
          <View style={styles.registrationCard}>
            <Text style={styles.cardTitle}>Your Registration</Text>
            <View style={styles.registrationDetails}>
              <Text style={styles.detailLabel}>
                Name:{" "}
                <Text style={styles.detailValue}>{userRegistration.name}</Text>
              </Text>
              <Text style={styles.detailLabel}>
                Date:{" "}
                <Text style={styles.detailValue}>{userRegistration.date}</Text>
              </Text>
              <Text style={styles.detailLabel}>
                Time:{" "}
                <Text style={styles.detailValue}>
                  {userRegistration.isFlexibleTime
                    ? `${userRegistration.departureTimeStart} - ${userRegistration.departureTimeEnd}`
                    : userRegistration.departureTimeStart}
                </Text>
              </Text>
              {(userRegistration as RideRegistrationData).seatsTotal && (
                <Text style={styles.detailLabel}>
                  Seats:{" "}
                  <Text style={styles.detailValue}>
                    {(userRegistration as RideRegistrationData).seatsTotal}
                  </Text>
                </Text>
              )}
              {userRegistration.notes && (
                <Text style={styles.detailLabel}>
                  Notes:{" "}
                  <Text style={styles.detailValue}>
                    {userRegistration.notes}
                  </Text>
                </Text>
              )}
            </View>
            <BigButton
              title="Edit Registration"
              onPress={() => setShowRegistrationModal(true)}
              variant="secondary"
              style={styles.editButton}
            />
          </View>
        )}
      </View>
    );
  };

  const renderAllRegistrations = () => {
    return (
      <>
        <TabMenu
          tabs={allRegistrationTabs}
          activeTab={allRegistrationsActiveTab}
          onTabPress={setAllRegistrationsActiveTab}
        />
        <View style={getContentContainerStyle()}>
          <View style={styles.allRegistrationsContainer}>
            {allRegistrationsActiveTab === "rides" ? (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Available Rides</Text>
                <Text style={styles.emptyListText}>
                  No rides available yet. Be the first to offer a ride!
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>
                  Passengers Looking for Rides
                </Text>
                <Text style={styles.emptyListText}>
                  No passengers in waitlist yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSticky}>
        <Text style={styles.pageTitle}>Carpool Matching</Text>
        <TabMenu
          tabs={mainTabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>
      <ScrollView style={styles.content}>
        {activeTab === "myRegistration"
          ? renderMyRegistration()
          : renderAllRegistrations()}
      </ScrollView>

      <RegistrationModal
        visible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleRegistrationSubmit}
        autoOpen={!userRegistration}
        rideFields={rideFields}
        passengerFields={passengerFields}
      />

      <Dialog
        visible={showDialog}
        title="Complete your registration"
        description="For the best user experience, we recommend completing your registration first. This helps us show you the most relevant ride options. Are you sure you want to see other registrations without completing yours?"
        onAccept={() => {
          setShowDialog(false);
          setShowRegistrationModal(true);
        }}
        onCancel={() => {
          setShowDialog(false);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("hasDismissedRegistrationDialog", "true");
          }
          setShowRegistrationModal(false);
        }}
        acceptText="Continue filling form"
        cancelText="Yes, show other registrations"
      />

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

export default MatchingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: 50,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSticky: {
    backgroundColor: colors.background.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  registerButton: {
    marginBottom: 0,
  },
  registrationCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
  },
  registrationDetails: {
    gap: 8,
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  detailValue: {
    color: colors.text.primary,
    fontWeight: "500",
  },
  editButton: {
    marginBottom: 0,
  },
  allRegistrationsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
  },
  emptyListText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    paddingVertical: 40,
  },
});
