# Firebase Setup for Easy Carpool

This guide will help you set up Firebase for your Easy Carpool application.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "easy-carpool")
4. Enable Google Analytics if desired
5. Click "Create project"

## Step 2: Configure Firebase for your app

### Web Setup

1. In the Firebase console, click on the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "easy-carpool-web")
3. Check "Also set up Firebase Hosting" if you want to deploy your web app directly through Firebase

- Firebase Hosting is a secure, fast hosting service for web apps
- Provides free SSL certificates and CDN by default
- Allows easy deployment with the Firebase CLI

4. Click "Register app"
5. Copy the Firebase configuration object

### Update Configuration

1. Add the Firebase configuration to your `App.tsx` file:

```typescript
// Add these imports at the top of App.tsx
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Add your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
```

## Step 3: Set up Realtime Database

1. In the Firebase console, go to "Realtime Database" from the left navigation
2. Click "Create database"
3. Choose a location closest to your users
4. Start in test mode for development (You can update security rules later)
5. Click "Enable"

## Step 4: Set up Security Rules

Basic security rules for your Realtime Database:

```
{
  "rules": {
    "carpools": {
      "$carpoolId": {
        ".read": true,
        ".write": true,
        "rides": {
          "$rideId": {
            ".read": true,
            ".write": true
          }
        },
        "waitlist": {
          "$passengerId": {
            ".read": true,
            ".write": true
          }
        }
      }
    }
  }
}
```

Note: For production, you might want to implement more restrictive security rules.

## Step 5: Install the Firebase SDK

```
npm install firebase
```

## Step 6: Set up Firebase Hosting

Since your app is already using Firebase for the database, using Firebase Hosting provides a seamless integrated experience:

1. Install the Firebase CLI if you haven't already:

```
npm install -g firebase-tools
```

2. Login to Firebase:

```
firebase login
```

3. Initialize Firebase Hosting in your project directory:

```
firebase init hosting
```

4. During initialization:

   - Select your Firebase project
   - Specify `build` as your public directory (for Expo projects, this is where the web build will go)
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional, but recommended for CI/CD

5. Build your Expo web app:

```
npx expo export
```

6. Deploy to Firebase Hosting:

```
firebase deploy --only hosting
```

After deployment, your app will be available at `https://YOUR-PROJECT-ID.web.app`

### Continuous Deployment

To set up continuous deployment:

1. In the Firebase console, go to Hosting
2. Click "Connect to GitHub"
3. Select your repository
4. Configure build settings:
   - Build command: `npx expo export:web`
   - Output directory: `web-build` (for Expo projects)

Now your app will automatically deploy when you push to your main branch.

## Step 7: Set up automated cleanup

Follow the instructions in `firebase-cleanup.md` to set up automated cleanup of old rides and waitlist entries.
