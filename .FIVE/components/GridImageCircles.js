import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";

const GridImageCircles = ({ navigation, userId }) => {
  const [circles, setCircles] = useState([]);

  const postsColRef = collection(FIREBASE_DB, "posts");
  const ordered = query(
    postsColRef,
    where("userId", "==", userId),
    orderBy("datetime", "desc"),
    limit(24)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(ordered, (snapshot) => {
      const postData = snapshot.docs.map((post) => post.data());
      setCircles(postData);
    });
    return unsubscribe;
  }, []);

  const size = Dimensions.get("window").width / 2.4;
  return (
    <ScrollView
      vertical={true}
      showsVerticalScrollIndicator={false}
      style={styles.bubblesScroll}
      contentContainerStyle={styles.bubblesContainer}
    >
      <View style={styles.gridContainer}>
        {circles.map((circle, index) => (
          <Pressable
            key={index}
            style={styles.gridItem}
            onPress={() =>
              navigation.navigate("PostModal", {
                userId,
                post: circle.datetime,
              })
            }
          >
            <Image
              source={{ uri: circle.postURL }}
              style={{
                width: size,
                maxWidth: 198,
                height: size,
                maxHeight: 198,
                borderRadius: size / 2,
                backgroundColor: "#F6F6F6",
              }}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bubblesScroll: {
    backgroundColor: "white",
    paddingBottom: 80,
  },
  bubblesContainer: {
    paddingVertical: 4,
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

export { GridImageCircles };
