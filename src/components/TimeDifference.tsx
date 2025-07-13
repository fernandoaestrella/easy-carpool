import React from "react";
import { View, Text } from "react-native";

interface TimeDifferenceProps {
  registrationTimeMs?: number | null;
  referenceTimeMs?: number | null;
}

// Display the time difference as 'X hr Y mins after/before your departure time'
export const TimeDifference: React.FC<TimeDifferenceProps> = ({
  registrationTimeMs,
  referenceTimeMs,
}) => {
  if (registrationTimeMs == null || referenceTimeMs == null) {
    return null;
  }
  const diffMs = registrationTimeMs - referenceTimeMs;
  const absMs = Math.abs(diffMs);
  const sign = diffMs === 0 ? 0 : diffMs > 0 ? 1 : -1;
  const totalMinutes = Math.floor(absMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let text = "";
  if (hours > 0 && minutes > 0) {
    text = `${hours} hr ${minutes} mins`;
  } else if (hours > 0) {
    text = `${hours} hr${hours > 1 ? "s" : ""}`;
  } else {
    text = `${minutes} mins`;
  }
  if (sign === 0) {
    text += " (same as your departure time)";
  } else if (sign > 0) {
    text += " after your departure time";
  } else {
    text += " before your departure time";
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: "#888" }}>{text}</Text>
    </View>
  );
};
