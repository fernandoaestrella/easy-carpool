import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { FormField, FormFieldConfig } from "./FormField";
import { BigButton } from "./BigButton";
import { colors } from "../styles/colors";

export interface PassengerRegistrationData {
  date: string;
  isFlexibleTime: boolean;
  departureTimeStart: string;
  departureTimeEnd: string;
  canDrive: boolean;
  notes: string;
  email: string;
  phone: string;
  name: string;
}

interface PassengerRegistrationFormProps {
  onSubmit: (data: PassengerRegistrationData) => void;
  initialData?: Partial<PassengerRegistrationData>;
  onDataChange?: (data: Partial<PassengerRegistrationData>) => void;
}

export const PassengerRegistrationForm: React.FC<
  PassengerRegistrationFormProps
> = ({ onSubmit, initialData = {}, onDataChange }) => {
  const [formData, setFormData] = useState<Partial<PassengerRegistrationData>>({
    isFlexibleTime: false,
    canDrive: false,
    ...initialData,
  });

  const updateField = (key: keyof PassengerRegistrationData, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onDataChange?.(newData);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.date ||
      !formData.name ||
      (!formData.email && !formData.phone)
    ) {
      return;
    }

    if (!formData.isFlexibleTime && !formData.departureTimeStart) {
      return;
    }

    if (
      formData.isFlexibleTime &&
      (!formData.departureTimeStart || !formData.departureTimeEnd)
    ) {
      return;
    }

    onSubmit(formData as PassengerRegistrationData);
  };

  const contactFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      required: true,
      value: formData.name || "",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      value: formData.email || "",
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "text",
      value: formData.phone || "",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Trip Information</Text>

      <FormField
        config={{
          key: "date",
          label: "Departure Date",
          type: "text",
          required: true,
          placeholder: "Select date",
        }}
        value={formData.date || ""}
        onChangeText={(key, value) => updateField("date", value)}
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Flexible Departure Time</Text>
        <Switch
          value={formData.isFlexibleTime}
          onValueChange={(value) => updateField("isFlexibleTime", value)}
          trackColor={{
            false: colors.neutral.tertiary,
            true: colors.interactive.secondary,
          }}
          thumbColor={
            formData.isFlexibleTime
              ? colors.interactive.primary
              : colors.neutral.primary
          }
        />
      </View>

      {formData.isFlexibleTime ? (
        <>
          <FormField
            config={{
              key: "departureTimeStart",
              label: "Preferred Time Start",
              type: "text",
              required: true,
              placeholder: "e.g., 9:00 AM",
            }}
            value={formData.departureTimeStart || ""}
            onChangeText={(key, value) =>
              updateField("departureTimeStart", value)
            }
          />
          <FormField
            config={{
              key: "departureTimeEnd",
              label: "Preferred Time End",
              type: "text",
              required: true,
              placeholder: "e.g., 2:00 PM",
            }}
            value={formData.departureTimeEnd || ""}
            onChangeText={(key, value) =>
              updateField("departureTimeEnd", value)
            }
          />
        </>
      ) : (
        <FormField
          config={{
            key: "departureTimeStart",
            label: "Preferred Departure Time",
            type: "text",
            required: true,
            placeholder: "e.g., 10:30 AM",
          }}
          value={formData.departureTimeStart || ""}
          onChangeText={(key, value) =>
            updateField("departureTimeStart", value)
          }
        />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>I can drive if needed</Text>
        <Switch
          value={formData.canDrive}
          onValueChange={(value) => updateField("canDrive", value)}
          trackColor={{
            false: colors.neutral.tertiary,
            true: colors.interactive.secondary,
          }}
          thumbColor={
            formData.canDrive
              ? colors.interactive.primary
              : colors.neutral.primary
          }
        />
      </View>

      <FormField
        config={{
          key: "notes",
          label: "Notes",
          type: "text",
          placeholder: "Additional information...",
        }}
        value={formData.notes || ""}
        onChangeText={(key, value) => updateField("notes", value)}
      />

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Text style={styles.subtitle}>Provide at least one contact method</Text>

      {contactFields.map((field) => (
        <FormField
          key={field.key}
          config={field}
          value={
            formData[
              field.key as keyof PassengerRegistrationData
            ]?.toString() || ""
          }
          onChangeText={(key, value) =>
            updateField(key as keyof PassengerRegistrationData, value)
          }
        />
      ))}

      <BigButton
        title="Join Waitlist"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
  },
});
