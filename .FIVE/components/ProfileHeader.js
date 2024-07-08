import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useProfileData } from "../ProfileContext";

// TODO: User should be pulled after sign-in
const profileImgSrc = "../fake-cdn/users/18058079144/profile.jpg";

export default function ProfileHeader() {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();

  return (
    <div>
      <View style={styles.profileHeader}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image style={styles.profileImage} source={require(profileImgSrc)} />
          <View style={styles.nameLocation}>
            <Text style={styles.name}>
              {profileData.firstName} {profileData.lastName}
            </Text>
            <Text style={styles.location}>{profileData.location}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.descriptionTab}
        contentContainerStyle={styles.descriptionTabContent}
      >
        <View style={[styles.tab, styles.age]}>
          <Text style={styles.age}>{profileData.age}</Text>
        </View>
        <View style={[styles.tab, styles.work]}>
          <Text style={styles.work}>{profileData.title}</Text>
        </View>
        {profileData.school && profileData.school !== defaultData.school && (
          <View style={[styles.tab, styles.school]}>
            <Text style={styles.school}>{profileData.school}</Text>
          </View>
        )}

        {profileData.linkURL && profileData.linkURL !== defaultData.linkURL && (
          <Pressable
            style={[styles.tab, styles.link]}
            onPress={() => Linking.openURL(profileData.linkURL)}
          >
            <Text style={styles.link}>{profileData.linkTitle} ↗</Text>
          </Pressable>
        )}
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
  age: {
    fontSize: 16,
    color: "white",
    backgroundColor: "black",
    alignSelf: "center",
  },
  work: {
    fontSize: 16,
    color: "black",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
  school: {
    fontSize: 16,
    color: "black",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
  link: {
    fontSize: 16,
    color: "#4200FF",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
});
