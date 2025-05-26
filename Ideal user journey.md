easy carpool

This carpooling app facilitates finding a carpool match in the easiest way possible

- automatically deletes passenger, waitlist and ride registrations some hours after the registered date and time, so that they don't clog lists when not needed
- automatically sorts registered rides or waitlist passengers in order of the ones departing closest to the user's intended departure time
- copy the contact info of all passengers registered in a ride with a single click
- no account creation needed
- user interface facilitates comparing various departure options

Ideal user journey

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
  - round trip

Screens:

- Landing
  - Create new One Way Carpool button (Small Button)
  - Explanation of the method
- Create New One Way Carpool
  - Form fields (all required):
    - Carpool name
    - User's email
    - Departure time zone selector (needed for automatically deleting past events after they have happened)
    - Create button (Big Button)
  - Outputs 2 urls: 1 for Carpool Matching page, and another for the Edit Carpool page
- Edit Carpool
  - Form fields:
    - Name
    - Email
    - Departure time zone selector
    - Update button (Big Button)
    - Delete button (Big Button) (uses confirmation dialog before deleting) (deleted carpool urls take to the Page Doesn't Exist screen if opened) (after deleting, take to the Create New One Way Carpool page)
- Carpool Matching
  - 2 tabs menu
    1. My Registration (if it has not been submitted yet, provides button to create a new one)
    - "Register Your Departure" button (Big Button)
    - Registration modal which covers the full screen (auto saves locally as it is filled but only published publicly when submitted) (if no user registration exists when opening the link to the carpool, they are taken here first) (can be closed to go see All Registrations, but only after going through a dialog that suggests that, for the best user experience, they should fill the registration information first, because the screen will show and sort relevant registrations as one fills the own one, but if they are certain they want to see the other registrations, they can do so)
      - Intent Buttons (Set of Big Buttons)
        - I want to offer a ride
        - I want to join a ride as a passenger
      - [Ride/Passenger] Registration Input Form
        - Departure Date Picker
        - Departure Time Picker
    2. All registrations. very similar to groupcarpool.com
    - 2 tabs menu. All registrations in any of the 2 tabs are sorted by how close are they to the departure date and time of the user, with integer number for hours that could be positive or negtive, accordingly. All registrations show every data from users, and make it very easy to notice which contact info was not provided, both because of the lack of the data but also because of the highlight graying tone used on the space corresponding to that contact info point.
      1. Rides
      - See a summary of the registration situation with images, e.g. images representing how many seats are avaialable, how many are taken, and if the ride is full. Whatever is unavailable must be gray, whatever is available must be green
      - When a ride is clicked, see all the details of all registrations in that ride
      - Sort rides by which are will happen closest to the user's registered departure
      2. Waitlist
      - See all existing passenger info
      - Sort waitlist registration by which will happen closest to the user's registered departure
- Page Doesn't Exist

Components in order of implementation:

- Small Button
- Time Picker
  - adapt react-native-calendar-timetable to show the Ride Registrations in columns, only in the same column if times don't overlap, and sorted by those closest to the planned departure time. Do not show rides with no available seats
  - Departure
    = Shape:
    > Flexible
    - Rectangular
      > Fixed
    - Rectangular with Maximally Rounded Borders
    - Seat Availability "[Seat Icon] X/Y"
      - Available Seats
      - Total Seats
    - Time
      > Flexible "9:00 AM - 2:30 PM"
      - Departure Time Range Start
      - Departure Time Range End
        > Fixed "6:30 AM"
      - Time String
    - Ride Provider Name "Indhira Ghandhi"
      - First Name
      - Last Name
- Form
- Ride Registration Input Form
  - Departure Date Picker
  - Departure Time Picker
- Ride Registration
  - Time Difference
  - Ride Registration Input Form data
    - Departure Date Input (required)
    - Departure Time Input (required)
      - "Flexible Departure" boolean
      - Departure Time Range Start
        - Time String
      - Departure Time Range End
        - Time String
    - Seats Available (required)
    - Luggage Space Available (Small, Medium, Large)
      - Dropdown
    - "I prefer to drive" checkbox (default: True)
    - If "I prefer to drive" checkbox is False, show: "I can drive" checkbox (default: True)
    - Notes
- Ride List
  - List of Ride Registrations from smallest Time Difference absolute value to highest. If an absolute value is equal, gives higher priority to the positive value. If they were both positive, gives any priority to both.
- Passenger Registration Input Form
- Passenger Registration
  - Time Difference
  - Passenger Registration Input Form data
    - Departure Date Input (required)
    - Departure Time Input (required)
      - "Flexible Departure" boolean
      - Departure Time Range Start
      - Departure Time Range End
    - "I can drive if needed" checkbox (default: False)
    - Notes Input
- Passenger List
  - List of Passenger Registrations from smallest Time Difference absolute value to highest. If an absolute value is equal, gives higher priority to the positive value. If they were both positive, gives any priority to both.
- Date Picker
  - Date Selector
  - List of [Ride/Passenger] Registrations
    - Date Registrations Summary
      - Date
        - Week Day Name
        - Comma
        - Month Name
        - Month Day Number
      - Ride Registration Data
        - Ride Registration Total for the given date
        - Total number of empty seats in all rides in the given date
      - Passenger Registration Data
        - Passenger Registration Total for the given date
- Big Button
- Big Button Set
- Dialog
  - Title
  - Description
  - Accept button (Small Button)
  - Cancel button (Small Button)
- Contact Information
  - email
  - phone
