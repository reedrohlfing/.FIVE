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
      onSnapshot(burstsRef, (snapshot) => {
        const notifications = snapshot.docs.map((doc) => doc.data());
        setBurstNotifications(notifications);
      });
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
      <FlatList
        style={styles.notificationList}
        data={burstNotifications}
        renderItem={({ item }) => (
          <Pressable
            style={styles.notification}
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
            <View>
              {users[item.senderId] && (
                <Text style={styles.name}>
                  {users[item.senderId].firstName}{" "}
                  {users[item.senderId].lastName}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
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
});

export { Bursts };
