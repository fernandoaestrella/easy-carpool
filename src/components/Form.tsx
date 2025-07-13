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
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  children,
  style,
  values: controlledValues,
  onChange,
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

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) {
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
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {fields.map((field) => (
        <FormField
          key={field.key}
          config={field}
          value={values[field.key] || ""}
          onChangeValue={handleFieldChange}
          error={errors[field.key]}
        />
      ))}

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
