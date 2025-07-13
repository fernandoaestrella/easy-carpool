import { colors } from "../styles/colors";

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Form } from "./Form";
import { BigButton } from "./BigButton";

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, intent: "offer" | "join" | null) => void;
  autoOpen?: boolean;
  rideFields: any[];
  passengerFields: any[];
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  visible,
  onClose,
  onSubmit,
  autoOpen = false,
  rideFields,
  passengerFields,
}) => {
  const [intent, setIntent] = useState<"offer" | "join" | null>(null);
  const [formValues, setFormValues] = useState<any>({});

  const handleFormSubmit = (values: any) => {
    onSubmit(values, intent);
  };

  // Filter fields based on showIf (for conditional fields)
  const getFields = () => {
    const fields =
      intent === "offer"
        ? rideFields
        : intent === "join"
        ? passengerFields
        : [];
    return fields.filter((field) => !field.showIf || field.showIf(formValues));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Register Your Departure</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!intent ? (
            <View style={styles.intentButtons}>
              <BigButton
                title="I want to offer a ride"
                onPress={() => setIntent("offer")}
                style={styles.intentButton}
              />
              <BigButton
                title="I want to join a ride"
                onPress={() => setIntent("join")}
                style={styles.intentButton}
              />
            </View>
          ) : (
            <>
              <View style={styles.intentHeader}>
                <Text style={styles.selectedIntent}>
                  {intent === "offer"
                    ? "Offering a Ride"
                    : "Looking for a Ride"}
                </Text>
                <TouchableOpacity
                  onPress={() => setIntent(null)}
                  style={styles.changeButton}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
              <Form fields={getFields()} onSubmit={handleFormSubmit}>
                <BigButton
                  title="Submit"
                  onPress={() => handleFormSubmit(formValues)}
                />
              </Form>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
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
    backgroundColor: colors.neutral ? colors.neutral.tertiary : "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  intentButtons: {
    width: "100%",
    gap: 16,
  },
  intentButton: {
    marginBottom: 0,
  },
  intentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  selectedIntent: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.neutral ? colors.neutral.tertiary : "#ccc",
  },
  changeButtonText: {
    color: colors.text.primary,
    fontWeight: "500",
  },
});
