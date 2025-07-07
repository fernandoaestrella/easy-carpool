import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-carpool" />
        <Stack.Screen name="carpool-success/[carpoolId]" />
        <Stack.Screen name="carpool/[carpoolId]/edit" />
        <Stack.Screen name="carpool/[carpoolId]/matching" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
