// Manual cleanup script for expired registrations in Firebase Realtime Database
// Usage: node scripts/manualDeleteExpiredRegistrations.js path/to/serviceAccountKey.json
// Requires: npm install firebase-admin

const admin = require("firebase-admin");
const fs = require("fs");

if (process.argv.length < 3) {
  console.error(
    "Usage: node manualDeleteExpiredRegistrations.js path/to/serviceAccountKey.json"
  );
  process.exit(1);
}

const serviceAccountPath = process.argv[2];
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Service account key file not found:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easy-carpool-f6a8f-default-rtdb.firebaseio.com/", // Change if your DB URL is different
});

const db = admin.database();
const REGISTRATION_PATH = "/carpools";

(async () => {
  const now = Date.now();
  let deletedCount = 0;
  const carpoolSnap = await db.ref(REGISTRATION_PATH).once("value");
  if (!carpoolSnap.exists()) {
    console.log("No carpools found.");
    process.exit(0);
  }
  const carpools = carpoolSnap.val();
  for (const carpoolId in carpools) {
    const registrations = carpools[carpoolId]?.registrations;
    if (!registrations) continue;
    for (const regId in registrations) {
      const reg = registrations[regId];
      if (reg.expiresAt && reg.expiresAt < now) {
        await db
          .ref(`${REGISTRATION_PATH}/${carpoolId}/registrations/${regId}`)
          .remove();
        deletedCount++;
        console.log(
          `Deleted expired registration: carpoolId=${carpoolId}, regId=${regId}`
        );
      }
    }
  }
  console.log(`Done. Deleted ${deletedCount} expired registrations.`);
  process.exit(0);
})();
