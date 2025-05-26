/**
 * Carpool service for managing carpools in Firebase Realtime Database
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
 * Types for carpool data
 */
export interface Carpool {
  id?: string;
  name: string;
  ownerEmail: string;
  timeZone: string;
  createdAt: number;
}

/**
 * Creates a new carpool
 * @param carpool The carpool data to create
 * @returns The id of the created carpool
 */
export async function createCarpool(
  carpool: Omit<Carpool, "id" | "createdAt">
): Promise<string> {
  const carpoolRef = push(ref(database, "carpools"));
  const carpoolId = carpoolRef.key as string;

  await set(carpoolRef, {
    ...carpool,
    createdAt: Date.now(),
  });

  return carpoolId;
}

/**
 * Gets a carpool by id
 * @param id The id of the carpool to get
 * @returns The carpool data or null if not found
 */
export async function getCarpoolById(id: string): Promise<Carpool | null> {
  const carpoolRef = ref(database, `carpools/${id}`);
  const snapshot = await get(carpoolRef);

  if (snapshot.exists()) {
    return { id, ...snapshot.val() } as Carpool;
  }

  return null;
}

/**
 * Updates a carpool
 * @param id The id of the carpool to update
 * @param data The data to update
 */
export async function updateCarpool(
  id: string,
  data: Partial<Omit<Carpool, "id" | "createdAt">>
): Promise<void> {
  const carpoolRef = ref(database, `carpools/${id}`);
  await update(carpoolRef, data);
}

/**
 * Deletes a carpool
 * @param id The id of the carpool to delete
 */
export async function deleteCarpool(id: string): Promise<void> {
  const carpoolRef = ref(database, `carpools/${id}`);
  await remove(carpoolRef);
}
