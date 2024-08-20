import {
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Post } from "../components/Post";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useProfileData } from "../ProfileContext";

const ImgFeed = () => {
  // Function to create a list of Image posts
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [feedList, setFeedList] = useState(null);
  const postsColRef = collection(FIREBASE_DB, "posts");
  const ordered = query(
    postsColRef,
    where("userId", "in", profileData.buds),
    orderBy("datetime", "desc"),
    limit(25)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(ordered, (snapshot) => {
      const postData = snapshot.docs.map((post) => post.data());
      setFeedList(postData);
    });
    return unsubscribe;
  }, [profileData.buds]);

  return (
    <View>
      {feedList &&
        feedList.map((post, index) => <Post key={index} post={post} />)}
    </View>
  );
};

const Feed = () => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [postsAvail, setPostsAvail] = useState(false);
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();

  // Check to see if posts are available for display, otherwise show "No Posts Available :("
  useEffect(() => {
    const postsColRef = collection(FIREBASE_DB, "posts");
    const ordered = query(
      postsColRef,
      where("userId", "in", profileData.buds),
      orderBy("datetime", "desc"),
      limit(25)
    );

    const unsubscribe = onSnapshot(ordered, (snapshot) => {
      setPostsAvail(snapshot.size > 0);
      setLoadingImage(false);
    });

    return unsubscribe;
  }, [profileData.buds]);

  return (
    <SafeAreaView style={styles.container}>
      {loadingImage ? (
        <ActivityIndicator
          size="large"
          color="#00FFFF"
          style={{ textAlign: "center", alignContent: "center", flex: 1 }}
        />
      ) : (
        <ScrollView
          vertical={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {postsAvail ? (
            <ImgFeed style={styles.feed} />
          ) : (
            <View style={styles.noPostsFrame}>
              <View style={styles.noPosts}>
                <Text style={styles.noPostsHeader}>No posts yet</Text>
                <View style={styles.postDescView}>
                  <Image
                    style={styles.addButtonImg}
                    source={require("../assets/icons/add-dblue.png")}
                  />
                  <Text style={styles.noPostsText}>
                    To see posts, add a few friends by searching for their
                    profile and clicking the add button in the upper right-hand
                    corner.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  feed: {
    width: "100%",
    marginHorizontal: 13,
  },
  noPostsFrame: {
    marginVertical: 20,
    paddingVertical: 50,
    height: "75%",
    width: "80%",
    alignSelf: "center",
  },
  noPosts: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  postDescView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  noPostsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "top",
    marginBottom: 16,
  },
  noPostsText: {
    fontSize: 16,
    justifyContent: "center",
  },
  addButtonImg: {
    height: 56,
    width: 56,
    margin: 10,
  },
});

export { Feed };
