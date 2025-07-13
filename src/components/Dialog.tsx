import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../styles/colors";
import { SmallButton } from "./SmallButton";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface DialogProps {
  visible: boolean;
  title: string;
  description: string;
  onAccept: () => void;
  onCancel: () => void;
  acceptText?: string;
  cancelText?: string;
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  description,
  onAccept,
  onCancel,
  acceptText = "Accept",
  cancelText = "Cancel",
  style,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <ResponsiveContainer style={style}>
          <View style={styles.container}>
            <View style={styles.dialog}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <View style={styles.buttonContainer}>
                <SmallButton
                  title={cancelText}
                  onPress={onCancel}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
                <SmallButton
                  title={acceptText}
                  onPress={onAccept}
                  style={styles.acceptButton}
                />
              </View>
            </View>
          </View>
        </ResponsiveContainer>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(60, 58, 55, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxWidth: 400,
  },
  dialog: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 24,
    elevation: 8,
    shadowColor: colors.neutral.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  cancelButtonText: {
    color: colors.text.primary,
  },
  acceptButton: {
    flex: 1,
  },
});
