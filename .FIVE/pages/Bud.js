import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GridImageCircles } from "../components/GridImageCircles";
import { AddBud } from "../components/AddBud";

const Bud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;
  let profileData = user;

  return (
    <SafeAreaView style={[styles.container, StyleSheet.absoluteFill]}>
      <View>
        <View style={styles.profileHeader}>
          <Image
            style={styles.profileImage}
            source={profileData.profileImage}
          />
          <View style={styles.nameLocation}>
            <Text style={styles.name}>
              {profileData.firstName} {profileData.lastName}
            </Text>
            <Text style={styles.location}>{profileData.location}</Text>
          </View>
          <AddBud userId={user.userId} buttonStyle={styles.button} />
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.descriptionTab}
          contentContainerStyle={styles.descriptionTabContent}
        >
          <View style={[styles.tab, styles.ageContainer]}>
            <Text style={styles.age}>{profileData.age}</Text>
          </View>
          <View style={[styles.tab, styles.workContainer]}>
            <Text style={styles.work}>{profileData.title}</Text>
          </View>
          {profileData.school && (
            <View style={[styles.tab, styles.schoolContainer]}>
              <Text style={styles.school}>{profileData.school}</Text>
            </View>
          )}
          {profileData.linkURL && (
            <Pressable
              style={[styles.tab, styles.linkContainer]}
              onPress={() => Linking.openURL(profileData.linkURL)}
            >
              <Text style={styles.link}>{profileData.linkTitle} ↗</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
      <GridImageCircles navigation={navigation} userId={user.userId} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    width: 56,
    height: 56,
    margin: 1,
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
  },
  nameLocation: {
    paddingHorizontal: 20,
    flex: 1,
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
