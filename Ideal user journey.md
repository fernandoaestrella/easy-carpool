Ideal user journey

- by user intent
  - want to offer a ride
    1. ask for intent
    2. collect trip information
    - date (required)
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
      - indicate if open to being contacted in IM services by checking a box for each. Rider is encouraged to use the same as everyone else to facilitate others reaching them, so each platform will have next to them the amount of users they have world wide
        - WhatsApp (2 billion users)
        - iOS Messages (1.3 billion users)
        - Telegram (700 million users)
        - SMS (5 billion users)
        - etc
    4. set optional email notifications. by default, they are all off. all notifications contain all available information at the time of reporting, like who performed the action, their contact info as well as request information, and all the other data of all other passengers already registered for the ride, if there's any left
       a. when each seat is filled in your ride, with a special subject line indicating when the ride is full
       b. when someone unregisters
    5. submit ride
    6. see all other submitted information or update his own information with same UI as when creating the initial registration. the rider's ride information is always accesible without scrolling via the first tab in the tab menu, with all existing ride and waitlist data in the second tab
    7. when ride time arrives, copy all/some contact info and message all/some riders
    8. meet or pick up passengers and ride
    9. ride info and passenger's registration is automatically deleted after a certain buffer time (e.g. 6 hours)
  - want to join an established ride
    1. ask for intent
    2. collect trip information
    - date (required)
      - show how many other rides and free seats are available for that date
    - time (required)
      - show how many other rides and free seats are available near that date and time
    - notes
  - open to anything (e.g. joining, offering, or renting a car after confirming interest from others)
- by date and time
  - if deciding which date and time to travel on,
- amount of rides
  - one way
  - round trip

Screens:

- Landing
  - Create new One Way Carpool button
  - Explanation of the method
- Create New One Way Carpool
  - Form fields (all required):
    - Carpool name
    - User's email
    - Departure time zone selector (needed for automatically deleting past events after they have happened)
    - Create button
  - Outputs 2 urls: 1 for Carpool Matching page, and another for the Edit Carpool page
- Edit Carpool
  - Form fields:
    - Name
    - Email
    - Departure time zone selector
    - Update button
    - Delete button (uses confirmation dialog before deleting) (deleted carpool urls take to the Page Doesn't Exist screen if opened) (after deleting, take to the Create New One Way Carpool page)
- Carpool Matching
  - 2 tabs menu
    1. My Registration (if it has not been submitted yet, provides button to create a new one)
    - Registration modal which covers the full screen (auto saves locally as it is filled but only published publicly when submitted) (if no user registration exists when opening the link to the carpool, they are taken here first) (can be closed to go see All Registrations, but only after going through a dialog that suggests that, for the best user experience, they should fill the registration information first, because the screen will show and sort relevant registrations as one fills the own one, but if they are certain they want to see the other registrations, they can do so)
    2. All registrations. very similar to groupcarpool.com
    - 2 tabs menu. All registrations sorted by how close are they to the departure date and time of the user, with integer number for hours that could be positive or negtive, accordingly. All registrations show every data from users, and makes very easy to notice which contact info was not provided, both because of the lack of the data but also because of the highlight graying tone used near the space corresponding to that contact info point.
      1. Rides
      - When a ride is unclicked, show a summary of the registration situation with images, e.g. images representing how many seats are avaialable, how many are taken, and if the ride is full
      - When clicked, show all the details of all registrations in that ride
      2. Waitlist
- Page Doesn't Exist

Components:

- Passenger Registration
- Passenger List
- Ride Registration
- Ride List
- Form
- Time Difference
- Big Button
- Big Button Set
- Date and Time
