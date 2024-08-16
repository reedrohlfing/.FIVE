import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GridImageCircles } from "../components/GridImageCircles";
import { AddBud } from "../components/AddBud";
import { BackButton } from "../components/BackButton";
import { BurstButton } from "../components/BurstButton";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";
import { useEffect, useState } from "react";
import { useProfileData } from "../ProfileContext";

// TODO: On refresh, the top bar changes to a grey instead of white

const Bud = () => {
  const navigation = useNavigation();
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const route = useRoute();
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(FIREBASE_DB, "users", userId);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if the user has their profile image setup, if not, make it blank
        if (data.profileImage == defaultData.profileImage) {
          setUserData({ ...data, profileImage: "" });
        } else {
          setUserData(data);
        }
      } else {
        console.log(
          "Error: Could not load user profile information based off this userId: ",
          userId
        );
      }
      setLoading(false);
    });
  }, [userId]);

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00FFFF" />
    </View>
  ) : (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <View>
        <View style={styles.profileHeader}>
          <Image style={styles.profileImage} source={userData.profileImage} />
          <View style={styles.nameLocation}>
            <Text style={styles.name}>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text style={styles.location}>{userData.location}</Text>
          </View>
          <AddBud userId={userId} buttonStyle={styles.addButton} />
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.descriptionTab}
          contentContainerStyle={styles.descriptionTabContent}
        >
          <View style={[styles.tab, styles.ageContainer]}>
            <Text style={styles.age}>{userData.age}</Text>
          </View>
          <View style={[styles.tab, styles.workContainer]}>
            <Text style={styles.work}>{userData.title}</Text>
          </View>
          {userData.school && (
            <View style={[styles.tab, styles.schoolContainer]}>
              <Text style={styles.school}>{userData.school}</Text>
            </View>
          )}
          {userData.linkURL && (
            <Pressable
              style={[styles.tab, styles.linkContainer]}
              onPress={() => Linking.openURL(userData.linkURL)}
            >
              <Text style={styles.link}>{userData.linkTitle} ↗</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
      <GridImageCircles navigation={navigation} userId={userId} />
      <BackButton navigation={navigation} />
      <BurstButton budId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  addButton: {
    width: 56,
    height: 56,
  },
  profileHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingBottom: 10,
    paddingHorizontal: 13,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    margin: 1,
    backgroundColor: "#F6F6F6",
  },
  nameLocation: {
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  location: {
    fontSize: 16,
  },
  descriptionTab: {
    flexWrap: "nowrap",
    flexGrow: 0,
    flexShrink: 1,
    gap: 8,
    marginBottom: 10,
    minHeight: 34,
  },
  descriptionTabContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ageContainer: {
    backgroundColor: "black",
  },
  age: {
    fontSize: 16,
    color: "white",
    alignSelf: "center",
  },
  workContainer: {
    backgroundColor: "#F6F6F6",
  },
  work: {
    fontSize: 16,
    color: "black",
    alignSelf: "center",
  },
  schoolContainer: {
    backgroundColor: "#F6F6F6",
  },
  school: {
    fontSize: 16,
    color: "black",
    alignSelf: "center",
  },
  linkContainer: {
    backgroundColor: "#F6F6F6",
  },
  link: {
    fontSize: 16,
    color: "#4200FF",
    alignSelf: "center",
  },
});

export { Bud };
