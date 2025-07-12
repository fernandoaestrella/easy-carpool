import { colors } from "../styles/colors";

import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, ScrollView } from "react-native";
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
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Register Your Departure</Text>
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
            <Form fields={getFields()} onSubmit={handleFormSubmit}>
              <BigButton
                title="Submit"
                onPress={() => handleFormSubmit(formValues)}
              />
              <BigButton
                title="Back"
                onPress={() => setIntent(null)}
                variant="secondary"
                style={styles.intentButton}
              />
            </Form>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: colors.text.primary,
  },
  intentButtons: {
    width: "100%",
    gap: 16,
  },
  intentButton: {
    marginBottom: 0,
  },
  // End of file
});
