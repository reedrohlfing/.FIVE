import {
  StyleSheet,
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
            <Text
              style={{ textAlign: "center", alignContent: "center", flex: 1 }}
            >
              No posts available :(
            </Text>
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
  },
  feed: {
    width: "100%",
    marginHorizontal: 13,
  },
});

export { Feed };
