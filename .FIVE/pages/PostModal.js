import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Post } from "../components/Post";

const PostModal = ({ route }) => {
  const navigation = useNavigation();
  const post = route.params.post;

  return (
    <Pressable style={styles.post} onPress={() => navigation.goBack()}>
      <Pressable onPress={() => {}}>
        <Post post={post} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  post: {
    paddingBottom: 32,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
});

export { PostModal };
