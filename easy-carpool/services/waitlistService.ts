/**
 * Waitlist service for managing waitlist passengers in Firebase Realtime Database
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
import { Contact } from "./rideService";

/**
 * Types for waitlist data
 */
export interface WaitlistPassenger {
  id?: string;
  date: number;
  isFlexibleTime: boolean;
  departureTimeStart: number;
  departureTimeEnd?: number;
  canDrive: boolean;
  notes?: string;
  contact: Contact;
  createdAt: number;
}

/**
 * Adds a passenger to the waitlist
 * @param carpoolId The id of the carpool
 * @param passenger The waitlist passenger data
 * @returns The id of the created waitlist entry
 */
export async function addToWaitlist(
  carpoolId: string,
  passenger: Omit<WaitlistPassenger, "id" | "createdAt">
): Promise<string> {
  const passengerRef = push(ref(database, `carpools/${carpoolId}/waitlist`));
  const passengerId = passengerRef.key as string;

  await set(passengerRef, {
    ...passenger,
    createdAt: Date.now(),
  });

  return passengerId;
}

/**
 * Gets all waitlist passengers for a carpool
 * @param carpoolId The id of the carpool
 * @returns Array of waitlist passengers
 */
export async function getWaitlistPassengers(
  carpoolId: string
): Promise<WaitlistPassenger[]> {
  const waitlistRef = ref(database, `carpools/${carpoolId}/waitlist`);
  const snapshot = await get(waitlistRef);

  if (snapshot.exists()) {
    const waitlistData = snapshot.val();
    return Object.entries(waitlistData).map(
      ([id, data]) =>
        ({ id, ...(data as Partial<WaitlistPassenger>) } as WaitlistPassenger)
    );
  }

  return [];
}

/**
 * Gets a waitlist passenger by id
 * @param carpoolId The id of the carpool
 * @param passengerId The id of the waitlist passenger to get
 * @returns The waitlist passenger data or null if not found
 */
export async function getWaitlistPassengerById(
  carpoolId: string,
  passengerId: string
): Promise<WaitlistPassenger | null> {
  const passengerRef = ref(
    database,
    `carpools/${carpoolId}/waitlist/${passengerId}`
  );
  const snapshot = await get(passengerRef);

  if (snapshot.exists()) {
    return { id: passengerId, ...snapshot.val() } as WaitlistPassenger;
  }

  return null;
}

/**
 * Updates a waitlist passenger
 * @param carpoolId The id of the carpool
 * @param passengerId The id of the waitlist passenger to update
 * @param data The data to update
 */
export async function updateWaitlistPassenger(
  carpoolId: string,
  passengerId: string,
  data: Partial<Omit<WaitlistPassenger, "id" | "createdAt">>
): Promise<void> {
  const passengerRef = ref(
    database,
    `carpools/${carpoolId}/waitlist/${passengerId}`
  );
  await update(passengerRef, data);
}

/**
 * Removes a passenger from the waitlist
 * @param carpoolId The id of the carpool
 * @param passengerId The id of the waitlist passenger to remove
 */
export async function removeFromWaitlist(
  carpoolId: string,
  passengerId: string
): Promise<void> {
  const passengerRef = ref(
    database,
    `carpools/${carpoolId}/waitlist/${passengerId}`
  );
  await remove(passengerRef);
}
