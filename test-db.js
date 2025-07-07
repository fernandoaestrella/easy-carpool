// Firebase Database Test Script
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push } from "firebase/database";

// Firebase configuration (same as in App.tsx)
const firebaseConfig = {
  apiKey: "AIzaSyAnv5ueNzrVB1yRUTSJKA1ZOqi24a99n80",
  authDomain: "easy-carpool-f6a8f.firebaseapp.com",
  databaseURL: "https://easy-carpool-f6a8f-default-rtdb.firebaseio.com",
  projectId: "easy-carpool-f6a8f",
  storageBucket: "easy-carpool-f6a8f.firebasestorage.app",
  messagingSenderId: "794192770852",
  appId: "1:794192770852:web:0e6690fa120c66c7e6e5b1",
  measurementId: "G-PQGS3G8NYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testDatabase() {
  try {
    console.log("Testing Firebase Realtime Database...");

    // Create sample carpool data matching your data structure
    const testCarpoolData = {
      name: "Test Seattle to Portland Carpool",
      ownerEmail: "test@example.com",
      timeZone: "America/Los_Angeles",
      createdAt: Date.now(),
      rides: {},
      waitlist: {},
    };

    // Generate a carpool ID and write to database
    const carpoolsRef = ref(database, "carpools");
    const newCarpoolRef = push(carpoolsRef);
    const carpoolId = newCarpoolRef.key;

    console.log(`Writing test carpool with ID: ${carpoolId}`);
    await set(newCarpoolRef, testCarpoolData);

    // Read back the data to verify
    console.log("Reading back the data...");
    const snapshot = await get(newCarpoolRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("✅ Database test successful!");
      console.log("Retrieved data:", JSON.stringify(data, null, 2));

      // Clean up test data
      console.log("Cleaning up test data...");
      await set(newCarpoolRef, null);
      console.log("✅ Test data cleaned up");
    } else {
      console.log("❌ No data found - test failed");
    }
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }

  process.exit(0);
}

testDatabase();
