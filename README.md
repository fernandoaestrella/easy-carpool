# Easy Carpool

A carpooling app that facilitates finding carpool matches in the easiest way possible.

## 🚀 Quick Links

- **🌐 Live Website**: [https://easy-carpool-f6a8f.web.app/](https://easy-carpool-f6a8f.web.app/)
- **📊 Firebase Database**: [Console](https://console.firebase.google.com/u/0/project/easy-carpool-f6a8f/database/easy-carpool-f6a8f-default-rtdb/data)
- **📝 GitHub Repository**: [https://github.com/fernandoaestrella/easy-carpool](https://github.com/fernandoaestrella/easy-carpool)

## 🌟 Features

- **No account creation needed** - Jump right in and start organizing carpools
- **Automatic cleanup** - Ride registrations are automatically deleted after completion
- **Smart sorting** - Rides sorted by departure times closest to your intended time
- **Easy contact sharing** - Copy all passenger contact info with a single click
- **Real-time updates** - See changes instantly across all connected devices

## 🏃‍♂️ Running the App (Web Only)

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**

   ```powershell
   git clone https://github.com/fernandoaestrella/easy-carpool.git
   cd easy-carpool
   ```

2. **Install dependencies**

   ```powershell
   npm install
   ```

3. **Start the development server**

   ```powershell
   npm start
   ```

4. **Open in web browser**
   - Press `w` in the terminal to open in web browser
   - Or manually navigate to the URL shown in the terminal (typically `http://localhost:8081`)

### Testing 404 Functionality

To test the Page Not Found feature:

1. Start the development server
2. Navigate to any invalid URL (e.g., `http://localhost:8081/nonexistent`)
3. You'll see a random playful carpool-themed 404 message
4. Click "Back to Safe Roads" to return home

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run web` - Start the web development server directly
- `npm run android` - Start for Android (requires Android setup)
- `npm run ios` - Start for iOS (requires iOS setup)

## 🏗️ Architecture

### File-Based Routing with Expo Router

The app uses **Expo Router** for file-based routing, providing automatic URL handling and universal deep linking:

```
app/
├── _layout.tsx         # Root layout with Firebase initialization
├── index.tsx          # Landing page (/)
└── +not-found.tsx     # 404 page for invalid URLs
```

### Key Features

- **Automatic 404 handling** - Invalid URLs automatically show the Page Not Found screen
- **Universal deep linking** - All routes work across web, iOS, and Android
- **File-based routing** - URLs automatically match the file structure
- **Playful error messages** - Random carpool-themed messages on 404 pages

### Navigation

- **`/`** - Landing page with app information and carpool creation
- **`/any-invalid-url`** - Shows Page Not Found with random playful messages
- Routes are automatically generated from files in the `app/` directory

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Database**: Firebase Realtime Database
- **Hosting**: Firebase Hosting
- **Language**: TypeScript

## 🎨 Design Philosophy

The app follows an earthy, organic design with:

- Unsaturated, calming colors
- Rounded borders only on interactive elements
- Clean, open layouts that guide the eye naturally
- Subtle textures that evoke a grounded, natural feel

## 📱 How It Works

1. **Create a carpool** - Set up a new carpool with trip details
2. **Share the link** - Share with potential riders and passengers
3. **Register your trip** - Choose to offer a ride or join as a passenger
4. **Connect with others** - View matches and coordinate your shared ride

### Page Not Found (404)

The app includes a delightful 404 page with:

- **Random playful messages** - Carpool-themed headings like "Looks like this ride took a wrong turn!"
- **Helpful suggestions** - Guidance to check the URL or ask for a new link
- **Beautiful illustration** - Mountain road scene with directional signs
- **Easy navigation** - "Back to Safe Roads" button returns to home

## 🔧 Development

### Project Structure

```
easy-carpool/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout & Firebase config
│   ├── index.tsx          # Landing page
│   └── +not-found.tsx     # 404 page
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Legacy screen components
│   └── styles/           # Color palette & styling
├── assets/               # Images and static files
└── documentation/        # Design docs & setup guides
```

### Development Principles

This project follows best practices including:

- **Single Responsibility Principle** - Each component has one clear purpose
- **Clean Architecture** - Clear separation of concerns
- **Modular components** - Reusable, independent components
- **TypeScript for type safety** - Preventing runtime errors
- **Consistent code formatting** - Automated linting and formatting
- **File-based routing** - Intuitive URL structure matching file system

## 📖 Documentation

For detailed design specifications and implementation details, see:

- [Design Document](./documentation/design%20doc.md)
- [Firebase Setup Instructions](./documentation/firebase_dev_instructions/)

---

**Note**: This app is currently configured for web deployment only. Mobile app deployment requires additional setup and configuration.
