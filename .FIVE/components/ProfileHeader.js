import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// TODO: User should be pulled after sign-in
import ProfileData from "../fake-cdn/users/18058079144/profile.json";
const profileImgSrc = "../fake-cdn/users/18058079144/profile.jpg";
const profile = ProfileData;

export default function ProfileHeader() {
  const navigation = useNavigation();
  const ProfileLinks = () => {
    return profile.links.map((link, index) => {
      return (
        <Pressable
          key={index}
          style={[styles.tab, styles.link]}
          onPress={() => Linking.openURL(link.url)}
        >
          <Text style={styles.link}>{link.title}</Text>
        </Pressable>
      );
    });
  };

  return (
    <div>
      <View style={styles.profileHeader}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image style={styles.profileImage} source={require(profileImgSrc)} />
          <View style={styles.nameLocation}>
            <Text style={styles.name}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        </View>
        <Pressable
          style={{ alignSelf: "center", marginStart: "auto" }}
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            style={[styles.button]}
            source={require("../assets/icons/settings-black-inactive.png")}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.descriptionTab}
        contentContainerStyle={styles.descriptionTabContent}
      >
        <View style={[styles.tab, styles.age]}>
          <Text style={styles.age}>{profile.age}</Text>
        </View>
        <View style={[styles.tab, styles.work]}>
          <Text style={styles.work}>{profile.title}</Text>
        </View>

        <ProfileLinks />
      </ScrollView>
    </div>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 40,
  },
  nameLocation: {
    paddingLeft: 20,
    alignSelf: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
  },
  button: {
    width: 33,
    height: 33,
  },
  descriptionTab: {
    flexWrap: "nowrap",
    gap: 8,
    marginBottom: 10,
    flexGrow: 0,
    flexShrink: 1,
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
  age: {
    fontSize: 14,
    color: "white",
    backgroundColor: "black",
    alignSelf: "center",
  },
  work: {
    fontSize: 14,
    color: "black",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
  link: {
    fontSize: 14,
    color: "#4200FF",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
});
