import React from "react";
import { Text } from "react-native";
import { DateTime } from "luxon";

interface TimeStringProps {
  time: string | number | undefined;
  timeZone: string;
  style?: any;
}

// Outputs: 6:30 AM (no timezone)
export const TimeString: React.FC<TimeStringProps> = ({
  time,
  timeZone,
  style,
}) => {
  if (!time) return <Text style={style}>-</Text>;
  let dt;
  if (typeof time === "number") {
    dt = DateTime.fromMillis(time, { zone: timeZone });
  } else {
    dt = DateTime.fromISO(time, { zone: timeZone });
  }
  if (!dt.isValid) return <Text style={style}>-</Text>;
  // Use offsetNameShort for abbreviation (e.g., CST, EST, PDT)
  const abbr = dt.offsetNameShort || dt.toFormat("ZZZ");
  return (
    <Text style={style}>
      {dt.toFormat("h:mm a")} {abbr}
    </Text>
  );
};
