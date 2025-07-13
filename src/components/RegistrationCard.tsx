import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { BigButton } from "./BigButton";
import { TimeDifference } from "./TimeDifference";

export function RegistrationCard({
  registration,
  onDelete,
  onEdit,
  isRide,
  styles,
}: {
  registration: any;
  onDelete?: () => void;
  onEdit?: () => void;
  isRide?: boolean;
  styles: any;
}) {
  return (
    <View style={styles.registrationCard}>
      {onDelete && (
        <View style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <Ionicons
            name="trash"
            size={24}
            color={colors.text.secondary}
            onPress={onDelete}
            accessibilityLabel="Delete registration"
          />
        </View>
      )}
      <Text style={styles.cardTitle}>{registration.name}</Text>
      <View style={styles.registrationDetails}>
        <Text style={styles.detailLabel}>
          Date: <Text style={styles.detailValue}>{registration.date}</Text>
        </Text>
        <Text style={styles.detailLabel}>
          Time:{" "}
          <Text style={styles.detailValue}>
            {registration.isFlexibleTime
              ? `${registration.departureTimeStart ?? ""} - ${
                  registration.departureTimeEnd ?? ""
                }`
              : registration.departureTimeStart ?? ""}
          </Text>
        </Text>
        <TimeDifference
          start={
            registration.isFlexibleTime
              ? registration.departureTimeStart
              : registration.departureTimeStart
          }
          end={
            registration.isFlexibleTime ? registration.departureTimeEnd : null
          }
        />
        {isRide && registration.seatsTotal && (
          <Text style={styles.detailLabel}>
            Seats:{" "}
            <Text style={styles.detailValue}>{registration.seatsTotal}</Text>
          </Text>
        )}
        {registration.notes && (
          <Text style={styles.detailLabel}>
            Notes: <Text style={styles.detailValue}>{registration.notes}</Text>
          </Text>
        )}
      </View>
      {onEdit && (
        <BigButton
          title="Edit Registration"
          onPress={onEdit}
          variant="secondary"
          style={styles.editButton}
        />
      )}
    </View>
  );
}
