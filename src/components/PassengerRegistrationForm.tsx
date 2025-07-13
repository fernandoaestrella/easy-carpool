import React, { useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { Form } from "./Form";
import { FormFieldConfig } from "./FormField";
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
      type: "text" as const,
      required: true,
      value: formData.name || "",
    },
    {
      key: "email",
      label: "Email",
      type: "email" as const,
      value: formData.email || "",
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "text" as const,
      value: formData.phone || "",
    },
  ];

  const allFields: FormFieldConfig[] = [
    {
      key: "date",
      label: "Departure Date",
      type: "text" as const,
      required: true,
      placeholder: "Select date",
      value: formData.date || "",
    },
    ...(formData.isFlexibleTime
      ? [
          {
            key: "departureTimeStart",
            label: "Preferred Time Start",
            type: "text" as const,
            required: true,
            placeholder: "e.g., 9:00 AM",
            value: formData.departureTimeStart || "",
          },
          {
            key: "departureTimeEnd",
            label: "Preferred Time End",
            type: "text" as const,
            required: true,
            placeholder: "e.g., 2:00 PM",
            value: formData.departureTimeEnd || "",
          },
        ]
      : [
          {
            key: "departureTimeStart",
            label: "Preferred Departure Time",
            type: "text" as const,
            required: true,
            placeholder: "e.g., 10:30 AM",
            value: formData.departureTimeStart || "",
          },
        ]),
    {
      key: "notes",
      label: "Notes",
      type: "text" as const,
      placeholder: "Additional information...",
      value: formData.notes || "",
    },
    ...contactFields,
  ];

  return (
    <Form fields={allFields} onSubmit={handleSubmit}>
      <View style={styles.toggleRow}>
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
          style={styles.toggle}
        />
        <Text style={styles.toggleLabel}>Flexible Departure Time</Text>
      </View>
      <View style={styles.toggleRow}>
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
          style={styles.toggle}
        />
        <Text style={styles.toggleLabel}>I can drive if needed</Text>
      </View>
      <BigButton
        title="Join Waitlist"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  toggle: {
    marginRight: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  submitButton: {
    marginTop: 24,
  },
});
