export interface RideRegistrationData {
  date: string;
  isFlexibleTime: boolean;
  fixedDepartureTime?: string; // Only set if isFlexibleTime is false. Represents the exact departure time for fixed departures.
  departureTimeStart?: string; // Only set if isFlexibleTime is true. Represents the start of the flexible time range.
  departureTimeEnd?: string; // Only set if isFlexibleTime is true. Represents the end of the flexible time range.
  seatsTotal: number;
  luggageSpace: string;
  preferToDrive: boolean;
  canDrive: boolean;
  notes: string;
  email: string;
  phone: string;
  name: string;
}

export interface PassengerRegistrationData {
  date: string;
  isFlexibleTime: boolean;
  fixedDepartureTime?: string; // Only set if isFlexibleTime is false. Represents the exact departure time for fixed departures.
  departureTimeStart?: string; // Only set if isFlexibleTime is true. Represents the start of the flexible time range.
  departureTimeEnd?: string; // Only set if isFlexibleTime is true. Represents the end of the flexible time range.
  canDrive: boolean;
  notes: string;
  email: string;
  phone: string;
  name: string;
}
