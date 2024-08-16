import { StyleSheet, Pressable, ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Post } from "../components/Post";
import { BackButton } from "../components/BackButton";
import { useState, useEffect } from "react";
import { FIREBASE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// TODO: Create commenting functionality, so users can comment on buds pictures, but their only viewable by the user their commenting on
//       This also allows users to see what posts theyve already interacted with

const PostModal = ({ route }) => {
  const navigation = useNavigation();
  const post_datetime = route.params.post;
  const userId = route.params.userId;
  const postId = userId + "_" + post_datetime;
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(FIREBASE_DB, "posts", postId);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setPostData(docSnap.data());
      } else {
        console.log(
          "Error: Could not load post information based off this postId: ",
          postId
        );
      }
      setLoading(false);
    });
  }, [postId]);

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00FFFF" />
    </View>
  ) : (
    <Pressable style={styles.post} onPress={() => navigation.goBack()}>
      <Pressable onPress={() => {}}>
        <Post post={postData} />
      </Pressable>
      <BackButton navigation={navigation} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  post: {
    paddingBottom: 32,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
});

export { PostModal };
