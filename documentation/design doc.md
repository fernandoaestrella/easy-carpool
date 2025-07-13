# easy carpool

## Summary

This carpooling app facilitates finding a carpool match in the easiest way possible

- automatically deletes passenger, waitlist and ride registrations some hours after the registered date and time, so that they don't clog lists when not needed
- automatically sorts registered rides or waitlist passengers in order of the ones departing closest to the user's intended departure time
- copy the contact info of all passengers registered in a ride with a single click
- no account creation needed
- user interface facilitates comparing various departure options

## Ideal user journey

- by user intent
  - want to offer a ride
    1. ask for intent
    2. collect trip information
    - date (required)
      - the date picker must show, for every date, the amount of passengers requesting for a ride that day which are in the waitlist
      - find existing passengers for that date
        - if passengers are in the waitlist:
          - see how many passengers are requesting for a ride on that date, sorted by those requesting to depart closest to midday. show both the total amount and the individual users, showing their contact info and their request info, plus the time difference between the target time. Time differnces with a later departure time should be displayed with positive numbers, and earlier departure times should be displayed with negative numbers.
      - see the total amount of rides and free seats that are available for that date so that if there are too many and the rider is flexible, they can choose a different date
    - departure time (required)
      - select whether leaving at a fixed time or if departure time is flexible. indicate the departure time or time range, as appropriate
        - if passengers are in the waitlist:
          - see all passengers requesting for a ride within 24 hours of the selected departure time (within 12 hrs before and 12 hrs after), sorted by their closeness to the registered departure time, or the time in the middle of the input departure time range. change the length of the filtering time window if needed
          1. click button to copy all their contact info
          - if all gave their email: copy their email into email app
          - if all gave their phone number, copy all the numbers in a messaging app
            - output the list of numbers in this format:
              +1 (123) 456-7890, +1 (234) 567-8901, +1 (345) 678-9012
              which is detected correctly in the Messages app as separate numbers
          - if some gave their email:
            - copy all available emails and see who had not given their emails
          - if some gave their phone number:
            - copy all available numbers and see who had not given their numbers
          2. paste on a single messaging app and send a msg to all
        - if passengers are not in the waitlist:
          - show nothing
      - see how many other rides and free seats are available around that date and time so that if there are too many and the rider is flexible, they can choose a different date and time
    - seats available (required)
    - luggage space available (Small, Medium, Large)
    - notes
    3. collect contact info. provide any of the two, but is encouraged to prioritize one over the other. must provide one of the two, ideally both.
    - email
    - phone
    4. set optional email notifications. by default, they are all off. all notifications contain all available information at the time of reporting, like who performed the action, their contact info as well as request information, and all the other data of all other passengers already registered for the ride, if there's any left
       a. when each seat is filled in your ride, with a special subject line indicating when the ride is full
       b. when someone unregisters, with a special subject line when the ride is empty
    5. submit ride
    6. see all other submitted information or update his own information with same UI as when creating the initial registration. the rider's ride information is always accesible without scrolling via the first tab in the tab menu, with all existing ride and waitlist data in the second tab
    7. when ride time arrives, copy all/some contact info and message all/some riders
    8. meet or pick up passengers and ride
    9. ride info and passenger's registration is automatically deleted after a certain buffer time (e.g. 6 hours)
  - want to join an established ride
    1. ask for intent
    2. collect trip information
    - date (required)
      - the date picker must show, for every date, the amount of rides with open seats and the amount of open seats
    - time (required)
      - show how many other rides and free seats are available near that date and time
    - notes
    3. select an existing ride
    4. register as passenger in the ride
    5. at any moment before the ride time, get contacted by the rider or contact the rider to confirm meeting place and time
    6. ride together
    7. ride info and passenger's registration is automatically deleted after a certain buffer time (e.g. 6 hours)
  - open to anything (e.g. joining, offering, or renting a car after confirming interest from others)
- by date and time
  - if deciding which date and time to travel on, just follow the steps in the previous section ("by user intent") and use the Date Picker and Time Picker to choose the desired date and time
- amount of rides
  - one way
  - round trip (will not be implemented initially)

## Screens:

- Landing
  - Create new One Way Carpool button (Small Button)
  - Explanation of the method
- Create New One Way Carpool
  - Form fields (all required):
    - Carpool name
    - User's email
    - Departure time zone selector (searchable dropdown with predefined timezone IDs, needed for automatically deleting past events 6 hours after they have happened)
      - Opens a searchable modal with timezone options
      - Shows popular timezones by default
      - Allows typing to filter all available timezones
      - Displays timezone as "City, Region (UTC±X:XX) Zone Name"
      - Stores timezone ID (e.g., "America/New_York") in database
    - Create button (Big Button component)
  - Outputs 2 urls: 1 for Carpool Matching page, and another for the Edit Carpool page
- Edit Carpool
  - Form fields:
    - Name
    - Email
    - Departure time zone selector (searchable dropdown with predefined timezone IDs)
    - Update button (Big Button component)
    - Delete button (Big Button component) (uses confirmation dialog before deleting) (deleted carpool urls take to the Page Doesn't Exist screen if opened) (after deleting, take to the Create New One Way Carpool page)
- Carpool Matching
  - 2 tabs menu
    1. My Registration (if it has not been submitted yet, provides button to create a new one)
    - "Register Your Departure" button (Big Button)
      - Registration modal which covers the full screen (auto saves locally as it is filled but only published publicly when submitted) (if no user registration exists when opening the link to the carpool, they are taken to this opened modal first) (can be closed to go see All Registrations, but only after going through a dialog that suggests that, for the best user experience, they should fill the registration information first, because the screen will show and sort relevant registrations while one fills the own one, but if they are certain they want to see the other registrations, they can do so)
        - Intent Buttons (Set of Big Buttons)
          - I want to offer a ride
          - I want to join a ride as a passenger
        - [Ride/Passenger] Registration Input Form <!-- according too what they chose in the previous step -->
    2. All registrations. very similar to groupcarpool.com
    - 2 tabs menu. All registrations in any of the 2 tabs are sorted by how close are they to the departure date and time of the user, with integer number for hours that could be positive or negtive, accordingly. All registrations show every data from users, and make it very easy to notice which contact info was not provided, both because of the lack of the data but also because of the highlight graying tone used on the space corresponding to that contact info point.
      1. Rides
      - See a summary of the registration situation with images, e.g. images representing how many seats are avaialable, how many are taken, and if the ride is full. An unavailable seat must be gray, an available seat must be green
      - When a ride is clicked, see all the details of all registrations in that ride
      - Sort rides by which will happen closest to the user's registered departure time
      2. Waitlist
      - See all existing passenger info in a Passenger List
      - Sort waitlist registrations by which will happen closest to the user's registered departure
- Page Doesn't Exist page
  - Suggests clicking again the link received from a trusted source

## Components in order of implementation:

- Small Button
- Time Picker
  - adapt react-native-calendar-timetable to show the Ride Registrations in columns, only in the same column if times don't overlap. Do not show rides with no available seats
  - Departure <!-- this is a summarized version of a Ride Registration -->
    <!-- Flexible Departure: no border, Fixed Departure: colored border, same color as the components background color but darker -->
    - Seat Availability "[Seat Icon] X/Y"
      - Available Seats
      - Total Seats
    - Time
      - Flexible Departure "9:00 AM CST - 2:30 PM CST"
        - Departure Time Range Start
        - Departure Time Range End
      - Fixed Departure "6:30 AM CST"
        - Time String
    - Ride Provider Name "Indhira Ghandhi"
      - First Name
      - Last Name
- Contact Information
  - email
  - phone
- Ride Registration Input Form
  - Departure Date Picker (required)
  - "Flexible Departure Time" checkbox
    - If Flexible Departure Time = True
      - Departure Time Range Start Picker (required)
        - Departure Time Picker
      - Departure Time Range End Picker (required)
        - Departure Time Picker
    - If Flexible Departure Time = False
      - Departure Time Picker (required)
  - Seats Available (required)
  - Luggage Space Available (Small, Medium, Large)
    - Dropdown
  - "I prefer to drive" checkbox (default: True)
  - If "I prefer to drive" checkbox = False
    - "I can drive" checkbox (default: False)
  - Notes
    - Text Input
- Ride Registration
  - Time Difference
  - Ride Registration Input Form data
    - Departure Date
    - "Flexible Departure" boolean
    - Departure Time
      - If Flexible Departure = True
        - Departure Time Range Start
          - Time String
        - Departure Time Range End
          - Time String
      - If Flexible Departure = False
        - Departure Time
          - Time String
    - Seats Available
    - Luggage Space Available (Small, Medium, Large)
      - Dropdown
    - "I prefer to drive" checkbox
    - If "I prefer to drive" checkbox is False, show: "I can drive" checkbox
    - Notes
      - Text Display
- Ride List
  - List of Ride Registrations from smallest Time Difference absolute value to highest. If an absolute value is equal, gives higher priority to the positive value. If they were both positive, gives any priority to both.
- Passenger Registration Input Form
  - Departure Date Input (required)
  - "Flexible Departure" boolean
  - Departure Time Input (required)
    - If Flexible Departure = True
      - Departure Time Range Start Picker
      - Departure Time Range End Picker
    - If Flexible Departure = False
      - Departure Time Picker
  - "I can drive if needed" checkbox (default: False)
  - Notes Input
- Passenger Registration
  - Time Difference
  - Passenger Registration Input Form data
    - Departure Date
    - "Flexible Departure" boolean
    - Departure Time
      - If Flexible Departure = True
        - Departure Time Range Start
          - Time String
        - Departure Time Range End
          - Time String
      - If Flexible Departure = False
        - Departure Time
          - Time String
    - "I can drive if needed" checkbox (default: False)
    - Notes Input
- Passenger List
  - List of Passenger Registrations from smallest Time Difference absolute value to highest. If an absolute value is equal, gives higher priority to the positive value. If they were both positive, gives any priority to both.
- Date Picker
  - Date Selector
  - List of [Ride/Passenger] Registrations
    - Date Registrations Summary
      - Date "Monday, January 14"
        - Week Day Name
        - Comma
        - Month Name
        - Month Day Number
      - Ride Registration Data
        - Ride Registration Total for the given date
        - Total number of empty seats in all rides in the given date
      - Passenger Registration Data
        - Passenger Registration Total for the given date
- Form
- Big Button
- Big Button Set
- Dialog
  - Title
  - Description
  - Accept button (Small Button)
  - Cancel button (Small Button)
- Timezone Search Dropdown
  - Searchable modal interface
  - Shows popular timezones by default
  - Text input for filtering timezones
  - Dropdown list with timezone options
  - Formatted display: "City, Region (UTC±X:XX) Zone Name"
  - Stores timezone ID in database
- Toast

## Tech Stack

- React Native with Expo

### Database and Backend

- Realtime Database (e.g. Firebase Realtime DB)
  - Automatically syncs data across all connected clients
  - When one user makes a change, all other users see it instantly
  - Perfect for ride listings that need immediate updates
  - No need to refresh the page
  - Works offline
  - Simple JSON structure
  - Low latency

Recommended: Firebase Realtime Database

- Free tier includes:
  - 1GB storage for storing ride and user data
  - 10GB/month download/upload bandwidth for data syncing between app and database
- No server setup needed
- Simple REST API
- WebSocket-based updates
- Real-time Database or Firestore
- Cloud Functions for automated cleanup
  - Automatically deletes ride and passenger registrations after 6 hours of completion
  - Triggered by a time-based scheduler (e.g. Firebase Cron)
  - Keeps database clean and maintains only active/relevant data
  - Example:
    - If ride time was 2pm, data deleted at 8pm same day
    - Reduces database size and query times
    - Improves app performance
- Hosting included
- Serverless architecture
- Perfect for MVP and can scale
- No backend maintenance required
- Real-time updates
- Free tier is generous
- Easy integration with React Native
- Handles offline data
- Automatic scaling

## Implementation Plan

1. Create web app with expo

```powershell
# Install Expo CLI globally if not already installed
npm install -g expo-cli

# Create new Expo project in current directory
npx create-expo-app . -t expo-template-blank-typescript

# Add initial dependencies
npx expo install react-native-web firebase react-native-calendar-timetable
```

2. Create Firebase Realtime Database (refer to FIREBASE-SETUP.md)
3. Host on Firebase Hosting

- Free tier includes SSL certificates
- Fast global CDN
- Automatic deployments from Git
- Perfect integration with Firebase services
- No cold starts
- Supports custom domains
- Better for real-time applications

Firebase Hosting is beginner-friendly:

- Simple deployment with 2 commands
- Clear documentation
- Quick setup wizard
- Visual interface in Firebase Console
- Automatic HTTPS
- Built-in CDN

4. Consider Vercel only if:

- You need more advanced deployment features
- You're using Next.js
- You don't need tight Firebase integration

## Development methodology

- Use all of the best software development best practices to serve as a practice, including
  - test driven development
  - SOLID principles
    - Single Responsibility Principle: Each class should have only one reason to change
      - Open/Closed Principle: Software entities should be open for extension but closed for modification
      - Liskov Substitution Principle: Objects of a superclass should be replaceable with objects of its subclasses
        - Example: A `PassengerVehicle` class should be replaceable by its subclass `Car` without breaking the application. If `PassengerVehicle` has a method `getPassengerCapacity()`, `Car` must implement it in a way that maintains the same behavior and constraints.
      - Interface Segregation Principle: Clients should not be forced to depend on interfaces they don't use
      - Dependency Inversion Principle: High-level modules should not depend on low-level modules, both should depend on abstractions
        - Example: Instead of having a `RideService` class directly depend on a `SQLDatabase` class, create an `IDatabase` interface. Both `RideService` and `SQLDatabase` will depend on the `IDatabase` interface. This allows easily swapping databases without changing `RideService`.
  - clean architecture
  - atomic commits
  - semantic versioning
    - Semantic Versioning (also known as SemVer) is a versioning system that helps developers manage software versions in a meaningful way. It follows a three-part number format: MAJOR.MINOR.PATCH (e.g., 2.1.3).
      Here's what each number represents:
      MAJOR version: Incremented when making incompatible API changes
      MINOR version: Incremented when adding functionality in a backwards-compatible manner
      PATCH version: Incremented when making backwards-compatible bug fixes
  - continuous integration
    - Checks on every push and PR
      - Code linting
      - Unit tests
      - Build verification
      - Dependency audit
  - continuous deployment
  - documentation-driven development
  - automated testing
    - unit testing
    - integration testing
    - end-to-end testing
    - performance testing
  - security best practices
    - input validation
    - data encryption
    - secure communication
  - accessibility compliance
  - code linting and formatting
  - dependency management
  - error logging and monitoring

## Data structure

### Firebase Realtime Database JSON Structure

```json
{
  "carpools": {
    "$carpoolId": {
      "name": "string",
      "ownerEmail": "string",
      "timeZone": "string", // Timezone ID (e.g., "America/New_York", "Europe/London")
      "createdAt": "timestamp",
      "rides": {
        "$rideId": {
          "driverId": "string",
          "date": "timestamp",
          "isFlexibleTime": "boolean",
          "fixedDepartureTime": "timestamp", // Only set if isFlexibleTime is false. Represents the exact departure time for fixed departures.
          "departureTimeStart": "timestamp", // Only set if isFlexibleTime is true. Represents the start of the flexible time range.
          "departureTimeEnd": "timestamp", // Only set if isFlexibleTime is true. Represents the end of the flexible time range.
          "seatsTotal": "number",
          "seatsAvailable": "number",
          "luggageSpace": "string",
          "preferToDrive": "boolean",
          "canDrive": "boolean",
          "notes": "string",
          "contact": {
            "email": "string",
            "phone": "string"
          },
          "notifications": {
            "seatFilled": "boolean",
            "passengerCanceled": "boolean"
          },
          "passengers": {
            "$passengerId": {
              "name": "string",
              "contact": {
                "email": "string",
                "phone": "string"
              },
              "joinedAt": "timestamp"
            }
          }
        }
      },
      "waitlist": {
        "$passengerId": {
          "date": "timestamp",
          "isFlexibleTime": "boolean",
          "fixedDepartureTime": "timestamp", // Only set if isFlexibleTime is false. Represents the exact departure time for fixed departures.
          "departureTimeStart": "timestamp", // Only set if isFlexibleTime is true. Represents the start of the flexible time range.
          "departureTimeEnd": "timestamp", // Only set if isFlexibleTime is true. Represents the end of the flexible time range.
          "canDrive": "boolean",
          "notes": "string",
          "contact": {
            "email": "string",
            "phone": "string"
          },
          "createdAt": "timestamp"
        }
      }
    }
  }
}
```

## Visual Style

Broadly, the application should have earthy, organic colors in most backgrounds.
The components that will most directly be interacted with should be highlighted by having cool and calm colors.
Any final complement, detail or component shoud have neutral colors.
Nothing, unless specified, should have defined borders. the only difference will be the background color between one component and the one behind it.
Most colors should be notably unsaturated.
Contrast should be just a little high, but not too much.
Only and all interactible elements should have rounded borders. No other element should have rounded borders.
Everything can have a raw, grounded texture.

The app should evoke a calm yet playful mood.
The eye should be guided to flow freely between elements.
Strategies should be considered to make all components fell open even though they may need to display considerable amounts of information.
The app could very subtly evoke an ancient feel.
A paper, earthy or woody texture could be implied very very very subtly.
