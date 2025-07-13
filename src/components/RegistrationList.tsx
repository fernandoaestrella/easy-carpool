import React from "react";
import { View, Text } from "react-native";
import { RegistrationCard } from "./RegistrationCard";
import { getResponsiveContentStyle } from "../styles/layout";

export function RegistrationList({
  registrations,
  isRide,
  styles,
  windowWidth,
}: {
  registrations: any[];
  isRide: boolean;
  styles: any;
  windowWidth: number;
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
              />
            ))
          )}
        </View>
      </View>
    </View>
  );
}
