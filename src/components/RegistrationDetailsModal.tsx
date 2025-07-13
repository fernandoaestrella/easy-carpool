import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { colors } from "../styles/colors";
import { DateString } from "./DateString";
import { TimeString } from "./TimeString";
import PassengerRegistrationCard from "./PassengerRegistrationCard";
import { SmallButton } from "./SmallButton";
import RegisterAsPassengerModal from "./RegisterAsPassengerModal";
import { CopyIcon } from "./CopyIcon";

// Icon for seat (replace with your icon system if needed)
const SeatIcon = ({ filled }: { filled: boolean }) => (
  <View style={{ margin: 2 }}>
    <Text
      style={{
        fontSize: 24,
        color: filled ? colors.text.tertiary : colors.semantic.success,
      }}
    >
      ⛶
    </Text>
  </View>
);

interface ContactInfo {
  email?: string;
  phone?: string;
}

interface Passenger {
  name: string;
  contact: ContactInfo;
  joinedAt: number;
}

interface RideReg {
  driverId: string;
  date: number;
  isFlexibleTime: boolean;
  fixedDepartureTime?: number;
  departureTimeStart?: number;
  departureTimeEnd?: number;
  seatsTotal: number;
  seatsAvailable: number;
  luggageSpace: string;
  preferToDrive: boolean;
  canDrive: boolean;
  notes?: string;
  contact: ContactInfo;
  notifications?: { seatFilled?: boolean; passengerCanceled?: boolean };
  passengers?: { [passengerId: string]: Passenger };
}

interface RegistrationDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  registration: RideReg | any;
  isRide: boolean;
  timeZone: string;
  onRegisterPassenger?: (name: string, email: string, phone: string) => void;
}

const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  visible,
  onClose,
  registration,
  isRide,
  timeZone,
  onRegisterPassenger,
}) => {
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const seats = isRide
    ? Array.from(
        { length: registration.seatsTotal },
        (_, i) => i < registration.seatsTotal - registration.seatsAvailable
      )
    : [];
  const passengers =
    isRide && registration.passengers
      ? Object.values(registration.passengers)
      : [];

  const handleRegisterPassenger = (
    name: string,
    email: string,
    phone: string
  ) => {
    setRegisterModalVisible(false);
    if (onRegisterPassenger) {
      onRegisterPassenger(name, email, phone);
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background.secondary,
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxHeight: "90%",
            }}
          >
            <ScrollView>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}
              >
                Registration Details
              </Text>
              {/* Contact Info First */}
              {registration.contact &&
                Object.keys(registration.contact).length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: colors.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      Contact Info
                    </Text>
                    {Object.entries(registration.contact).map(
                      ([key, value]) => {
                        if (!value) return null;
                        let displayValue: string;
                        if (
                          typeof value === "string" ||
                          typeof value === "number"
                        ) {
                          displayValue = String(value);
                        } else {
                          displayValue = JSON.stringify(value);
                        }
                        return (
                          <View
                            key={key}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 6,
                            }}
                          >
                            <Text
                              style={{ color: colors.text.secondary, flex: 1 }}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              {displayValue}
                            </Text>
                            <TouchableOpacity
                              onPress={async () => {
                                await Clipboard.setStringAsync(displayValue);
                                Alert.alert(
                                  "Copied",
                                  `${
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                  } copied to clipboard.`
                                );
                              }}
                              style={{ marginLeft: 8 }}
                              accessibilityLabel={`Copy ${key}`}
                            >
                              <CopyIcon
                                size={16}
                                color={colors.text.secondary}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}

              {/* Other registration info */}
              {(() => {
                const fields: { label: string; value: React.ReactNode }[] = [];
                // Hide these fields
                const hidden = [
                  "passengers",
                  "notifications",
                  "intent",
                  "rideId",
                  "waitlistPassengerId",
                  "expiresAt",
                  "createdAt",
                  "driverId",
                  "contact", // Don't show contact here
                ];
                // Name
                if (registration.name)
                  fields.push({ label: "Name", value: registration.name });
                // Date
                if (registration.date)
                  fields.push({
                    label: "Date",
                    value: (
                      <DateString
                        date={registration.date}
                        timeZone={timeZone}
                      />
                    ),
                  });
                // Flexible Departure
                if (typeof registration.isFlexibleTime === "boolean")
                  fields.push({
                    label: "Flexible Departure?",
                    value: registration.isFlexibleTime ? "Yes" : "No",
                  });
                // Departure Time or Range
                if (registration.isFlexibleTime) {
                  if (
                    registration.departureTimeStart ||
                    registration.departureTimeEnd
                  ) {
                    fields.push({
                      label: "Departure Time Range",
                      value: (
                        <>
                          {registration.departureTimeStart ? (
                            <TimeString
                              time={registration.departureTimeStart}
                              timeZone={timeZone}
                            />
                          ) : (
                            "-"
                          )}
                          {" - "}
                          {registration.departureTimeEnd ? (
                            <TimeString
                              time={registration.departureTimeEnd}
                              timeZone={timeZone}
                            />
                          ) : (
                            "-"
                          )}
                        </>
                      ),
                    });
                  }
                } else if (registration.fixedDepartureTime) {
                  fields.push({
                    label: "Departure Time",
                    value: (
                      <TimeString
                        time={registration.fixedDepartureTime}
                        timeZone={timeZone}
                      />
                    ),
                  });
                }
                // Seats
                if (typeof registration.seatsTotal === "number")
                  fields.push({
                    label: "Total Seats",
                    value: registration.seatsTotal,
                  });
                if (typeof registration.seatsAvailable === "number")
                  fields.push({
                    label: "Available Seats",
                    value: registration.seatsAvailable,
                  });
                // Luggage
                if (registration.luggageSpace)
                  fields.push({
                    label: "Luggage Space",
                    value: registration.luggageSpace,
                  });
                // Prefer to Drive
                if (typeof registration.preferToDrive === "boolean")
                  fields.push({
                    label: "Prefer to Drive?",
                    value: registration.preferToDrive ? "Yes" : "No",
                  });
                // Can Drive
                if (typeof registration.canDrive === "boolean")
                  fields.push({
                    label: "Can Drive?",
                    value: registration.canDrive ? "Yes" : "No",
                  });
                // Notes
                if (registration.notes)
                  fields.push({ label: "Notes", value: registration.notes });
                return fields.map(({ label, value }, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text
                      style={{ fontWeight: "bold", color: colors.text.primary }}
                    >
                      {label}
                    </Text>
                    <Text style={{ color: colors.text.secondary }}>
                      {value}
                    </Text>
                  </View>
                ));
              })()}
              {isRide && (
                <>
                  <Text style={{ fontWeight: "bold", marginTop: 12 }}>
                    Seats:
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginVertical: 8,
                    }}
                  >
                    {seats.map((filled, idx) => (
                      <TouchableOpacity
                        key={idx}
                        disabled={filled}
                        onPress={
                          filled
                            ? undefined
                            : () => setRegisterModalVisible(true)
                        }
                        style={{ opacity: filled ? 0.5 : 1 }}
                      >
                        <SeatIcon filled={filled} />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={{ fontWeight: "bold", marginTop: 12 }}>
                    Passengers:
                  </Text>
                  {passengers.length === 0 ? (
                    <Text style={{ color: colors.text.tertiary }}>
                      No passengers registered yet.
                    </Text>
                  ) : (
                    passengers.map((p, idx) => (
                      <PassengerRegistrationCard
                        key={idx}
                        passenger={p as Passenger}
                      />
                    ))
                  )}
                </>
              )}
            </ScrollView>
            <SmallButton title="Close" onPress={onClose} />
          </View>
        </View>
      </Modal>
      {isRide && (
        <RegisterAsPassengerModal
          visible={registerModalVisible}
          onClose={() => setRegisterModalVisible(false)}
          onSubmit={handleRegisterPassenger}
        />
      )}
    </>
  );
};

export default RegistrationDetailsModal;
