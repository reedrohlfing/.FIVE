import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  and,
  limit,
  where,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_FUNCS } from "../FirebaseConfig";
import { useProfileData } from "../ProfileContext";
import { AddBud } from "./AddBud";
import { httpsCallable } from "firebase/functions";

const UserGrid = ({ navigation }) => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [circles, setCircles] = useState([]);
  const [recent, setRecent] = useState([]);

  // Get bud profile information for first 24 users in buds, not including self
  const postsColRef = collection(FIREBASE_DB, "users");

  const removeBudNotification = httpsCallable(
    FIREBASE_FUNCS,
    "removeBudNotification"
  );

  const handleDeleteBud = (budId) => {
    // Remove each other from bud lists
    const notification = {
      userId: profileData.userId,
      budId: budId,
    };
    removeBudNotification(notification).catch((error) => {
      console.log("Error: ", error);
    });
  };

  // Listen for when user adds new buds
  useEffect(() => {
    if (profileData.buds != defaultData.buds) {
      const buds = query(
        postsColRef,
        and(
          where("userId", "in", profileData.buds),
          where("userId", "!=", profileData.userId)
        ),
        limit(24)
      );
      const unsubscribe = onSnapshot(buds, (snapshot) => {
        const budData = snapshot.docs.map((bud) => bud.data());
        setCircles(budData);
      });
      return unsubscribe;
    }
  }, [profileData.buds]);

  // Listen for when another user adds me
  useEffect(() => {
    if (profileData.recentlyAdded && profileData.recentlyAdded.length > 0) {
      const recentQuery = query(
        postsColRef,
        where("userId", "in", profileData.recentlyAdded),
        limit(25)
      );

      const unsubscribe = onSnapshot(recentQuery, (snapshot) => {
        const recentData = snapshot.docs.map((r) => r.data());
        setRecent(recentData);
      });
      return unsubscribe;
    }
  }, [profileData.recentlyAdded]);

  const size = Dimensions.get("window").width / 2.4;
  return (
    <ScrollView
      vertical={true}
      showsVerticalScrollIndicator={false}
      style={styles.bubblesScroll}
      contentContainerStyle={styles.bubblesContainer}
    >
      {profileData.recentlyAdded.length > 0 ? (
        <View>
          <Text style={styles.recentHeader}>Recently Added</Text>
          <FlatList
            style={styles.notificationList}
            data={recent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.notification}
                onPress={() =>
                  navigation.navigate("Bud", { userId: item.userId })
                }
              >
                <Image
                  source={{ uri: item.profileImage }}
                  style={styles.profileImage}
                />
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <AddBud userId={item.userId} buttonStyle={styles.addButton} />
                <Pressable
                  style={styles.deleteBudPress}
                  onPress={() => handleDeleteBud(item.userId)}
                >
                  <Image
                    style={styles.deleteBudImg}
                    source={require("../assets/icons/close-inactive.png")}
                  />
                </Pressable>
              </Pressable>
            )}
          />
        </View>
      ) : (
        <View></View>
      )}
      {circles.length > 0 ? (
        <View>
          <Text style={styles.everyoneHeader}>Everyone</Text>
          <View style={styles.gridContainer}>
            {circles.map((circle, index) => (
              <Pressable
                key={index}
                style={styles.gridItem}
                onPress={() =>
                  navigation.navigate("Bud", { userId: circle.userId })
                }
              >
                <Image
                  source={{ uri: circle.profileImageLarge }}
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
        </View>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bubblesScroll: {
    backgroundColor: "white",
    paddingBottom: 80,
  },
  bubblesContainer: {
    paddingBottom: 10,
  },
  recentHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  everyoneHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
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
  notificationList: {
    marginTop: 6,
    paddingBottom: 80,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    marginRight: 16,
    backgroundColor: "#F6F6F6",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    height: 40,
    width: 40,
    marginLeft: "auto",
  },
  deleteBudPress: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    height: 40,
    width: 40,
    backgroundColor: "#F6F6F6",
    marginLeft: 10,
  },
  deleteBudImg: {
    height: 26,
    width: 26,
  },
});

export { UserGrid };
