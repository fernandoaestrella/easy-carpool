import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { BigButton } from "./BigButton";
import { TimeDifference } from "./TimeDifference";

import { formatTimeWithZone } from "../utils/registrationUtils";

export function RegistrationCard({
  registration,
  onDelete,
  onEdit,
  isRide,
  styles,
  timeZone,
  userReferenceDepartureTimeMs,
}: {
  registration: any;
  onDelete?: () => void;
  onEdit?: () => void;
  isRide?: boolean;
  styles: any;
  timeZone: string;
  userReferenceDepartureTimeMs?: number | null;
}) {
  // Debug: log the raw time values
  console.log("RegistrationCard times:", {
    departureTimeStart: registration.departureTimeStart,
    departureTimeEnd: registration.departureTimeEnd,
    name: registration.name,
  });
  // Helper to get registration's departure time (fixed or flexible start)
  const getRegistrationDepartureTimeMs = () => {
    const date = registration.date;
    const time = registration.isFlexibleTime
      ? registration.departureTimeStart
      : registration.fixedDepartureTime;
    if (!date || !time) return null;
    try {
      // @ts-ignore
      const { DateTime } = require("luxon");
      // Combine date and time into ISO string
      const iso = `${date}T${time}`;
      const dt = DateTime.fromISO(iso, { zone: timeZone });
      if (dt.isValid) return dt.toMillis();
      return null;
    } catch {
      return null;
    }
  };

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
        {/* 1. Time Difference (always first) */}
        <TimeDifference
          registrationTimeMs={getRegistrationDepartureTimeMs()}
          referenceTimeMs={userReferenceDepartureTimeMs}
        />

        {/* 2. Departure Date */}
        {registration.date && (
          <Text style={styles.detailLabel}>
            Date: <Text style={styles.detailValue}>{registration.date}</Text>
          </Text>
        )}

        {/* 3. Flexible Departure */}
        {typeof registration.isFlexibleTime === "boolean" && (
          <Text style={styles.detailLabel}>
            Flexible Departure:{" "}
            <Text style={styles.detailValue}>
              {registration.isFlexibleTime ? "Yes" : "No"}
            </Text>
          </Text>
        )}

        {/* 4. Departure Time or Range */}
        {registration.isFlexibleTime ? (
          <Text style={styles.detailLabel}>
            Time Range:{" "}
            <Text style={styles.detailValue}>
              {registration.departureTimeStart
                ? formatTimeWithZone(registration.departureTimeStart, timeZone)
                : "-"}
              {registration.departureTimeStart && registration.departureTimeEnd
                ? " - "
                : ""}
              {registration.departureTimeEnd
                ? formatTimeWithZone(registration.departureTimeEnd, timeZone)
                : "-"}
            </Text>
          </Text>
        ) : (
          <Text style={styles.detailLabel}>
            Departure Time:{" "}
            <Text style={styles.detailValue}>
              {registration.fixedDepartureTime
                ? formatTimeWithZone(registration.fixedDepartureTime, timeZone)
                : "-"}
            </Text>
          </Text>
        )}

        {/* 5. Seats Available (if ride) */}
        {isRide && registration.seatsTotal !== undefined && (
          <Text style={styles.detailLabel}>
            Seats:{" "}
            <Text style={styles.detailValue}>{registration.seatsTotal}</Text>
          </Text>
        )}

        {/* 6. Luggage Space (if ride) */}
        {isRide && registration.luggageSpace && (
          <Text style={styles.detailLabel}>
            Luggage Space:{" "}
            <Text style={styles.detailValue}>{registration.luggageSpace}</Text>
          </Text>
        )}

        {/* 7. I prefer to drive / I can drive if needed */}
        {isRide && typeof registration.preferToDrive === "boolean" && (
          <Text style={styles.detailLabel}>
            Prefer to Drive:{" "}
            <Text style={styles.detailValue}>
              {registration.preferToDrive ? "Yes" : "No"}
            </Text>
          </Text>
        )}
        {!isRide && typeof registration.canDrive === "boolean" && (
          <Text style={styles.detailLabel}>
            Can Drive if Needed:{" "}
            <Text style={styles.detailValue}>
              {registration.canDrive ? "Yes" : "No"}
            </Text>
          </Text>
        )}

        {/* 8. Notes */}
        {registration.notes && (
          <Text style={styles.detailLabel}>
            Notes: <Text style={styles.detailValue}>{registration.notes}</Text>
          </Text>
        )}

        {/* 9. Contact Info */}
        {registration.contact && (
          <View>
            <Text style={styles.detailLabel}>
              Email:{" "}
              <Text style={styles.detailValue}>
                {registration.contact.email || "-"}
              </Text>
            </Text>
            <Text style={styles.detailLabel}>
              Phone:{" "}
              <Text style={styles.detailValue}>
                {registration.contact.phone || "-"}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
