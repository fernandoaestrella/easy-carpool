import { DimensionValue } from "react-native";

/**
 * Returns a style object for responsive content width: 65% of window width on desktop/tablet (>=768px), 100% on mobile.
 * @param windowWidth The current window width (from useWindowDimensions)
 */
export function getResponsiveContentStyle(windowWidth: number): {
  width: DimensionValue;
  alignSelf: "center";
} {
  if (windowWidth >= 768) {
    return {
      width: Math.round(windowWidth * 0.65),
      alignSelf: "center",
    };
  }
  return {
    width: "100%" as DimensionValue,
    alignSelf: "center",
  };
}
