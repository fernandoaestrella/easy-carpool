import React, { useState, useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FormField, FormFieldConfig } from "./FormField";

interface FormProps {
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, string>) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  externalErrors?: Record<string, string>;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  children,
  style,
  values: controlledValues,
  onChange,
  externalErrors = {},
}) => {
  const [internalValues, setInternalValues] = useState<Record<string, any>>(
    () => {
      const initialValues: Record<string, any> = {};
      fields.forEach((field) => {
        if (field.type === "checkbox") {
          initialValues[field.key] = field.value ?? false;
        } else {
          initialValues[field.key] = field.value ?? "";
        }
      });
      return initialValues;
    }
  );
  const values = controlledValues || internalValues;
  const setValues = onChange || setInternalValues;

  useEffect(() => {
    if (controlledValues) return; // don't sync if controlled
    // If fields change, reset internal values
    setInternalValues((prev) => {
      const next: Record<string, any> = { ...prev };
      fields.forEach((field) => {
        if (!(field.key in next)) {
          if (field.type === "checkbox") next[field.key] = field.value ?? false;
          else next[field.key] = field.value ?? "";
        }
      });
      return next;
    });
    // eslint-disable-next-line
  }, [fields]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track if the contact error was shown due to submit
  const [contactErrorActive, setContactErrorActive] = useState(false);

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [key]: value }));
    // If user edits email or phone, clear the contact error from both
    if ((key === "email" || key === "phone") && contactErrorActive) {
      setErrors((prev) => {
        const next = { ...prev };
        if (next["email"] === "Please provide at least one contact method")
          next["email"] = "";
        if (next["phone"] === "Please provide at least one contact method")
          next["phone"] = "";
        return next;
      });
      setContactErrorActive(false);
    } else if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = values[field.key];
      if (field.type === "display") return; // skip display fields
      if (field.required) {
        if (field.type === "checkbox" && !val) {
          newErrors[field.key] = `${field.label} is required`;
        } else if (
          val === undefined ||
          val === null ||
          val === "" ||
          (typeof val === "string" && !val.trim())
        ) {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
      if (field.type === "email" && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          newErrors[field.key] = "Please enter a valid email address";
        }
      }
      if (field.type === "phone" && val) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        if (!phoneRegex.test(val)) {
          newErrors[field.key] = "Please enter a valid phone number";
        }
      }
      if (field.type === "number" && val) {
        if (isNaN(Number(val))) {
          newErrors[field.key] = "Please enter a valid number";
        }
      }
      if (field.type === "dropdown" && field.required && (!val || val === "")) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Check if both contact fields are empty
    const emailField = fields.find((f) => f.type === "email");
    const phoneField = fields.find((f) => f.type === "phone");
    const emailVal = emailField ? values[emailField.key] : "";
    const phoneVal = phoneField ? values[phoneField.key] : "";
    const emailEmpty =
      !emailVal || (typeof emailVal === "string" && !emailVal.trim());
    const phoneEmpty =
      !phoneVal || (typeof phoneVal === "string" && !phoneVal.trim());
    if (emailField && phoneField && emailEmpty && phoneEmpty) {
      setErrors((prev) => ({
        ...prev,
        [emailField.key]: "Please provide at least one contact method",
        [phoneField.key]: "Please provide at least one contact method",
      }));
      setContactErrorActive(true);
      return;
    }
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {fields.map((field) => {
        // Prefer externalErrors over internal errors
        const errorMsg = externalErrors[field.key] || errors[field.key];
        return (
          <FormField
            key={field.key}
            config={field}
            value={values[field.key] || ""}
            onChangeValue={handleFieldChange}
            error={errorMsg}
          />
        );
      })}

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onPress: handleSubmit } as any);
        }
        return child;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
