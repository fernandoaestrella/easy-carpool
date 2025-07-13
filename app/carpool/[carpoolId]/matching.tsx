import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { getResponsiveContentStyle } from "../../../src/styles/layout";
import { useLocalSearchParams } from "expo-router";
import { TabMenu } from "../../../src/components/TabMenu";
import { BigButton } from "../../../src/components/BigButton";
import { RegistrationModal } from "../../../src/components/RegistrationModal";
import {
  RideRegistrationData,
  PassengerRegistrationData,
} from "../../../src/types/registration";

// Extend registration types to allow id fields for local use
type RideRegistrationWithId = RideRegistrationData & { rideId?: string };
type PassengerRegistrationWithId = PassengerRegistrationData & {
  waitlistPassengerId?: string;
};
type RegistrationWithId = (
  | RideRegistrationWithId
  | PassengerRegistrationWithId
) & { intent?: "offer" | "join" | null };
import { Toast } from "../../../src/components/Toast";
import { getDatabase, ref, remove, push, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
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
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime !== true,
  },
  {
    key: "seatsTotal",
    label: "Seats Available",
    type: "number",
    required: true,
    // default is set only in RegistrationModal
  },
  {
    key: "luggageSpace",
    label: "Luggage Space",
    type: "dropdown",
    options: luggageOptions,
    default: "medium",
  },
  {
    key: "preferToDrive",
    label: "I prefer to drive",
    type: "checkbox",
    default: true,
  },
  {
    key: "canDrive",
    label: "I can drive",
    type: "checkbox",
    default: false,
    showIf: (values: any) => values.preferToDrive === false,
  },
  { key: "notes", label: "Notes", type: "multiline_text" },
  { key: "name", label: "Name", type: "text", required: true },
  {
    key: "phone",
    label: "Phone",
    type: "phone",
    placeholder: "Enter your phone (or email below)",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email (or phone above)",
  },
];

const passengerFields = [
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
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime !== true,
  },
  {
    key: "canDrive",
    label: "I can drive if needed",
    type: "checkbox",
    default: false,
  },
  { key: "notes", label: "Notes", type: "multiline_text" },
  { key: "name", label: "Name", type: "text", required: true },
  {
    key: "phone",
    label: "Phone",
    type: "phone",
    placeholder: "Enter your phone (or email below)",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email (or phone above)",
  },
];
const MatchingScreen: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  // Responsive width logic: 65% of window width if >= 768px, else 100%
  const { carpoolId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("myRegistration");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userRegistration, setUserRegistration] =
    useState<RegistrationWithId | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Check if user has existing registration
    // If no registration exists, open registration modal (no dialog on load)
    const hasExistingRegistration = checkForExistingRegistration();
    if (!hasExistingRegistration) {
      setShowRegistrationModal(true);
    }
  }, []);

  const checkForExistingRegistration = (): boolean => {
    // This would check Firebase for existing user registration
    // For now, we'll check local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`registration_${carpoolId}`);
      if (saved) {
        try {
          const parsed: RegistrationWithId = JSON.parse(saved);
          setUserRegistration(parsed);
          return true;
        } catch (error) {
          console.error("Failed to load registration:", error);
        }
      }
    }
    return false;
  };

  // Save registration to Firebase and local storage, ensuring id is stored
  const handleRegistrationSubmit = async (
    data: RideRegistrationData | PassengerRegistrationData,
    intent: "offer" | "join" | null
  ) => {
    const db = getDatabase();
    let idKey = null;
    let firebasePath = "";
    let registrationToSave: RegistrationWithId = { ...data, intent };
    if (intent === "offer") {
      // Save as ride
      firebasePath = `carpools/${carpoolId}/rides`;
      const newRef = push(ref(db, firebasePath));
      idKey = newRef.key;
      // Add id to registration before writing to Firebase
      registrationToSave = { ...registrationToSave, rideId: idKey };
      await set(newRef, registrationToSave);
    } else if (intent === "join") {
      // Save as waitlist
      firebasePath = `carpools/${carpoolId}/waitlist`;
      const newRef = push(ref(db, firebasePath));
      idKey = newRef.key;
      registrationToSave = {
        ...registrationToSave,
        waitlistPassengerId: idKey,
      };
      await set(newRef, registrationToSave);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `registration_${carpoolId}`,
        JSON.stringify(registrationToSave)
      );
    }
    setUserRegistration(registrationToSave);
    setShowRegistrationModal(false);
    showToast(
      intent === "offer"
        ? "Ride offer submitted successfully!"
        : "Waitlist registration submitted successfully!"
    );
    // Registration is now saved with id in both Firebase and local storage
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

  // Delete registration from Firebase and local storage
  const handleDeleteRegistration = async () => {
    if (!userRegistration) return;
    const db = getDatabase();
    let firebasePath = "";
    let id: string | undefined = undefined;
    if ("rideId" in userRegistration && userRegistration.rideId) {
      firebasePath = `carpools/${carpoolId}/rides/${userRegistration.rideId}`;
      id = userRegistration.rideId;
    } else if (
      "waitlistPassengerId" in userRegistration &&
      userRegistration.waitlistPassengerId
    ) {
      firebasePath = `carpools/${carpoolId}/waitlist/${userRegistration.waitlistPassengerId}`;
      id = userRegistration.waitlistPassengerId;
    }
    if (firebasePath && id) {
      try {
        await remove(ref(db, firebasePath));
      } catch (e) {
        console.error("Failed to delete from Firebase", e);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(`registration_${carpoolId}`);
    }
    setUserRegistration(null);
    showToast("Registration deleted.");
  };

  const renderMyRegistration = () => {
    return (
      <View style={getResponsiveContentStyle(windowWidth)}>
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
            {/* Trash icon in top-right corner */}
            <View
              style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
            >
              <Ionicons
                name="trash"
                size={24}
                color={colors.text.secondary}
                onPress={handleDeleteRegistration}
                accessibilityLabel="Delete registration"
              />
            </View>
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
        <View style={getResponsiveContentStyle(windowWidth)}>
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
        onClose={() => {
          setShowRegistrationModal(false);
          // Only show dialog if user has not registered yet
          if (!userRegistration) {
            setShowDialog(true);
          }
        }}
        onSubmit={handleRegistrationSubmit}
        autoOpen={!userRegistration}
        rideFields={rideFields}
        passengerFields={passengerFields}
      />

      <View style={{ alignItems: "center", justifyContent: "center" }}>
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
      </View>

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
