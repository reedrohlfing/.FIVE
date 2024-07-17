import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  FIREBASE_AUTH,
  FIREBASE_DB,
  FIREBASE_STORAGE,
} from "../FirebaseConfig";
import BirthdayPicker from "../components/BirthdayPicker";
import { useProfileData } from "../ProfileContext";
import ProfileHeader from "../components/ProfileHeader";

const ProfileCreation = () => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [loading, setLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({
    firstName: false,
    lastName: false,
    title: false,
    location: false,
    birthday: false,
  });

  // Create a verification function to go through each user input before setting initialized to true
  const checkInputs = () => {
    let isValid = true;
    const newInvalidFields = {
      firstName: false,
      lastName: false,
      title: false,
      location: false,
      birthday: false,
    };

    if (profileData) {
      if (
        profileData.firstName == defaultData.firstName ||
        profileData.firstName == "" ||
        profileData.firstName == null
      ) {
        newInvalidFields.firstName = true;
        isValid = false;
      }
      if (profileData.lastName == "" || profileData.lastName == null) {
        newInvalidFields.lastName = true;
        isValid = false;
      }
      if (
        profileData.title === defaultData.title ||
        profileData.title === "" ||
        profileData.title == null
      ) {
        newInvalidFields.title = true;
        isValid = false;
      }
      if (
        profileData.location === defaultData.location ||
        profileData.location === "" ||
        profileData.location == null
      ) {
        newInvalidFields.location = true;
        isValid = false;
      }
      if (
        profileData.birthday === defaultData.birthday ||
        profileData.birthday === "" ||
        profileData.birthday == null
      ) {
        newInvalidFields.birthday = true;
        isValid = false;
      }
    }
    setInvalidFields(newInvalidFields);

    if (isValid) {
      setProfileData((prev) => ({ ...prev, initialized: true }));
      return true;
    } else {
      return false;
    }
  };

  const handleProfileCreation = () => {
    setLoading(true);

    try {
      if (checkInputs()) {
        updateProfile(profileData);
        updateProfile({ initialized: true });
      } else {
        console.log("Please fill out all fields in profile.");
        // TODO: Functionality if not all fields are completed
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error creating new profile!", error.message);
    }
  };

  const handleCancelProfile = async () => {
    setLoading(true);
    // Delete profile information from Firebase Database
    const docRef = doc(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser.uid);
    await deleteDoc(docRef);

    // Check to see if they uploaded a profile Image, and delete it
    const userId = FIREBASE_AUTH.currentUser.uid;
    const profileImageRef = ref(
      FIREBASE_STORAGE,
      `user/${userId}/profileImage`
    );
    if (profileImageRef) {
      deleteObject(profileImageRef);
    }

    // Log out of app
    FIREBASE_AUTH.signOut();
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, StyleSheet.absoluteFill]}>
      <Text style={styles.title}>Create Your Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00FFFF" />
      ) : (
        <View style={styles.container}>
          <ProfileHeader />
          <ScrollView
            style={styles.descriptorsContainer}
            vertical={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.descriptorsContainer}
          >
            <View style={styles.descriptorView}>
              <Text style={[styles.descriptor, styles.phoneDesc]}>
                Phone Number
              </Text>
              <TextInput
                style={[styles.input, styles.phoneNumber]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, phoneNumber: text }))
                }
                defaultValue={
                  FIREBASE_AUTH.currentUser
                    ? FIREBASE_AUTH.currentUser.phoneNumber
                    : ""
                }
                readOnly={true}
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  invalidFields.location && styles.invalidInput,
                ]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, firstName: text }))
                }
                placeholder="Add First Name"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  invalidFields.location && styles.invalidInput,
                ]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, lastName: text }))
                }
                placeholder="Add Last Name"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  invalidFields.location && styles.invalidInput,
                ]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, title: text }))
                }
                placeholder="Add Title"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Location</Text>
              <TextInput
                style={[
                  styles.input,
                  invalidFields.location && styles.invalidInput,
                ]}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, location: text }))
                }
                placeholder="Add Location"
              />
            </View>
            <View style={styles.descriptorView}>
              <Text style={styles.descriptor}>Birthday</Text>
              <BirthdayPicker updateProfile={updateProfile} initDate={""} />
            </View>

            <View style={styles.twoButtons}>
              <Pressable
                style={[styles.tab, styles.cancelButton]}
                onPress={handleCancelProfile}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.tab,
                  styles.submitButton,
                  pressed && { backgroundColor: "rgba(0, 155, 155, 1)" },
                ]}
                onPress={handleProfileCreation}
              >
                <Text style={styles.submitButtonText}>Done</Text>
              </Pressable>
            </View>
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
  descriptorsContainer: {
    flex: 1,
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
  invalidInput: {
    placeholderTextColor: "#4200FF",
  },
  phoneDesc: {
    color: "rgba(0,0,0,0.43)",
  },
  phoneNumber: {
    color: "rgba(0,0,0,0.43)",
  },
  tab: {
    paddingHorizontal: 16,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
  },
  submitButton: {
    backgroundColor: "#00FFFF",
    // marginHorizontal: "auto",
    // justifyContent: "center",
    // alignItems: "center",
    // width: "max-content",
  },
  submitButtonText: {
    color: "black",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#F6F6F6",
  },
  twoButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    paddingVertical: 48,
  },
});

export { ProfileCreation };
