import React from "react";
import { Text } from "react-native";
import { DateTime } from "luxon";

interface DateStringProps {
  date: string | number;
  timeZone: string;
  style?: any;
}

// Outputs: Monday, January 14
export const DateString: React.FC<DateStringProps> = ({
  date,
  timeZone,
  style,
}) => {
  let dt;
  if (typeof date === "number") {
    dt = DateTime.fromMillis(date, { zone: timeZone });
  } else {
    dt = DateTime.fromISO(date, { zone: timeZone });
  }
  if (!dt.isValid) return <Text style={style}>-</Text>;
  return <Text style={style}>{dt.toFormat("cccc, LLLL d")}</Text>;
};
