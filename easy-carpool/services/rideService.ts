/**
 * Ride service for managing rides in Firebase Realtime Database
 */
import { database } from "@/config/firebase";
import {
  ref,
  get,
  set,
  push,
  remove,
  update,
  query,
  orderByChild,
} from "firebase/database";

/**
 * Types for ride data
 */
export interface Contact {
  email?: string;
  phone?: string;
}

export interface Passenger {
  name: string;
  contact: Contact;
  joinedAt: number;
}

export interface Ride {
  id?: string;
  driverId: string;
  date: number;
  isFlexibleTime: boolean;
  departureTimeStart: number;
  departureTimeEnd?: number;
  seatsTotal: number;
  seatsAvailable: number;
  luggageSpace: "Small" | "Medium" | "Large";
  preferToDrive: boolean;
  canDrive: boolean;
  notes?: string;
  contact: Contact;
  notifications: {
    seatFilled: boolean;
    passengerCanceled: boolean;
  };
  passengers?: Record<string, Passenger>;
}

/**
 * Creates a new ride
 * @param carpoolId The id of the carpool
 * @param ride The ride data to create
 * @returns The id of the created ride
 */
export async function createRide(
  carpoolId: string,
  ride: Omit<Ride, "id">
): Promise<string> {
  const rideRef = push(ref(database, `carpools/${carpoolId}/rides`));
  const rideId = rideRef.key as string;

  await set(rideRef, ride);

  return rideId;
}

/**
 * Gets all rides for a carpool
 * @param carpoolId The id of the carpool
 * @returns Array of rides
 */
export async function getRides(carpoolId: string): Promise<Ride[]> {
  const ridesRef = ref(database, `carpools/${carpoolId}/rides`);
  const snapshot = await get(ridesRef);

  if (snapshot.exists()) {
    const ridesData = snapshot.val();
    return Object.entries(ridesData).map(
      ([id, data]) => ({ id, ...(data as Ride) } as Ride)
    );
  }
  // Return an empty array if no rides are found
  return [];
}

/**
 * Gets a ride by id
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride to get
 * @returns The ride data or null if not found
 */
export async function getRideById(
  carpoolId: string,
  rideId: string
): Promise<Ride | null> {
  const rideRef = ref(database, `carpools/${carpoolId}/rides/${rideId}`);
  const snapshot = await get(rideRef);

  if (snapshot.exists()) {
    return { id: rideId, ...snapshot.val() } as Ride;
  }

  return null;
}

/**
 * Updates a ride
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride to update
 * @param data The data to update
 */
export async function updateRide(
  carpoolId: string,
  rideId: string,
  data: Partial<Omit<Ride, "id">>
): Promise<void> {
  const rideRef = ref(database, `carpools/${carpoolId}/rides/${rideId}`);
  await update(rideRef, data);
}

/**
 * Deletes a ride
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride to delete
 */
export async function deleteRide(
  carpoolId: string,
  rideId: string
): Promise<void> {
  const rideRef = ref(database, `carpools/${carpoolId}/rides/${rideId}`);
  await remove(rideRef);
}

/**
 * Adds a passenger to a ride
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride
 * @param passenger The passenger data
 * @returns The id of the created passenger
 */
export async function addPassengerToRide(
  carpoolId: string,
  rideId: string,
  passenger: Omit<Passenger, "joinedAt">
): Promise<string> {
  // First, get the current ride to check seats
  const ride = await getRideById(carpoolId, rideId);
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.seatsAvailable <= 0) {
    throw new Error("No seats available");
  }

  // Add the passenger
  const passengerRef = push(
    ref(database, `carpools/${carpoolId}/rides/${rideId}/passengers`)
  );
  const passengerId = passengerRef.key as string;

  await set(passengerRef, {
    ...passenger,
    joinedAt: Date.now(),
  });

  // Update seats available
  await updateRide(carpoolId, rideId, {
    seatsAvailable: ride.seatsAvailable - 1,
  });

  return passengerId;
}

/**
 * Removes a passenger from a ride
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride
 * @param passengerId The id of the passenger
 */
export async function removePassengerFromRide(
  carpoolId: string,
  rideId: string,
  passengerId: string
): Promise<void> {
  // First, get the current ride
  const ride = await getRideById(carpoolId, rideId);
  if (!ride) {
    throw new Error("Ride not found");
  }

  // Remove the passenger
  const passengerRef = ref(
    database,
    `carpools/${carpoolId}/rides/${rideId}/passengers/${passengerId}`
  );
  await remove(passengerRef);

  // Update seats available
  await updateRide(carpoolId, rideId, {
    seatsAvailable: ride.seatsAvailable + 1,
  });
}

/**
 * Gets all passengers for a ride
 * @param carpoolId The id of the carpool
 * @param rideId The id of the ride
 * @returns Array of passengers
 */
export async function getPassengers(
  carpoolId: string,
  rideId: string
): Promise<(Passenger & { id: string })[]> {
  const passengersRef = ref(
    database,
    `carpools/${carpoolId}/rides/${rideId}/passengers`
  );
  const snapshot = await get(passengersRef);

  if (snapshot.exists()) {
    const passengersData = snapshot.val();
    return Object.entries(passengersData).map(
      ([id, data]) =>
        ({ id, ...(data as Passenger) } as Passenger & { id: string })
    );
  }

  return [];
}
