import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

const Post = ({ profileImage, user, source, time }) => {
  return (
    <View style={styles.post}>
      <Image style={styles.feedBubble} source={source}></Image>
      <View style={styles.postTitle}>
        <Image style={styles.profileImage} source={profileImage} />
        <Text style={styles.profileName}>{user}</Text>
        <Text>{time}</Text>
      </View>
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

export { Post };
