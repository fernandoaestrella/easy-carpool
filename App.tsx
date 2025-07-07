import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Easy Carpool App - Firebase Connected!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
