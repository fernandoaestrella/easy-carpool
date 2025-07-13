// Registration field configs for ride and passenger
export const luggageOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

export const rideFields = [
  { key: "date", label: "Departure Date", type: "date", required: true },
  {
    key: "isFlexibleTime",
    label: "Flexible Departure Time",
    type: "checkbox",
    default: false,
  },
  {
    key: "departureTimeStart",
    label: "Departure Time Start",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime !== true,
  },
  {
    key: "seatsTotal",
    label: "Seats Available",
    type: "number",
    required: true,
  },
  {
    key: "luggageSpace",
    label: "Luggage Space",
    type: "dropdown",
    options: luggageOptions,
    default: "medium",
  },
  {
    key: "preferToDrive",
    label: "I prefer to drive",
    type: "checkbox",
    default: true,
  },
  {
    key: "canDrive",
    label: "I can drive",
    type: "checkbox",
    default: false,
    showIf: (values: any) => values.preferToDrive === false,
  },
  { key: "notes", label: "Notes", type: "multiline_text" },
  { key: "name", label: "Name", type: "text", required: true },
  {
    key: "phone",
    label: "Phone",
    type: "phone",
    placeholder: "Enter your phone (or email below)",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email (or phone above)",
  },
];

export const passengerFields = [
  { key: "date", label: "Departure Date", type: "date", required: true },
  {
    key: "isFlexibleTime",
    label: "Flexible Departure",
    type: "checkbox",
    default: false,
  },
  {
    key: "departureTimeStart",
    label: "Departure Time Start",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTimeEnd",
    label: "Departure Time End",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime === true,
  },
  {
    key: "departureTime",
    label: "Departure Time",
    type: "time",
    required: true,
    showIf: (values: any) => values.isFlexibleTime !== true,
  },
  {
    key: "canDrive",
    label: "I can drive if needed",
    type: "checkbox",
    default: false,
  },
  { key: "notes", label: "Notes", type: "multiline_text" },
  { key: "name", label: "Name", type: "text", required: true },
  {
    key: "phone",
    label: "Phone",
    type: "phone",
    placeholder: "Enter your phone (or email below)",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email (or phone above)",
  },
];
