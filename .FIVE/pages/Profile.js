import { StyleSheet, Image, SafeAreaView, Pressable } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { GridImageCircles } from "../components/GridImageCircles";

const Profile = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <Pressable
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Image
          style={styles.button}
          source={require("../assets/icons/settings-inactive.png")}
        />
      </Pressable>

      <GridImageCircles
        navigation={navigation}
        userId={FIREBASE_AUTH.currentUser.uid}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  settingsButton: {
    position: "absolute",
    right: 13,
    //top: 9,
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    margin: 1,
  },
  button: {
    width: 34,
    height: 34,
  },
});

export { Profile };
