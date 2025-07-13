import React from "react";
import { View, Text } from "react-native";
import { RegistrationCard } from "./RegistrationCard";
import { getResponsiveContentStyle } from "../styles/layout";

export function RegistrationList({
  registrations,
  isRide,
  styles,
  windowWidth,
  timeZone,
  userReferenceDepartureTimeMs,
}: {
  registrations: any[];
  isRide: boolean;
  styles: any;
  windowWidth: number;
  timeZone: string;
  userReferenceDepartureTimeMs?: number | null;
}) {
  return (
    <View style={getResponsiveContentStyle(windowWidth)}>
      <View style={styles.allRegistrationsContainer}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {isRide ? "Available Rides" : "Passengers Looking for Rides"}
          </Text>
          {registrations.length === 0 ? (
            <Text style={styles.emptyListText}>
              {isRide
                ? "No rides available yet. Be the first to offer a ride!"
                : "No passengers in waitlist yet."}
            </Text>
          ) : (
            registrations.map((reg, idx) => (
              <RegistrationCard
                key={reg.rideId || reg.waitlistPassengerId || idx}
                registration={reg}
                isRide={isRide}
                styles={styles}
                timeZone={timeZone}
                userReferenceDepartureTimeMs={userReferenceDepartureTimeMs}
                showDetailsOnClick={true}
                onRegisterPassenger={(
                  name: string,
                  email: string,
                  phone: string
                ) => {
                  // TODO: Implement registration logic in parent if needed
                  // This is a placeholder for now
                  console.log(
                    "Register as passenger:",
                    name,
                    email,
                    phone,
                    reg
                  );
                }}
              />
            ))
          )}
        </View>
      </View>
    </View>
  );
}
