import React, { useState } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FormField, FormFieldConfig } from "./FormField";

interface FormProps {
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, string>) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  children,
  style,
}) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      initialValues[field.key] = field.value || "";
    });
    return initialValues;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (key: string, text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !values[field.key]?.trim()) {
        newErrors[field.key] = `${field.label} is required`;
      } else if (field.type === "email" && values[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.key])) {
          newErrors[field.key] = "Please enter a valid email address";
        }
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
          onChangeText={handleFieldChange}
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
