import { colors } from "../styles/colors";
import React from "react";
import { View, Text } from "react-native";

interface Passenger {
  name: string;
  contact: {
    email?: string;
    phone?: string;
  };
  joinedAt: number;
}

const PassengerRegistrationCard: React.FC<{ passenger: Passenger }> = ({
  passenger,
}) => (
  <View
    style={{
      padding: 8,
      marginVertical: 4,
      backgroundColor: "#f4f4f4",
      borderRadius: 8,
    }}
  >
    <Text style={{ fontWeight: "bold" }}>{passenger.name}</Text>
    <Text>Email: {passenger.contact.email || "N/A"}</Text>
    <Text>Phone: {passenger.contact.phone || "N/A"}</Text>
    <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
      Joined: {new Date(passenger.joinedAt).toLocaleString()}
    </Text>
  </View>
);

export default PassengerRegistrationCard;
