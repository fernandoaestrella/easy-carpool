import { colors } from "../styles/colors";
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

  // Calculate days, hours, and minutes from the absolute difference
  let remainingMs = absMs;
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  remainingMs -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  remainingMs -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(remainingMs / (60 * 1000));

  // Build the time difference string with correct pluralization and conjunctions

  // Always include all nonzero units, and always show days if days > 0
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0 || (days > 0 && (minutes > 0 || hours > 0)))
    parts.push(`${hours} hr${hours !== 1 ? "s" : ""}`);
  if (minutes > 0 || parts.length === 0)
    parts.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);

  let text = "";
  if (parts.length === 1) {
    text = parts[0];
  } else if (parts.length === 2) {
    text = `${parts[0]} and ${parts[1]}`;
  } else if (parts.length === 3) {
    text = `${parts[0]}, ${parts[1]} and ${parts[2]}`;
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
      <Text style={{ color: colors.text.tertiary }}>{text}</Text>
    </View>
  );
};
