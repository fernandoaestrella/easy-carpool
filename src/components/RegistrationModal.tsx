import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BigButton } from "./BigButton";
import { SmallButton } from "./SmallButton";
import { Dialog } from "./Dialog";
import {
  RideRegistrationForm,
  RideRegistrationData,
} from "./RideRegistrationForm";
import {
  PassengerRegistrationForm,
  PassengerRegistrationData,
} from "./PassengerRegistrationForm";
import { colors } from "../styles/colors";
import { ResponsiveContainer } from "./ResponsiveContainer";

type RegistrationIntent = "offer" | "join" | null;

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    data: RideRegistrationData | PassengerRegistrationData,
    intent: RegistrationIntent
  ) => void;
  autoOpen?: boolean;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  visible,
  onClose,
  onSubmit,
  autoOpen = false,
}) => {
  const [intent, setIntent] = useState<RegistrationIntent>(null);
  const [formData, setFormData] = useState<
    Partial<RideRegistrationData | PassengerRegistrationData>
  >({});
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  useEffect(() => {
    // Auto-save to local storage
    if (Object.keys(formData).length > 0) {
      // In a real app, you'd use AsyncStorage here
      // For now, we'll use localStorage for web compatibility
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "carpoolRegistrationDraft",
          JSON.stringify({ intent, formData })
        );
      }
    }
  }, [formData, intent]);

  useEffect(() => {
    // Load draft data when modal opens
    if (visible && typeof window !== "undefined") {
      const savedDraft = localStorage.getItem("carpoolRegistrationDraft");
      if (savedDraft) {
        try {
          const { intent: savedIntent, formData: savedFormData } =
            JSON.parse(savedDraft);
          setIntent(savedIntent);
          setFormData(savedFormData);
        } catch (error) {
          console.error("Failed to load draft data:", error);
        }
      }
    }
  }, [visible]);

  const handleClose = () => {
    setShowCloseDialog(true);
  };

  const handleForceClose = () => {
    setShowCloseDialog(false);
    onClose();
  };

  const handleIntentSelect = (selectedIntent: RegistrationIntent) => {
    setIntent(selectedIntent);
    setFormData({}); // Reset form data when intent changes
  };

  const handleFormSubmit = (
    data: RideRegistrationData | PassengerRegistrationData
  ) => {
    onSubmit(data, intent);
    // Clear draft data after successful submission
    if (typeof window !== "undefined") {
      localStorage.removeItem("carpoolRegistrationDraft");
    }
  };

  const handleDataChange = (
    data: Partial<RideRegistrationData | PassengerRegistrationData>
  ) => {
    setFormData(data);
  };

  const resetForm = () => {
    setIntent(null);
    setFormData({});
  };

  return (
    <>
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Register Your Departure</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ResponsiveContainer>
              {!intent ? (
                <View style={styles.intentSelection}>
                  <Text style={styles.intentTitle}>
                    How would you like to participate?
                  </Text>
                  <Text style={styles.intentSubtitle}>
                    Choose your preferred option below
                  </Text>

                  <View style={styles.intentButtons}>
                    <BigButton
                      title="I want to offer a ride"
                      onPress={() => handleIntentSelect("offer")}
                      style={styles.intentButton}
                    />
                    <BigButton
                      title="I want to join a ride as a passenger"
                      onPress={() => handleIntentSelect("join")}
                      style={styles.intentButton}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <View style={styles.intentHeader}>
                    <Text style={styles.selectedIntent}>
                      {intent === "offer"
                        ? "Offering a Ride"
                        : "Looking for a Ride"}
                    </Text>
                    <SmallButton title="Change" onPress={resetForm} />
                  </View>

                  {intent === "offer" ? (
                    <RideRegistrationForm
                      onSubmit={handleFormSubmit}
                      initialData={formData as Partial<RideRegistrationData>}
                      onDataChange={handleDataChange}
                    />
                  ) : (
                    <PassengerRegistrationForm
                      onSubmit={handleFormSubmit}
                      initialData={
                        formData as Partial<PassengerRegistrationData>
                      }
                      onDataChange={handleDataChange}
                    />
                  )}
                </View>
              )}
            </ResponsiveContainer>
          </ScrollView>
        </View>
      </Modal>

      <Dialog
        visible={showCloseDialog}
        title="Complete your registration"
        description="For the best user experience, we recommend completing your registration first. This helps us show you the most relevant ride options. Are you sure you want to see other registrations without completing yours?"
        onAccept={() => setShowCloseDialog(false)}
        onCancel={handleForceClose}
        acceptText="Continue filling form"
        cancelText="Yes, show other registrations"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.background.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  intentSelection: {
    padding: 20,
    alignItems: "center",
  },
  intentTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  intentSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
  },
  intentButtons: {
    width: "100%",
    gap: 16,
  },
  intentButton: {
    marginBottom: 0,
  },
  formContainer: {
    flex: 1,
  },
  intentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background.secondary,
  },
  selectedIntent: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
