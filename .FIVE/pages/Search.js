import { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  or,
  limit,
  where,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { UserGrid } from "../components/UserGrid";

const Search = () => {
  const [text, onChangeText] = useState("");
  const [userMatches, setUserMatches] = useState([]);
  const usersColRef = useMemo(() => collection(FIREBASE_DB, "users"), []);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        usersColRef,
        or(
          where("firstNameLower", "==", text.toLowerCase()),
          where("lastNameLower", "==", text.toLowerCase()),
          where("fullNameLower", "==", text.toLowerCase()),
          where("phoneNumber", "==", text),
          where("phoneNumberNoCountry", "==", text)
        ),
        limit(25)
      ),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserMatches(users);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [text]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, styles.searchInputWithCloseButton]}
          onChangeText={onChangeText}
          value={text}
          placeholder="Search by name or phone number"
        />
        {text.length > 0 && (
          <Pressable
            onPress={() => onChangeText("")}
            style={styles.closeButtonContainer}
          >
            <Image
              style={styles.closeButton}
              source={require("../assets/icons/close-inactive.png")}
            />
          </Pressable>
        )}
      </View>
      {userMatches.length > 0 ? (
        <FlatList
          style={styles.searchResults}
          data={userMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.userContainer}
              onPress={() =>
                item.userId === FIREBASE_AUTH.currentUser.uid
                  ? navigation.navigate("Profile")
                  : navigation.navigate("Bud", { userId: item.userId })
              }
            >
              <Image
                style={styles.profileImage}
                source={{ uri: item.profileImage }}
              />
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <UserGrid navigation={navigation} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    position: "relative",
  },
  searchInput: {
    height: 56,
    paddingHorizontal: 24,
    fontSize: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    color: "rgba(0, 0, 0, 0.6)",
    border: "none",
    backgroundColor: "#F6F6F6",
    borderRadius: 50,
    marginTop: 4,
    marginBottom: 12,
  },
  searchInputWithCloseButton: {
    paddingRight: 60, // Make space for the close button
  },
  closeButtonContainer: {
    position: "absolute",
    margin: "auto",
    right: 32,
    top: 15,
  },
  closeButton: {
    position: "relative",
    right: 0,
    height: 34,
    width: 34,
    textAlign: "right",
  },
  searchResults: {
    marginTop: 12,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    marginRight: 16,
    backgroundColor: "#F6F6F6",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export { Search };
