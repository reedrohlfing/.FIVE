import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import ProfileHeader from "../components/ProfileHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import "firebase/storage";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE, FIREBASE_AUTH } from "../FirebaseConfig";

const GridImageCircles = ({ navigation }) => {
  const [circles, setCircles] = useState([]);
  const size = Dimensions.get("window").width / 2.4;

  const fetchImages = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const postsRef = ref(FIREBASE_STORAGE, `user/${userId}/posts`);
      const listResponse = await listAll(postsRef);
      const imageRefs = listResponse.items.reverse(); // Start with the newest at the top

      const imageUrls = await Promise.all(
        imageRefs.map((imageRef) => getDownloadURL(imageRef))
      );

      const newCircles = imageUrls.map((image) => ({
        size,
        uri: image,
        userId,
      }));
      setCircles(newCircles);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  const handleBubblePress = (post) => {
    navigation.navigate("PostModal", { post });
  };

  return (
    <View style={styles.gridContainer}>
      {circles.map((circle, index) => (
        <Pressable
          key={index}
          style={styles.gridItem}
          onPress={() => handleBubblePress(circle)}
        >
          <Image
            source={{ uri: circle.uri }}
            style={{
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              backgroundColor: "#F6F6F6",
            }}
          />
        </Pressable>
      ))}
    </View>
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
          style={styles.button}
          source={require("../assets/icons/settings-black-inactive.png")}
        />
      </Pressable>

      <ScrollView
        style={styles.bubblesScroll}
        contentContainerStyle={styles.bubblesContainer}
      >
        <GridImageCircles navigation={navigation} />
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
    backgroundColor: "white",
  },
  bubblesContainer: {
    paddingVertical: 10,
  },
  gridContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  gridItem: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});

export { Profile };
