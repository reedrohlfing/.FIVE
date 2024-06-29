import { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
} from "react-native";

const Search = () => {
  const [text, onChangeText] = useState("");

  return (
    <SafeAreaView>
      <TextInput
        style={styles.searchInput}
        onChangeText={onChangeText}
        value={text}
        placeholder="Search"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    color: "rgba(0, 0, 0, 0.6)",
    borderColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 50,
  },
});

export { Search };
