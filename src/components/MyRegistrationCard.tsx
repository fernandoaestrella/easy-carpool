import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BigButton } from "./BigButton";
import { colors } from "../styles/colors";

/**
 * MyRegistrationCard displays the user's own registration without time difference.
 * Props:
 * - registration: RegistrationWithId (user's registration data)
 * - onDelete: function to call when deleting registration
 * - onEdit: function to call when editing registration
 * - isRide: boolean (true if registration is a ride)
 * - styles: styles object from parent
 * - timeZone: string (timezone ID)
 */

import {
  RideRegistrationData,
  PassengerRegistrationData,
} from "../types/registration";
import { formatTimeWithZone } from "../utils/registrationUtils";

type RideRegistrationWithId = RideRegistrationData & { rideId?: string };
type PassengerRegistrationWithId = PassengerRegistrationData & {
  waitlistPassengerId?: string;
};
type RegistrationWithId = (
  | RideRegistrationWithId
  | PassengerRegistrationWithId
) & { intent?: "offer" | "join" | null };

interface MyRegistrationCardProps {
  registration: RegistrationWithId;
  onDelete: () => void;
  onEdit: () => void;
  isRide: boolean;
  styles: any;
  timeZone: string;
}

const MyRegistrationCard: React.FC<MyRegistrationCardProps> = ({
  registration,
  onDelete,
  onEdit,
  isRide,
  styles,
  timeZone,
}) => {
  // Display all registration details except time difference
  return (
    <View style={styles.registrationCard}>
      <Text style={styles.cardTitle}>Your Registration</Text>
      <View style={styles.registrationDetails}>
        {isRide ? (
          <>
            <Text style={styles.detailLabel}>
              Seats Total:{" "}
              <Text style={styles.detailValue}>
                {(registration as RideRegistrationWithId).seatsTotal}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Luggage Space:{" "}
              <Text style={styles.detailValue}>
                {(registration as RideRegistrationWithId).luggageSpace || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Departure Date:{" "}
              <Text style={styles.detailValue}>
                {formatDate(
                  (registration as RideRegistrationWithId).date,
                  timeZone
                )}
              </Text>
            </Text>
            {(registration as RideRegistrationWithId).isFlexibleTime ? (
              <Text style={styles.detailLabel}>
                Departure Window:{" "}
                <Text style={styles.detailValue}>
                  {formatTimeWithZone(
                    (registration as RideRegistrationWithId)
                      .departureTimeStart ?? "",
                    timeZone
                  )}{" "}
                  -{" "}
                  {formatTimeWithZone(
                    (registration as RideRegistrationWithId).departureTimeEnd ??
                      "",
                    timeZone
                  )}
                </Text>
              </Text>
            ) : (
              <Text style={styles.detailLabel}>
                Departure Time:{" "}
                <Text style={styles.detailValue}>
                  {formatTimeWithZone(
                    (registration as RideRegistrationWithId)
                      .fixedDepartureTime ?? "",
                    timeZone
                  )}
                </Text>
              </Text>
            )}
            <Text style={styles.detailLabel}>
              Notes:{" "}
              <Text style={styles.detailValue}>
                {(registration as RideRegistrationWithId).notes || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Contact Email:{" "}
              <Text style={styles.detailValue}>
                {(registration as RideRegistrationWithId).email || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Contact Phone:{" "}
              <Text style={styles.detailValue}>
                {(registration as RideRegistrationWithId).phone || "-"}
              </Text>
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.detailLabel}>
              Can Drive:{" "}
              <Text style={styles.detailValue}>
                {(registration as PassengerRegistrationWithId).canDrive
                  ? "Yes"
                  : "No"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Departure Date:{" "}
              <Text style={styles.detailValue}>
                {formatDate(
                  (registration as PassengerRegistrationWithId).date,
                  timeZone
                )}
              </Text>
            </Text>
            {(registration as PassengerRegistrationWithId).isFlexibleTime ? (
              <Text style={styles.detailLabel}>
                Departure Window:{" "}
                <Text style={styles.detailValue}>
                  {formatTimeWithZone(
                    (registration as PassengerRegistrationWithId)
                      .departureTimeStart ?? "",
                    timeZone
                  )}{" "}
                  -{" "}
                  {formatTimeWithZone(
                    (registration as PassengerRegistrationWithId)
                      .departureTimeEnd ?? "",
                    timeZone
                  )}
                </Text>
              </Text>
            ) : (
              <Text style={styles.detailLabel}>
                Departure Time:{" "}
                <Text style={styles.detailValue}>
                  {formatTimeWithZone(
                    (registration as PassengerRegistrationWithId)
                      .fixedDepartureTime ?? "",
                    timeZone
                  )}
                </Text>
              </Text>
            )}
            <Text style={styles.detailLabel}>
              Notes:{" "}
              <Text style={styles.detailValue}>
                {(registration as PassengerRegistrationWithId).notes || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Contact Email:{" "}
              <Text style={styles.detailValue}>
                {(registration as PassengerRegistrationWithId).email || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Contact Phone:{" "}
              <Text style={styles.detailValue}>
                {(registration as PassengerRegistrationWithId).phone || "-"}
              </Text>
            </Text>
          </>
        )}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BigButton title="Edit" onPress={onEdit} style={styles.editButton} />
        <BigButton
          title="Delete"
          onPress={onDelete}
          style={styles.editButton}
        />
      </View>
    </View>
  );
};

function formatDate(
  timestamp: number | string | undefined,
  timeZone: string
): string {
  if (!timestamp) return "-";
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { timeZone });
  } catch {
    return "-";
  }
}

function formatTime(
  timestamp: number | string | undefined,
  timeZone: string
): string {
  if (!timestamp) return "-";
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export { MyRegistrationCard };
