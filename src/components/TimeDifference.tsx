import React from "react";
import { View, Text } from "react-native";

interface TimeDifferenceProps {
  start?: string | null;
  end?: string | null;
}

// This component will later calculate and display the time difference, but for now just shows the values or null
export const TimeDifference: React.FC<TimeDifferenceProps> = ({
  start,
  end,
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: "#888" }}>
        Time Difference: {start ?? "null"} - {end ?? "null"}
      </Text>
    </View>
  );
};
