export interface RideRegistrationData {
  date: string;
  isFlexibleTime: boolean;
  departureTimeStart: string;
  departureTimeEnd: string;
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
  departureTimeStart: string;
  departureTimeEnd: string;
  canDrive: boolean;
  notes: string;
  email: string;
  phone: string;
  name: string;
}
