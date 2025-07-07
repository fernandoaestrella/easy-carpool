# Firebase Cleanup Functions Setup

This document describes how to set up Firebase Cloud Functions to automatically delete old rides and waitlist entries.

## Prerequisites

1. Install Firebase CLI

```
npm install -g firebase-tools
```

2. Login to Firebase

```
firebase login
```

3. Initialize Firebase Functions

```
firebase init functions
```

## Implementation

The cleanup function will run on a schedule to delete rides and waitlist entries that have passed.

### Create the function

In your Firebase Functions project, create a file `src/cleanupOldData.ts`:

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase admin
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Function that runs every hour to clean up old ride data
 * Deletes rides and waitlist entries that are more than 6 hours old
 */
export const cleanupOldData = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    const db = admin.database();
    const now = Date.now();

    // Buffer time is 6 hours (in milliseconds)
    const bufferTime = 6 * 60 * 60 * 1000;
    const cutoffTime = now - bufferTime;

    // Get all carpools
    const carpoolsSnapshot = await db.ref("carpools").once("value");
    const carpools = carpoolsSnapshot.val();

    if (!carpools) {
      console.log("No carpools found");
      return null;
    }

    const promises = [];

    // Process each carpool
    Object.keys(carpools).forEach((carpoolId) => {
      const carpool = carpools[carpoolId];

      // Clean up rides
      if (carpool.rides) {
        Object.keys(carpool.rides).forEach((rideId) => {
          const ride = carpool.rides[rideId];
          // Get the effective departure time (start time for fixed, middle for flexible)
          const departureTime =
            ride.isFlexibleTime && ride.departureTimeEnd
              ? ride.departureTimeStart +
                (ride.departureTimeEnd - ride.departureTimeStart) / 2
              : ride.departureTimeStart;

          if (departureTime < cutoffTime) {
            // Delete the ride
            console.log(`Deleting ride ${rideId} from carpool ${carpoolId}`);
            promises.push(
              db.ref(`carpools/${carpoolId}/rides/${rideId}`).remove()
            );
          }
        });
      }

      // Clean up waitlist
      if (carpool.waitlist) {
        Object.keys(carpool.waitlist).forEach((passengerId) => {
          const passenger = carpool.waitlist[passengerId];
          const departureTime =
            passenger.isFlexibleTime && passenger.departureTimeEnd
              ? passenger.departureTimeStart +
                (passenger.departureTimeEnd - passenger.departureTimeStart) / 2
              : passenger.departureTimeStart;

          if (departureTime < cutoffTime) {
            // Delete the waitlist entry
            console.log(
              `Deleting waitlist passenger ${passengerId} from carpool ${carpoolId}`
            );
            promises.push(
              db.ref(`carpools/${carpoolId}/waitlist/${passengerId}`).remove()
            );
          }
        });
      }
    });

    // Wait for all delete operations to complete
    await Promise.all(promises);
    console.log(`Cleanup complete. Processed ${promises.length} items.`);

    return null;
  });
```

### Deploy the function

Deploy to Firebase:

```
firebase deploy --only functions
```

## Testing

You can test the function by manually triggering it:

```
firebase functions:shell
```

Then run:

```
cleanupOldData()
```

This will execute the function and log the results.
