import { colors } from "../styles/colors";

import React, { useState, useEffect } from "react";
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

  // Helper to get sensible default values for all fields
  const getDefaultValues = (fields: any[]) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;
    const nextHour = new Date(now.getTime());
    nextHour.setHours(
      now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours(),
      0,
      0,
      0
    );
    const nextHourStr = `${pad(nextHour.getHours())}:${pad(
      nextHour.getMinutes()
    )}`;
    const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourLaterStr = `${pad(oneHourLater.getHours())}:${pad(
      oneHourLater.getMinutes()
    )}`;

    const defaults: Record<string, any> = {};
    fields.forEach((field: any) => {
      if (field.type === "date") {
        defaults[field.key] = todayStr;
      } else if (field.key === "departureTime") {
        defaults[field.key] = nextHourStr;
      } else if (field.key === "departureTimeStart") {
        defaults[field.key] = nowStr;
      } else if (field.key === "departureTimeEnd") {
        defaults[field.key] = oneHourLaterStr;
      } else if (field.key === "preferToDrive") {
        defaults[field.key] = true;
      } else if (typeof field.default !== "undefined") {
        defaults[field.key] = field.default;
      }
    });
    return defaults;
  };

  // Reset form values to defaults on modal open or intent change
  useEffect(() => {
    if (!visible) return;
    let fields = [];
    if (intent === "offer") fields = rideFields;
    else if (intent === "join") fields = passengerFields;
    else return setFormValues({});
    setFormValues(getDefaultValues(fields));
  }, [visible, intent, rideFields, passengerFields]);

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
              <Form
                fields={getFields()}
                onSubmit={handleFormSubmit}
                values={formValues}
                onChange={setFormValues}
              >
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
