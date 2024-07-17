import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Post } from "../components/Post";

// Create a feed from the images folder
// Probably a good idea to make this asynchronous so images are loaded and populated in order
const ImgFeed = () => {
  return (
    <View>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/francebeach.jpg")}
        time={"3 min ago"}
      ></Post>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/italyalley.jpg")}
        time={"7 min ago"}
      ></Post>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/oslexit.jpg")}
        time={"10 min ago"}
      ></Post>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/pinkpainting.jpg")}
        time={"30 min ago"}
      ></Post>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/redshow.jpg")}
        time={"41 min ago"}
      ></Post>
      <Post
        profileImage={require("../fake-cdn/images/dive.jpg")}
        user={"Reed"}
        source={require("../fake-cdn/images/skate.jpg")}
        time={"2 hours ago"}
      ></Post>
    </View>
  );
};

const Feed = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        vertical={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImgFeed style={styles.feed} />
      </ScrollView>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width - 26;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  feed: {
    width: "100%",
    marginHorizontal: 13,
  },
});

export { Feed };
