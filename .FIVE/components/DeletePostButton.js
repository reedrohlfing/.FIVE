import { StyleSheet, Image, Pressable, View, Text } from "react-native";
import { FIREBASE_STORAGE, FIREBASE_DB } from "../FirebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig";

const DeletePostButton = ({ userId, postId }) => {
  const navigation = useNavigation();
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const authUser = FIREBASE_AUTH.currentUser;
    if (authUser && authUser.uid === userId) {
      setIsAuthenticatedUser(true);
    }
  }, [userId]);

  // Only display the delete button if userId from the post matches authenticated user
  if (!isAuthenticatedUser) return null;

  const handleDelete = async () => {
    try {
      // Delete original post from storage
      const postRef = ref(FIREBASE_STORAGE, `user/${userId}/posts/${postId}`);
      deleteObject(postRef)
        .then(console.log(postId, " original deleted successfully."))
        .catch((error) => {
          console.error("Error deleting original post:", error);
        });

      // Delete compressed posts from storage
      const postRef150 = ref(
        FIREBASE_STORAGE,
        `user/${userId}/posts/${postId}_150x150`
      );
      deleteObject(postRef150)
        .then(console.log(postId, "_150x150 deleted successfully."))
        .catch((error) => {
          console.error("Error deleting 150 compressed post:", error);
        });
      const postRef720 = ref(
        FIREBASE_STORAGE,
        `user/${userId}/posts/${postId}_720x720`
      );
      deleteObject(postRef720)
        .then(console.log(postId, "_720x720 deleted successfully."))
        .catch((error) => {
          console.error("Error deleting 720 compressed post:", error);
        });

      // Delete posts from Firebase Database
      const docLocation = "posts/" + userId + "_" + postId;
      const postDoc = doc(FIREBASE_DB, docLocation);
      deleteDoc(postDoc)
        .then(console.log(postId, " doc deleted successfully."))
        .catch((error) => {
          console.error("Error deleting post doc:", error);
        });

      // Go back to profile page
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  return pressed ? (
    <View style={styles.youSureContainer}>
      <Pressable style={styles.cancelButton} onPress={() => setPressed(false)}>
        <Image
          style={styles.buttonImg}
          source={require("../assets/icons/close-inactive.png")}
        />
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Image
          style={styles.buttonImg}
          source={require("../assets/icons/delete-active.png")}
        />
      </Pressable>
      <Text style={styles.youSureText}>Are you sure?</Text>
    </View>
  ) : (
    <Pressable style={styles.deleteButton} onPress={() => setPressed(true)}>
      <Image
        style={styles.buttonImg}
        source={require("../assets/icons/delete-inactive.png")}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  cancelButton: {
    position: "absolute",
    bottom: 66,
    right: 0,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  buttonImg: {
    height: 34,
    width: 34,
  },
  youSureContainer: {
    position: "static",
  },
  youSureText: {
    position: "absolute",
    bottom: 12,
    right: 66,
    width: "fit-content",
    backgroundColor: "#F6F6F6",
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export { DeletePostButton };
