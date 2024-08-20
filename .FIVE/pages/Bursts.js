import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Bursts = () => {
  const currentUserId = FIREBASE_AUTH.currentUser.uid;
  const navigation = useNavigation();

  // Get the bursts collection node
  const burstsRef = collection(FIREBASE_DB, `users/${currentUserId}/bursts`);

  // State to store the burst notifications
  const [burstNotifications, setBurstNotifications] = useState([]);

  // State to store the users' profile information
  const [users, setUsers] = useState({});

  // Listen for new burst notifications
  useEffect(() => {
    if (burstsRef) {
      const unsubscribe = onSnapshot(burstsRef, (snapshot) => {
        const notifications = snapshot.docs.map((doc) => doc.data());
        setBurstNotifications(notifications);
      });
      return unsubscribe;
    }
  }, []);

  // Fetch users' profile information
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = {};
      for (const notification of burstNotifications) {
        const userId = notification.senderId;
        const docRef = doc(FIREBASE_DB, "users", userId);
        const docSnap = await getDoc(docRef);
        usersData[userId] = docSnap.data();
      }
      setUsers(usersData);
    };
    if (burstNotifications) {
      fetchUsers();
    }
  }, [burstNotifications]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bursts</Text>
      {burstNotifications.length > 0 ? (
        <FlatList
          style={styles.notificationList}
          data={burstNotifications}
          renderItem={({ item }) => (
            <Pressable style={styles.notification}>
              <Pressable
                onPress={() =>
                  navigation.navigate("Bud", { userId: item.senderId })
                }
              >
                {users[item.senderId] && (
                  <Image
                    source={{ uri: users[item.senderId].profileImage }}
                    style={styles.profileImage}
                  />
                )}
              </Pressable>
              {users[item.senderId] && (
                <Text style={styles.name}>
                  {users[item.senderId].firstName}{" "}
                  {users[item.senderId].lastName}
                </Text>
              )}
              <View style={styles.fwdButton}>
                <Image
                  style={styles.fwdButtonImg}
                  source={require("../assets/icons/forward-inactive.png")}
                />
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.noNotificationsFrame}>
          <View style={styles.noNotifications}>
            <Text style={styles.noNotificationsHeader}>
              No burst notifications yet
            </Text>
            <View style={styles.burstDescView}>
              <View style={styles.burstButton}>
                <Image
                  style={styles.burstButtonImg}
                  source={require("../assets/icons/burst2-black-inactive.png")}
                />
              </View>
              <Text style={styles.noNotificationsText}>
                To burst someone, go to their profile and click the burst button
                in the lower right-hand corner.
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
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
  fwdButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 40,
    width: 40,
    marginLeft: "auto",
  },
  fwdButtonImg: {
    height: 24,
    width: 24,
  },
  noNotificationsFrame: {
    marginVertical: 20,
    paddingVertical: 50,
    height: "75%",
    width: "80%",
    alignSelf: "center",
  },
  noNotifications: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  burstDescView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  noNotificationsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "top",
    marginBottom: 16,
  },
  noNotificationsText: {
    fontSize: 16,
    justifyContent: "center",
  },
  burstButton: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  burstButtonImg: {
    height: 34,
    width: 34,
  },
});

export { Bursts };
