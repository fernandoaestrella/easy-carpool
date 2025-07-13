// Firebase Cloud Function to delete expired registrations from Realtime Database
// Place this file in your functions directory (e.g., functions/deleteExpiredRegistrations.js)
// Requires: Node.js 16+, Firebase CLI, and functions SDK installed

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Path to registrations in your database (adjust as needed)
const REGISTRATION_PATHS = [
  "/carpools", // e.g., /carpools/{carpoolId}/registrations/{registrationId}
];

exports.deleteExpiredRegistrations = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async (context) => {
    const db = admin.database();
    let deletedCount = 0;
    const now = Date.now();
    for (const basePath of REGISTRATION_PATHS) {
      const carpoolSnap = await db.ref(basePath).once("value");
      if (!carpoolSnap.exists()) continue;
      const carpools = carpoolSnap.val();
      for (const carpoolId in carpools) {
        const registrations = carpools[carpoolId]?.registrations;
        if (!registrations) continue;
        for (const regId in registrations) {
          const reg = registrations[regId];
          if (reg.expiresAt && reg.expiresAt < now) {
            await db
              .ref(`${basePath}/${carpoolId}/registrations/${regId}`)
              .remove();
            deletedCount++;
          }
        }
      }
    }
    console.log(`Deleted ${deletedCount} expired registrations.`);
    return null;
  });
