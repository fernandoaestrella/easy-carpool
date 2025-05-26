/**
 * Utility functions for time calculations and sorting
 */
import { Ride } from "@/services/rideService";
import { WaitlistPassenger } from "@/services/waitlistService";

/**
 * Calculates the time difference in hours between two timestamps
 * @param time1 First timestamp
 * @param time2 Second timestamp
 * @returns Time difference in hours
 */
export function getTimeDifferenceInHours(time1: number, time2: number): number {
  const diffMs = time1 - time2;
  return Math.round(diffMs / (1000 * 60 * 60));
}

/**
 * Gets effective departure time for flexible or fixed times
 * @param entity A ride or waitlist passenger
 * @returns The effective departure time
 */
export function getEffectiveDepartureTime(
  entity: Pick<
    Ride | WaitlistPassenger,
    "isFlexibleTime" | "departureTimeStart" | "departureTimeEnd"
  >
): number {
  if (entity.isFlexibleTime && entity.departureTimeEnd) {
    // For flexible time, use the middle of the range
    return (
      entity.departureTimeStart +
      (entity.departureTimeEnd - entity.departureTimeStart) / 2
    );
  }
  return entity.departureTimeStart;
}

/**
 * Sorts rides by how close they are to a target time
 * @param rides Array of rides
 * @param targetTime The target time to compare against
 * @returns Sorted array of rides
 */
export function sortRidesByTimeProximity(
  rides: Ride[],
  targetTime: number
): Ride[] {
  return [...rides].sort((a, b) => {
    const aTime = getEffectiveDepartureTime(a);
    const bTime = getEffectiveDepartureTime(b);

    const aDiff = getTimeDifferenceInHours(aTime, targetTime);
    const bDiff = getTimeDifferenceInHours(bTime, targetTime);

    // Sort by absolute difference first
    const aAbsDiff = Math.abs(aDiff);
    const bAbsDiff = Math.abs(bDiff);

    if (aAbsDiff !== bAbsDiff) {
      return aAbsDiff - bAbsDiff;
    }

    // If absolute differences are equal, prioritize later departures
    return bDiff - aDiff;
  });
}

/**
 * Sorts waitlist passengers by how close they are to a target time
 * @param passengers Array of waitlist passengers
 * @param targetTime The target time to compare against
 * @returns Sorted array of waitlist passengers
 */
export function sortWaitlistByTimeProximity(
  passengers: WaitlistPassenger[],
  targetTime: number
): WaitlistPassenger[] {
  return [...passengers].sort((a, b) => {
    const aTime = getEffectiveDepartureTime(a);
    const bTime = getEffectiveDepartureTime(b);

    const aDiff = getTimeDifferenceInHours(aTime, targetTime);
    const bDiff = getTimeDifferenceInHours(bTime, targetTime);

    // Sort by absolute difference first
    const aAbsDiff = Math.abs(aDiff);
    const bAbsDiff = Math.abs(bDiff);

    if (aAbsDiff !== bAbsDiff) {
      return aAbsDiff - bAbsDiff;
    }

    // If absolute differences are equal, prioritize later departures
    return bDiff - aDiff;
  });
}

/**
 * Filters rides by date
 * @param rides Array of rides
 * @param date The date to filter for (timestamp at midnight)
 * @returns Filtered array of rides
 */
export function filterRidesByDate(rides: Ride[], date: number): Ride[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return rides.filter((ride) => {
    const rideDate = new Date(ride.date);
    return rideDate >= startOfDay && rideDate <= endOfDay;
  });
}

/**
 * Filters waitlist passengers by date
 * @param passengers Array of waitlist passengers
 * @param date The date to filter for (timestamp at midnight)
 * @returns Filtered array of waitlist passengers
 */
export function filterWaitlistByDate(
  passengers: WaitlistPassenger[],
  date: number
): WaitlistPassenger[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return passengers.filter((passenger) => {
    const passengerDate = new Date(passenger.date);
    return passengerDate >= startOfDay && passengerDate <= endOfDay;
  });
}

/**
 * Filters rides or waitlist passengers by time proximity
 * @param items Array of rides or waitlist passengers
 * @param targetTime The target time
 * @param hourRange The number of hours before and after to include
 * @returns Filtered array of items
 */
export function filterByTimeProximity<T extends Ride | WaitlistPassenger>(
  items: T[],
  targetTime: number,
  hourRange: number = 12
): T[] {
  return items.filter((item) => {
    const itemTime = getEffectiveDepartureTime(item);
    const diffHours = Math.abs(getTimeDifferenceInHours(itemTime, targetTime));
    return diffHours <= hourRange;
  });
}
