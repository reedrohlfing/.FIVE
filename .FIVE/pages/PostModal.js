import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useEffect, useState } from "react";

const PostModal = ({ route }) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = route.params.post.userId;
      try {
        const docRef = doc(FIREBASE_DB, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log(
            "ERROR: Couldn't find user document from FireStore database when opening PostModal."
          );
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Pressable style={styles.post} onPress={() => navigation.goBack()}>
      <Pressable onPress={() => {}}>
        <Image
          source={{ uri: route.params.post.uri }}
          style={styles.feedBubble}
        />
      </Pressable>
      <View style={styles.postTitle}>
        {userData && (
          <>
            <Image style={styles.profileImage} source={userData.profileImage} />
            <Text style={styles.profileName}>{userData.firstName}</Text>
            {/* <Text>{time}</Text> */}
          </>
        )}
      </View>
    </Pressable>
  );
};

const screenWidth = Dimensions.get("window").width - 26;

const styles = StyleSheet.create({
  post: {
    paddingBottom: 32,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  feedBubble: {
    width: screenWidth,
    height: screenWidth,
    borderRadius: "50%",
    alignSelf: "center",
    backgroundColor: "#F6F6F6",
  },
  postTitle: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  profileImage: {
    width: 37,
    height: 37,
    borderRadius: "50%",
    alignSelf: "center",
    backgroundColor: "#F6F6F6",
  },
  profileName: {
    fontWeight: "bold",
  },
});

export { PostModal };
