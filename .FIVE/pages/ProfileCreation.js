import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import BirthdayPicker from "../components/BirthdayPicker";
import { useProfileData } from "./Profile";

const ProfileCreation = () => {
  const profileImgSrc = "../fake-cdn/users/18058079144/profile.jpg"; // This needs to be changed to a default pic
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [loading, setLoading] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(true);

  // Create a verification function to go through each user input before setting initialized to true
  const checkInputs = () => {
    if (
      (profileData.firstName == defaultData.firstName) |
      (profileData.firstName == "") |
      (profileData.firstName == null)
    ) {
      // Change the placeholder text to colored
      setProfileCompleted(false);
    }
    if (profileData.lastName == null) {
      // Change the placeholder text to colored
      setProfileCompleted(false);
    }
    if (
      (profileData.title == defaultData.title) |
      (profileData.title == "") |
      (profileData.title == null)
    ) {
      // Change the placeholder text to colored
      setProfileCompleted(false);
    }
    if (
      (profileData.location == defaultData.location) |
      (profileData.location == "") |
      (profileData.location == null)
    ) {
      // Change the placeholder text to colored
      setProfileCompleted(false);
    }
    if (
      (profileData.birthday == defaultData.birthday) |
      (profileData.birthday == "") |
      (profileData.birthday == null)
    ) {
      // Change the placeholder text to colored
      setProfileCompleted(false);
    }
    if (profileCompleted) {
      setProfileData((prev) => ({ ...prev, initialized: true }));
      return true;
    } else {
      return false;
    }
  };

  const handleProfileCreation = async () => {
    setLoading(true);

    try {
      if (checkInputs()) {
        updateProfile(profileData);
        updateProfile({ initialized: true });
      } else {
        console.log("Please fill out all fields in profile.");
        // TODO: Functionality if not all fields are completed
      }
    } catch (error) {
      Alert.alert("Error creating new profile!", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, StyleSheet.absoluteFill]}>
      <Text style={styles.title}>Create Your Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00FFFF" />
      ) : (
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Image
                style={styles.profileImage}
                source={require(profileImgSrc)}
              />
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
            {/* <ProfileLinks /> */}
          </ScrollView>

          <ScrollView
            style={styles.descriptorsContainer}
            vertical={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.descriptorsContainer}
          >
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>First Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, firstName: text }))
                }
                placeholder="Add First Name"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Last Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, lastName: text }))
                }
                placeholder="Add Last Name"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Title</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, title: text }))
                }
                placeholder="Add Title"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Location</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, location: text }))
                }
                placeholder="Add Location"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Phone Number</Text>
              <TextInput
                style={[styles.input, styles.phoneNumber]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, phoneNumber: text }))
                }
                defaultValue={FIREBASE_AUTH.currentUser.phoneNumber}
                readOnly={true}
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Birthday</Text>
              <BirthdayPicker updateProfile={updateProfile} initDate={""} />
            </View>
            {/* <View style={styles.descriptorView}>
                            <Text style={styles.descriptor}>Links</Text>
                            <TextInput style={styles.input}>{profileData.links}</TextInput>
                        </View> */}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && { backgroundColor: "rgba(0, 155, 155, 1)" },
              ]}
              onPress={handleProfileCreation}
            >
              <Text style={styles.submitButtonText}>Done</Text>
            </Pressable>
          </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "black",
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
    placeholderTextColor: "rgba(0,0,0,0.43)",
    backgroundColor: "white",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 48,
    width: "65%",
    outlineWidth: 0,
    WebkitTapHighlightColor: "transparent",
    WebkitAppearance: "none",
    // ":focus": {
    //   outline: "none",
    // },
  },
  phoneNumber: {
    color: "rgba(0,0,0,0.43)",
  },
  submitButton: {
    backgroundColor: "#00FFFF",
    borderRadius: 20,
    marginVertical: 40,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
    width: "max-content",
  },
  submitButtonText: {
    color: "black",
    textAlign: "center",
  },
});

export { ProfileCreation };
