import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Dimensions,
  Text,
} from "react-native";
import { useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  and,
  limit,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useProfileData } from "../ProfileContext";

const UserGrid = ({ navigation }) => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [circles, setCircles] = useState([]);

  const postsColRef = collection(FIREBASE_DB, "users");
  const buds = query(
    postsColRef,
    and(
      where("userId", "in", profileData.buds),
      where("userId", "!=", profileData.userId)
    ),
    limit(24)
  );
  onSnapshot(buds, (snapshot) => {
    const budData = snapshot.docs.map((bud) => bud.data());
    setCircles(budData);
  });

  const handleBubblePress = (user) => {
    navigation.navigate("Bud", { userId: user.userId });
  };

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
            onPress={() => handleBubblePress(circle)}
          >
            <Image
              source={{ uri: circle.profileImage }}
              style={{
                width: size,
                maxWidth: 198,
                height: size,
                maxHeight: 198,
                borderRadius: size / 2,
                backgroundColor: "#F6F6F6",
              }}
            />
            <Text style={styles.nameText}>{circle.firstName}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bubblesScroll: {
    backgroundColor: "white",
  },
  bubblesContainer: {
    paddingBottom: 10,
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
    display: "flex",
    flexDirection: "column",
  },
  nameText: {
    fontWeight: "bold",
    paddingTop: 4,
  },
});

export { UserGrid };
