import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { colors } from "../styles/colors";
import { Form } from "../components/Form";
import { BigButton } from "../components/BigButton";
import { Dialog } from "../components/Dialog";
import { FormFieldConfig } from "../components/FormField";
import { ResponsiveContainer } from "../components/ResponsiveContainer";

interface CarpoolData {
  name: string;
  ownerEmail: string;
  timeZone: string;
}

export const EditCarpoolPage: React.FC = () => {
  const { carpoolId } = useLocalSearchParams<{ carpoolId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [carpoolData, setCarpoolData] = useState<CarpoolData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const formFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Carpool name",
      type: "text",
      required: true,
      placeholder: "Enter carpool name",
      value: carpoolData?.name || "",
    },
    {
      key: "email",
      label: "Your email",
      type: "email",
      required: true,
      placeholder: "Enter your email address",
      value: carpoolData?.ownerEmail || "",
    },
    {
      key: "timeZone",
      label: "Departure time zone",
      type: "timezone",
      required: true,
      placeholder: "e.g., America/New_York, Europe/London",
      value: carpoolData?.timeZone || "",
    },
  ];

  useEffect(() => {
    loadCarpoolData();
  }, [carpoolId]);

  const loadCarpoolData = async () => {
    if (!carpoolId) {
      router.replace("/+not-found");
      return;
    }

    try {
      const database = getDatabase();
      const carpoolRef = ref(database, `carpools/${carpoolId}`);
      const snapshot = await get(carpoolRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setCarpoolData({
          name: data.name,
          ownerEmail: data.ownerEmail,
          timeZone: data.timeZone,
        });
      } else {
        router.replace("/+not-found");
      }
    } catch (error) {
      console.error("Error loading carpool:", error);
      Alert.alert("Error", "Failed to load carpool data.");
      router.replace("/+not-found");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdateCarpool = async (values: Record<string, string>) => {
    if (!carpoolId) return;

    setIsLoading(true);

    try {
      const database = getDatabase();
      const carpoolRef = ref(database, `carpools/${carpoolId}`);

      const updates = {
        name: values.name,
        ownerEmail: values.email,
        timeZone: values.timeZone,
        updatedAt: Date.now(),
      };

      await update(carpoolRef, updates);

      Alert.alert("Success", "Carpool updated successfully!");
      setCarpoolData({
        name: values.name,
        ownerEmail: values.email,
        timeZone: values.timeZone,
      });
    } catch (error) {
      console.error("Error updating carpool:", error);
      Alert.alert("Error", "Failed to update carpool. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCarpool = async () => {
    if (!carpoolId) return;

    setIsDeleting(true);

    try {
      const database = getDatabase();
      const carpoolRef = ref(database, `carpools/${carpoolId}`);

      await remove(carpoolRef);

      router.replace("/");
    } catch (error) {
      console.error("Error deleting carpool:", error);
      Alert.alert("Error", "Failed to delete carpool. Please try again.");
      setIsDeleting(false);
    }
  };

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading carpool data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ResponsiveContainer>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Edit Carpool</Text>
          <Text style={styles.subtitle}>Update your carpool information</Text>
        </View>

        <View style={styles.formSection}>
          <Form fields={formFields} onSubmit={handleUpdateCarpool}>
            <BigButton
              title={isLoading ? "Updating..." : "Update"}
              onPress={() => {}} // Form component handles the onPress
              disabled={isLoading}
              style={styles.updateButton}
            />
          </Form>

          <BigButton
            title={isDeleting ? "Deleting..." : "Delete"}
            onPress={() => setShowDeleteDialog(true)}
            disabled={isDeleting || isLoading}
            variant="danger"
            style={styles.deleteButton}
          />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
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
  updateButton: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  deleteButton: {
    alignSelf: "center",
  },
});
