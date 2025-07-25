import { colors } from "../styles/colors";
import { getShortTimezoneAbbreviation } from "../utils/registrationUtils";

import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { getDatabase, ref, push, set } from "firebase/database";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  DimensionValue,
} from "react-native";
import { getResponsiveContentStyle } from "../styles/layout";
import { Form } from "./Form";
import { BigButton } from "./BigButton";

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, intent: "offer" | "join" | null) => void;
  autoOpen?: boolean;
  rideFields: any[];
  passengerFields: any[];
  initialValues?: any;
  timeZone: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  visible,
  onClose,
  onSubmit,
  autoOpen = false,
  rideFields,
  passengerFields,
  initialValues,
  timeZone,
}) => {
  // Get carpoolId from URL
  const { carpoolId } = useLocalSearchParams<{ carpoolId: string }>();
  const { width: windowWidth } = useWindowDimensions();
  const [intent, setIntent] = useState<"offer" | "join" | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});
  // Track previous isFlexibleTime to detect transitions
  const prevIsFlexibleTime = useRef<boolean | undefined>(undefined);
  // Set default values for flexible time fields when isFlexibleTime is toggled on
  useEffect(() => {
    const isFlexible = formValues.isFlexibleTime;
    // Only run if isFlexibleTime is true and was previously false or undefined
    if (isFlexible && !prevIsFlexibleTime.current) {
      // Only set if fields are empty or undefined
      if (!formValues.departureTimeStart || !formValues.departureTimeEnd) {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const oneHourLaterStr = `${pad(oneHourLater.getHours())}:${pad(
          oneHourLater.getMinutes()
        )}`;
        setFormValues((prev: any) => ({
          ...prev,
          departureTimeStart: prev.departureTimeStart || nowStr,
          departureTimeEnd: prev.departureTimeEnd || oneHourLaterStr,
        }));
      }
    }
    prevIsFlexibleTime.current = isFlexible;
  }, [formValues.isFlexibleTime]);
  // Removed skipInitialValues, will use parent callback

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
      } else if (field.key === "seatsTotal") {
        defaults[field.key] = 2;
      } else if (typeof field.default !== "undefined") {
        defaults[field.key] = field.default;
      }
    });
    return defaults;
  };

  // Reset form values to defaults on modal open or intent change, or prefill with initialValues if provided
  useEffect(() => {
    if (!visible) return;
    if (
      initialValues &&
      (initialValues.intent === "offer" || initialValues.intent === "join")
    ) {
      setIntent(initialValues.intent);
      setFormValues(initialValues);
      return;
    }
    let fields = [];
    if (intent === "offer") fields = rideFields;
    else if (intent === "join") fields = passengerFields;
    else return setFormValues({});
    setFormValues(getDefaultValues(fields));
  }, [visible, intent, rideFields, passengerFields, initialValues]);

  // Custom cross-field validation for email/phone
  const handleFormSubmit = (values: any) => {
    const email = values.email?.trim();
    const phone = values.phone?.trim();
    if (!email && !phone) {
      setFieldErrors({
        email: "Please provide at least one contact method.",
        phone: "Please provide at least one contact method.",
      });
      return;
    }
    setFieldErrors({});

    // Map time fields to fixedDepartureTime or time range fields based on isFlexibleTime
    let submission = { ...values };
    let baseDepartureTimeMs: number | null = null;
    if (typeof values.isFlexibleTime === "boolean") {
      if (values.isFlexibleTime) {
        // Flexible: use departureTimeEnd for expiry, remove fixedDepartureTime
        submission = {
          ...submission,
          fixedDepartureTime: undefined,
        };
        // Try to parse departureTimeEnd as ms since epoch
        if (values.departureTimeEnd) {
          baseDepartureTimeMs = parseTimeToMs(values.departureTimeEnd);
        }
      } else {
        // Not flexible: use fixedDepartureTime for expiry, remove departureTimeStart and departureTimeEnd
        submission = {
          ...submission,
          fixedDepartureTime: values.departureTime || values.fixedDepartureTime,
          departureTimeStart: undefined,
          departureTimeEnd: undefined,
        };
        if (submission.fixedDepartureTime) {
          baseDepartureTimeMs = parseTimeToMs(submission.fixedDepartureTime);
        }
      }
    }
    // Calculate expiresAt: 6 hours after baseDepartureTimeMs (if available)
    let expiresAt: number | undefined = undefined;
    if (baseDepartureTimeMs && !isNaN(baseDepartureTimeMs)) {
      expiresAt = baseDepartureTimeMs + 6 * 60 * 60 * 1000;
      submission.expiresAt = expiresAt;
    }
    // Remove all keys with undefined values (Firebase does not allow undefined)
    const cleanedSubmission = Object.fromEntries(
      Object.entries(submission).filter(([_, v]) => v !== undefined)
    );
    onSubmit(cleanedSubmission, intent);
  };

  // Helper: parse time string (HH:mm or ISO or ms) to ms since epoch (UTC)
  function parseTimeToMs(time: string | number): number | null {
    if (!time) return null;
    if (typeof time === "number") return time;
    if (/^\d+$/.test(time)) return parseInt(time, 10);
    // Try ISO string
    try {
      // @ts-ignore
      const { DateTime } = require("luxon");
      const dt = DateTime.fromISO(time, { zone: timeZone });
      if (dt.isValid) return dt.toMillis();
    } catch {}
    // Try HH:mm (today)
    if (/^\d{2}:\d{2}$/.test(time)) {
      const [h, m] = time.split(":").map(Number);
      const now = new Date();
      const dt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        h,
        m,
        0,
        0
      );
      return dt.getTime();
    }
    return null;
  }

  // Filter fields based on showIf (for conditional fields)
  // Patch field configs to inject error messages for email/phone and inject timezone into time field labels
  const getFields = () => {
    const fields =
      intent === "offer"
        ? rideFields
        : intent === "join"
        ? passengerFields
        : [];
    const tzAbbr = getShortTimezoneAbbreviation(timeZone);
    const tzLabel = timeZone
      ? `${timeZone}${tzAbbr && tzAbbr !== "-" ? ", " + tzAbbr : ""}`
      : "";
    return fields
      .filter((field) => !field.showIf || field.showIf(formValues))
      .map((field) => {
        // Patch error messages for contact fields
        if (field.key === "email" || field.key === "phone") {
          const key = field.key as "email" | "phone";
          return { ...field, error: fieldErrors[key] };
        }
        // Patch label for time fields
        if (
          field.key === "departureTime" ||
          field.key === "departureTimeStart" ||
          field.key === "departureTimeEnd"
        ) {
          return {
            ...field,
            label: `${field.label} (${tzLabel})`,
          };
        }
        return field;
      });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleCentered}>Register Your Departure</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            getResponsiveContentStyle(windowWidth),
          ]}
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
              <View style={styles.intentHeaderCentered}>
                <Text style={styles.selectedIntentCentered}>
                  {intent === "offer"
                    ? "Offering a Ride"
                    : "Looking for a Ride"}
                </Text>
                {/* Hide Change button if a registration already exists (initialValues is present) */}
                {!initialValues && (
                  <TouchableOpacity
                    onPress={() => setIntent(null)}
                    style={styles.changeButton}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Form
                fields={getFields()}
                onSubmit={handleFormSubmit}
                values={formValues}
                onChange={(vals: any) => {
                  setFormValues(vals);
                  // If either email or phone is filled, clear both errors
                  if (
                    (vals.email && vals.email.trim()) ||
                    (vals.phone && vals.phone.trim())
                  ) {
                    if (fieldErrors.email || fieldErrors.phone) {
                      setFieldErrors({});
                    }
                  }
                }}
                externalErrors={fieldErrors}
              >
                {/* Instructional text below form fields, above submit button */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.text.primary,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Please provide either your email or phone number (at least
                    one is required).
                  </Text>
                </View>
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
  titleCentered: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    flex: 1,
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
  intentHeaderCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  selectedIntentCentered: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.neutral ? colors.neutral.tertiary : "#ccc",
    marginLeft: 6,
  },
  changeButtonText: {
    color: colors.text.primary,
    fontWeight: "500",
  },
});
