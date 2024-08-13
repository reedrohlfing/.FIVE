import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const Post = ({ post }) => {
  // Can't use ProfileContext here because user is imported
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Grab profile information based on userId to display first + last name
    const userId = post.userId;
    const docRef = doc(FIREBASE_DB, "users", userId);
    getDoc(docRef).then((docSnap) => {
      setUser(docSnap.data());
    });
  }, [post]);

  // convert the time of the post to a text description
  const postDate = moment(post.datetime, "YYYYMMDD_HHmmss").fromNow();

  //TODO: Using Gesture Handling, add double-tap functionality
  const navigation = useNavigation();
  return (
    <View style={styles.post}>
      <Image style={styles.feedBubble} source={{ uri: post.postURL }}></Image>
      {user && (
        <View style={styles.postTitle}>
          <Pressable
            onPress={() =>
              user.userId === FIREBASE_AUTH.currentUser.uid
                ? navigation.navigate("Profile")
                : navigation.navigate("Bud", { userId: user.userId })
            }
          >
            <Image
              style={styles.profileImage}
              source={{ uri: user.profileImage }}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              user.userId === FIREBASE_AUTH.currentUser.uid
                ? navigation.navigate("Profile")
                : navigation.navigate("Bud", {
                    userId: user.userId,
                  })
            }
          >
            <Text style={styles.profileName}>{user.firstName}</Text>
          </Pressable>

          <Text>{postDate}</Text>
        </View>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width - 26;

const styles = StyleSheet.create({
  post: {
    paddingBottom: 32,
  },
  feedBubble: {
    width: screenWidth,
    maxWidth: 474,
    height: screenWidth,
    maxHeight: 474,
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

export { Post };
