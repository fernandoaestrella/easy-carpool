import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TabMenu } from "../../../src/components/TabMenu";
import { BigButton } from "../../../src/components/BigButton";
import { RegistrationModal } from "../../../src/components/RegistrationModal";
import { Toast } from "../../../src/components/Toast";
import { Dialog } from "../../../src/components/Dialog";
import {
  getDatabase,
  ref,
  remove,
  push,
  set,
  onValue,
  off,
} from "firebase/database";
import { colors } from "../../../src/styles/colors";
import {
  rideFields,
  passengerFields,
} from "../../../src/data/registrationFields";
import { RegistrationCard } from "../../../src/components/RegistrationCard";
import { MyRegistrationCard } from "../../../src/components/MyRegistrationCard";
import { RegistrationList } from "../../../src/components/RegistrationList";
import {
  checkForExistingRegistration,
  showToast,
} from "../../../src/utils/registrationUtils";

import {
  RideRegistrationData,
  PassengerRegistrationData,
} from "../../../src/types/registration";

type RideRegistrationWithId = RideRegistrationData & { rideId?: string };
type PassengerRegistrationWithId = PassengerRegistrationData & {
  waitlistPassengerId?: string;
};
type RegistrationWithId = (
  | RideRegistrationWithId
  | PassengerRegistrationWithId
) & { intent?: "offer" | "join" | null };
const MatchingScreen: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  // Responsive width logic: 65% of window width if >= 768px, else 100%
  const { carpoolId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("myRegistration");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userRegistration, setUserRegistration] =
    useState<RegistrationWithId | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<any>(null);
  const [modalIntent, setModalIntent] = useState<"offer" | "join" | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [carpoolTimeZone, setCarpoolTimeZone] = useState<string>("");

  useEffect(() => {
    // On mount, fetch carpool object to get timezone, and check localStorage for registration
    const carpoolIdStr = Array.isArray(carpoolId) ? carpoolId[0] : carpoolId;
    const db = getDatabase();
    // Fetch carpool object
    const carpoolRef = ref(db, `carpools/${carpoolIdStr}`);
    onValue(
      carpoolRef,
      (snapshot) => {
        const carpool = snapshot.val();
        if (carpool && carpool.timeZone) {
          setCarpoolTimeZone(carpool.timeZone);
        }
      },
      { onlyOnce: true }
    );
    // Check localStorage for registration and fetch from Firebase if needed
    let regStr = null;
    if (typeof window !== "undefined") {
      regStr = localStorage.getItem(`registration_${carpoolIdStr}`);
    }
    if (regStr) {
      try {
        const reg = JSON.parse(regStr);
        // If we have a registration id, fetch the latest from Firebase
        let path = null;
        if (reg.rideId) {
          path = `carpools/${carpoolIdStr}/rides/${reg.rideId}`;
        } else if (reg.waitlistPassengerId) {
          path = `carpools/${carpoolIdStr}/waitlist/${reg.waitlistPassengerId}`;
        }
        if (path) {
          const regRef = ref(db, path);
          onValue(
            regRef,
            (snapshot) => {
              const val = snapshot.val();
              if (val) {
                setUserRegistration(val);
                // Update localStorage with latest
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    `registration_${carpoolIdStr}`,
                    JSON.stringify(val)
                  );
                }
              } else {
                setUserRegistration(null);
                if (typeof window !== "undefined") {
                  localStorage.removeItem(`registration_${carpoolIdStr}`);
                }
              }
            },
            { onlyOnce: true }
          );
        } else {
          setUserRegistration(reg);
        }
      } catch {
        setUserRegistration(null);
      }
    } else {
      setShowRegistrationModal(true);
    }
  }, []);

  // Save registration to Firebase and local storage, ensuring id is stored
  const handleRegistrationSubmit = async (
    data: RideRegistrationData | PassengerRegistrationData,
    intent: "offer" | "join" | null
  ) => {
    const db = getDatabase();
    let idKey = null;
    let firebasePath = "";
    let registrationToSave: RegistrationWithId = { ...data, intent };
    const carpoolIdStr = Array.isArray(carpoolId) ? carpoolId[0] : carpoolId;

    // If editing, delete the old registration first
    if (userRegistration) {
      let oldPath = "";
      if ("rideId" in userRegistration && userRegistration.rideId) {
        oldPath = `carpools/${carpoolIdStr}/rides/${userRegistration.rideId}`;
      } else if (
        "waitlistPassengerId" in userRegistration &&
        userRegistration.waitlistPassengerId
      ) {
        oldPath = `carpools/${carpoolIdStr}/waitlist/${userRegistration.waitlistPassengerId}`;
      }
      if (oldPath) {
        try {
          await remove(ref(db, oldPath));
        } catch (e) {
          console.error("Failed to delete old registration from Firebase", e);
        }
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(`registration_${carpoolIdStr}`);
      }
    }

    if (intent === "offer") {
      firebasePath = `carpools/${carpoolIdStr}/rides`;
      const newRef = push(ref(db, firebasePath));
      idKey = newRef.key;
      registrationToSave = { ...registrationToSave, rideId: idKey };
      await set(newRef, registrationToSave);
    } else if (intent === "join") {
      firebasePath = `carpools/${carpoolIdStr}/waitlist`;
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
        `registration_${carpoolIdStr}`,
        JSON.stringify(registrationToSave)
      );
    }
    setUserRegistration(registrationToSave);
    setShowRegistrationModal(false);
    showToast(
      setToastMessage,
      setToastVisible,
      intent === "offer"
        ? "Ride offer submitted successfully!"
        : "Waitlist registration submitted successfully!"
    );
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

  // State for all rides and waitlist
  const [rides, setRides] = useState<RideRegistrationWithId[]>([]);
  const [waitlist, setWaitlist] = useState<PassengerRegistrationWithId[]>([]);

  // Fetch all rides and waitlist when All Registrations tab is active
  useEffect(() => {
    if (activeTab !== "allRegistrations") return;
    const db = getDatabase();
    const ridesRef = ref(db, `carpools/${carpoolId}/rides`);
    const waitlistRef = ref(db, `carpools/${carpoolId}/waitlist`);

    const handleRides = (snapshot: any) => {
      const val = snapshot.val();
      if (val) {
        setRides(
          Object.entries(val).map(([rideId, data]: [string, any]) => ({
            ...data,
            rideId,
          }))
        );
      } else {
        setRides([]);
      }
    };
    const handleWaitlist = (snapshot: any) => {
      const val = snapshot.val();
      if (val) {
        setWaitlist(
          Object.entries(val).map(
            ([waitlistPassengerId, data]: [string, any]) => ({
              ...data,
              waitlistPassengerId,
            })
          )
        );
      } else {
        setWaitlist([]);
      }
    };
    onValue(ridesRef, handleRides);
    onValue(waitlistRef, handleWaitlist);
    return () => {
      off(ridesRef, "value", handleRides);
      off(waitlistRef, "value", handleWaitlist);
    };
  }, [activeTab, carpoolId]);

  // Delete registration from Firebase and local storage
  const handleDeleteRegistration = async () => {
    if (!userRegistration) return;
    const db = getDatabase();
    let firebasePath = "";
    let id: string | undefined = undefined;
    const carpoolIdStr = Array.isArray(carpoolId) ? carpoolId[0] : carpoolId;
    if ("rideId" in userRegistration && userRegistration.rideId) {
      firebasePath = `carpools/${carpoolIdStr}/rides/${userRegistration.rideId}`;
      id = userRegistration.rideId;
    } else if (
      "waitlistPassengerId" in userRegistration &&
      userRegistration.waitlistPassengerId
    ) {
      firebasePath = `carpools/${carpoolIdStr}/waitlist/${userRegistration.waitlistPassengerId}`;
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
      localStorage.removeItem(`registration_${carpoolIdStr}`);
    }
    setUserRegistration(null);
    showToast(setToastMessage, setToastVisible, "Registration deleted.");
  };

  const handleEditRegistration = () => {
    setModalInitialValues(userRegistration);
    setModalIntent(userRegistration?.intent || null);
    setShowRegistrationModal(true);
  };

  const renderMyRegistration = () => (
    <View style={styles.container}>
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
        <MyRegistrationCard
          registration={userRegistration}
          onDelete={handleDeleteRegistration}
          onEdit={handleEditRegistration}
          isRide={"seatsTotal" in userRegistration}
          styles={styles}
          timeZone={carpoolTimeZone}
        />
      )}
    </View>
  );

  // Helper to get user's reference departure time (fixed or flexible start)
  const getUserReferenceDepartureTime = () => {
    if (!userRegistration) return null;
    if (userRegistration.isFlexibleTime) {
      return userRegistration.departureTimeStart || null;
    } else {
      return userRegistration.fixedDepartureTime || null;
    }
  };

  // Helper to format the user's departure time for display
  const formatUserDepartureTime = () => {
    const refTime = getUserReferenceDepartureTime();
    if (!refTime) return "-";
    // Use formatTimeWithZone from registrationUtils
    // @ts-ignore
    return require("../../../src/utils/registrationUtils").formatTimeWithZone(refTime, carpoolTimeZone);
  };

  // Helper to get the registration's departure time (fixed or flexible start)
  const getRegistrationDepartureTime = (reg: any) => {
    if (!reg) return null;
    if (reg.isFlexibleTime) {
      return reg.departureTimeStart || null;
    } else {
      return reg.fixedDepartureTime || null;
    }
  };

  // Helper to get the user's reference departure time as a number (ms since epoch)
  const getUserReferenceDepartureTimeMs = () => {
    const refTime = getUserReferenceDepartureTime();
    if (!refTime) return null;
    // Use luxon to parse as ms
    try {
      // @ts-ignore
      const { DateTime } = require("luxon");
      if (typeof refTime === "number") return refTime;
      if (typeof refTime === "string" && /^\d+$/.test(refTime)) return parseInt(refTime, 10);
      const dt = DateTime.fromISO(refTime, { zone: carpoolTimeZone });
      if (dt.isValid) return dt.toMillis();
      return null;
    } catch {
      return null;
    }
  };

  // Helper to get registration's departure time as ms
  const getRegistrationDepartureTimeMs = (reg: any) => {
    const depTime = getRegistrationDepartureTime(reg);
    if (!depTime) return null;
    try {
      // @ts-ignore
      const { DateTime } = require("luxon");
      if (typeof depTime === "number") return depTime;
      if (typeof depTime === "string" && /^\d+$/.test(depTime)) return parseInt(depTime, 10);
      const dt = DateTime.fromISO(depTime, { zone: carpoolTimeZone });
      if (dt.isValid) return dt.toMillis();
      return null;
    } catch {
      return null;
    }
  };

  // Sort registrations by absolute time difference to user's reference time, positive values prioritized in ties
  const sortRegistrationsByTimeDiff = (regs: any[]) => {
    const userRefMs = getUserReferenceDepartureTimeMs();
    if (!userRefMs) return regs;
    return [...regs].sort((a, b) => {
      const aMs = getRegistrationDepartureTimeMs(a);
      const bMs = getRegistrationDepartureTimeMs(b);
      if (aMs == null && bMs == null) return 0;
      if (aMs == null) return 1;
      if (bMs == null) return -1;
      const aDiff = aMs - userRefMs;
      const bDiff = bMs - userRefMs;
      const aAbs = Math.abs(aDiff);
      const bAbs = Math.abs(bDiff);
      if (aAbs !== bAbs) return aAbs - bAbs;
      // If abs values are equal, prioritize positive (after user's time)
      if (aDiff >= 0 && bDiff < 0) return -1;
      if (aDiff < 0 && bDiff >= 0) return 1;
      return 0;
    });
  };

  const renderAllRegistrations = () => {
    const isRides = allRegistrationsActiveTab === "rides";
    const list = isRides ? rides : waitlist;
    const userDepartureTimeStr = formatUserDepartureTime();
    const userRefMs = getUserReferenceDepartureTimeMs();
    const sortedList = userRefMs ? sortRegistrationsByTimeDiff(list) : list;
    return (
      <>
        {/* Info line about sorting */}
        <View style={{ marginBottom: 8, marginTop: 8 }}>
          <Text style={{ textAlign: "center", color: styles.detailLabel.color, fontSize: 15 }}>
            Registrations sorted by those closest to your departure time of {userDepartureTimeStr}
          </Text>
        </View>
        <TabMenu
          tabs={allRegistrationTabs}
          activeTab={allRegistrationsActiveTab}
          onTabPress={setAllRegistrationsActiveTab}
        />
        <RegistrationList
          registrations={sortedList}
          isRide={isRides}
          styles={styles}
          windowWidth={windowWidth}
          timeZone={carpoolTimeZone}
          userReferenceDepartureTimeMs={userRefMs}
        />
      </>
    );
  };

  // Handler for toggling intent from RegistrationModal
  const handleToggleIntent = (newIntent: "offer" | "join") => {
    setModalInitialValues(null); // Clear initial values so modal doesn't override intent
    setModalIntent(newIntent);
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
          setModalInitialValues(null);
          setModalIntent(null);
          // Only show dialog if user has not registered yet
          if (!userRegistration) {
            setShowDialog(true);
          }
        }}
        onSubmit={handleRegistrationSubmit}
        autoOpen={!userRegistration}
        rideFields={rideFields}
        passengerFields={passengerFields}
        initialValues={modalInitialValues}
        timeZone={carpoolTimeZone}
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
