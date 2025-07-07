import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { getDatabase, ref, push } from "firebase/database";
import { colors } from "../styles/colors";
import { Form } from "../components/Form";
import { BigButton } from "../components/BigButton";
import { FormFieldConfig } from "../components/FormField";
import { ResponsiveContainer } from "../components/ResponsiveContainer";

export const CreateCarpoolPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Carpool name",
      type: "text",
      required: true,
      placeholder: "Enter carpool name",
    },
    {
      key: "email",
      label: "Your email",
      type: "email",
      required: true,
      placeholder: "Enter your email address",
    },
    {
      key: "timeZone",
      label: "Departure time zone",
      type: "timezone",
      required: true,
      placeholder: "Search and select timezone",
    },
  ];

  const handleCreateCarpool = async (values: Record<string, string>) => {
    setIsLoading(true);

    try {
      const database = getDatabase();
      const carpoolsRef = ref(database, "carpools");

      const newCarpool = {
        name: values.name,
        ownerEmail: values.email,
        timeZone: values.timeZone,
        createdAt: Date.now(),
      };

      const carpoolRef = await push(carpoolsRef, newCarpool);
      const carpoolId = carpoolRef.key;

      if (carpoolId) {
        router.push(`/carpool-success/${carpoolId}`);
      }
    } catch (error) {
      console.error("Error creating carpool:", error);
      Alert.alert("Error", "Failed to create carpool. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ResponsiveContainer>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create New One Way Carpool</Text>
          <Text style={styles.subtitle}>
            Set up a new carpool to start finding matches
          </Text>
        </View>

        <View style={styles.formSection}>
          <Form fields={formFields} onSubmit={handleCreateCarpool}>
            <BigButton
              title={isLoading ? "Creating..." : "Create"}
              onPress={() => {}} // Form component handles the onPress
              disabled={isLoading}
              style={styles.createButton}
            />
          </Form>
        </View>
      </ResponsiveContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  formSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 24,
  },
  createButton: {
    marginTop: 8,
    alignSelf: "center",
  },
});
