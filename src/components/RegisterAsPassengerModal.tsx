import React, { useState } from "react";
import { Modal, View, Text, TextInput } from "react-native";
import { SmallButton } from "./SmallButton";

interface RegisterAsPassengerModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, phone: string) => void;
}

const RegisterAsPassengerModal: React.FC<RegisterAsPassengerModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
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
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            width: "90%",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
            Register as Passenger
          </Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
            keyboardType="phone-pad"
          />
          <SmallButton
            title="Submit"
            onPress={() => onSubmit(name, email, phone)}
          />
          <SmallButton title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default RegisterAsPassengerModal;
