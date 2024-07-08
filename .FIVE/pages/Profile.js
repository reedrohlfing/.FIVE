import {
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import { useNavigation } from "@react-navigation/native";

const ImageComponent = ({ image, size }) => {
  return (
    <Image
      style={[styles.bubble, { height: size, width: size }]}
      source={image}
    />
  );
};

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
          style={[styles.button]}
          source={require("../assets/icons/settings-black-inactive.png")}
        />
      </Pressable>

      <ScrollView
        style={styles.bubblesScroll}
        contentContainerStyle={styles.bubblesContainer}
      >
        <ImageComponent
          image={require("../fake-cdn/images/blacks.jpg")}
          size={75}
        />
        <ImageComponent
          image={require("../fake-cdn/images/croatia.jpg")}
          size={150}
        />
        <ImageComponent
          image={require("../fake-cdn/images/green.jpg")}
          size={200}
        />
        <ImageComponent
          image={require("../fake-cdn/images/f1.jpg")}
          size={300}
        />
        <ImageComponent
          image={require("../fake-cdn/images/tennis.jpg")}
          size={112}
        />
      </ScrollView>
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
    top: 11.5,
  },
  button: {
    width: 33,
    height: 33,
  },
  bubblesScroll: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  bubblesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bubble: {
    maxHeight: 402,
    maxWidth: 402,
    borderRadius: 9000,
    margin: 6,
  },
});

export { Profile };
