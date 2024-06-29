import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import BirthdayPicker from "../components/BirthdayPicker";
import { useProfileData } from "./Profile";

// TODO: User img should be pulled after sign-in
const profileImgSrc = "../fake-cdn/users/18058079144/profile.jpg";

const Settings = () => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  // const ProfileLinks = () => {
  //   return profileData.links.map((link, index) => {
  //     return (
  //       <Pressable
  //         key={index}
  //         style={[styles.tab, styles.link]}
  //         onPress={() => Linking.openURL(link.url)}
  //       >
  //         <Text style={styles.link}>{link.title}</Text>
  //       </Pressable>
  //     );
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
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
        automaticallyAdjustContentInsets="never"
        automaticallyAdjustKeyboardInsets="never"
        contentInsetAdjustmentBehavior="never"
      >
        <View style={[styles.tab, styles.age]}>
          <Text style={styles.age}>{profileData.age}</Text>
        </View>
        <View style={[styles.tab, styles.work]}>
          <Text style={styles.work}>{profileData.title}</Text>
        </View>

        {/* <ProfileLinks /> */}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          vertical={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={styles.descriptorsContainer}
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
        >
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ firstName: text })}
              value={profileData.firstName}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ lastName: text })}
              value={profileData.lastName}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ title: text })}
              value={profileData.title}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Location</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ location: text })}
              value={profileData.location}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ phoneNumber: text })}
              value={profileData.phoneNumber}
              readOnly={true}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ email: text })}
              value={profileData.email}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Birthday</Text>
            <BirthdayPicker
              updateProfile={updateProfile}
              initDate={profileData.birthday}
            />
          </View>
          <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>School</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => updateProfile({ school: text })}
              value={profileData.school}
            />
          </View>
          {/* <View style={styles.descriptorView}>
            <Text style={styles.descriptor}>Links</Text>
            <TextInput style={styles.input}>{profileData.links}</TextInput>
          </View> */}
          <View style={styles.deleteLogout}>
            <Pressable
              style={[styles.tab, styles.logoutButton]}
              onPress={() => FIREBASE_AUTH.signOut()}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
            <Pressable style={[styles.tab, styles.deleteAccountButton]}>
              <Text style={styles.buttonText}>Delete Account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
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
  descriptorsContainer: {
    flex: 1,
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
  link: {
    fontSize: 16,
    color: "#4200FF",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
  descriptorView: {
    paddingHorizontal: 12,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
  },
  descriptor: {
    fontSize: 16,
    fontWeight: "bold",
    width: "35%",
    marginVertical: "auto",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    width: "65%",
    outlineWidth: 0,
    WebkitTapHighlightColor: "transparent",
    WebkitAppearance: "none",
    // ":focus": {
    //   outline: "none",
    // },
  },
  deleteLogout: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    marginVertical: 48,
  },
  logoutButton: {
    backgroundColor: "#F6F6F6",
  },
  deleteAccountButton: {
    backgroundColor: "#00FFFF",
  },
});

export { Settings };
