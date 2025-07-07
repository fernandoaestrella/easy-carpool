import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Modal,
  useWindowDimensions,
} from "react-native";
import { colors } from "../styles/colors";
import {
  getTimezoneOptions,
  getPopularTimezones,
  TimezoneOption,
} from "../data/timezones";

interface TimezoneSearchDropdownProps {
  value: string;
  onSelect: (timezoneId: string) => void;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
}

export const TimezoneSearchDropdown: React.FC<TimezoneSearchDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Search timezones...",
  error,
  style,
}) => {
  const { width, height } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState<TimezoneOption[]>(
    []
  );
  const [allTimezones, setAllTimezones] = useState<TimezoneOption[]>([]);
  const inputRef = useRef<TextInput>(null);

  // Get selected timezone display name
  const getDisplayName = () => {
    if (!value) return "";
    const selected = allTimezones.find((tz) => tz.id === value);
    return selected ? selected.displayName : value;
  };

  useEffect(() => {
    const timezones = getTimezoneOptions();
    setAllTimezones(timezones);

    // Show popular timezones initially
    if (!searchText) {
      setFilteredTimezones(getPopularTimezones());
    }
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredTimezones(getPopularTimezones());
    } else {
      const filtered = allTimezones.filter(
        (timezone) =>
          timezone.displayName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          timezone.id.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTimezones(filtered.slice(0, 50)); // Limit results for performance
    }
  }, [searchText, allTimezones]);

  const handleOpen = () => {
    setIsOpen(true);
    setSearchText("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSelect = (timezone: TimezoneOption) => {
    onSelect(timezone.id);
    setIsOpen(false);
    setSearchText("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText("");
  };

  const renderTimezoneItem = ({ item }: { item: TimezoneOption }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.dropdownItemText} numberOfLines={1}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={handleOpen}
      >
        <Text
          style={[styles.inputText, !value && styles.placeholderText]}
          numberOfLines={1}
        >
          {value ? getDisplayName() : placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View
            style={[
              styles.modalContent,
              {
                width: width * 0.9,
                maxHeight: height * 0.7,
              },
            ]}
          >
            <View style={styles.searchContainer}>
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Type to search timezones..."
                autoFocus
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.listContainer}>
              {!searchText && (
                <Text style={styles.sectionHeader}>Popular Timezones</Text>
              )}

              <FlatList
                data={filteredTimezones}
                renderItem={renderTimezoneItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  inputError: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: 12,
    color: colors.semantic.error,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    overflow: "hidden",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  searchInput: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  listContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
  },
});
