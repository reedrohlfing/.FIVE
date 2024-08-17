import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import {
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
  FIREBASE_DB,
  FIREBASE_FUNCS,
} from "../FirebaseConfig";
import { ref, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import BirthdayPicker from "../components/BirthdayPicker";
import { useProfileData } from "../ProfileContext";
import ProfileHeader from "../components/ProfileHeader";
import { useState } from "react";
import { BackButton } from "../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { httpsCallable } from "firebase/functions";
import { ShareButton } from "../components/ShareButton";

const Settings = () => {
  const navigation = useNavigation();
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const userId = profileData.userId;
  const shareLink = `https://dotfive-df9ca.web.app/${userId}`;
  const shareTitle = profileData.firstName + " " + profileData.lastName;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const confirmDeleteAccount = () => {
    setShowConfirmDelete(true);
  };

  const cancelDeleteAccount = () => {
    setShowConfirmDelete(false);
  };

  const deleteAccount = async () => {
    try {
      // Delete all profile images for user
      const profileImgRef = ref(FIREBASE_STORAGE, `user/${userId}`);
      const profileImgs = await listAll(profileImgRef);
      const profileRefs = profileImgs.items;

      Promise.all(profileRefs.map((imageRef) => deleteObject(imageRef))).catch(
        (error) => {
          console.error("Error deleting profile images:", error);
        }
      );

      // Delete all posts for user
      const postsImgRef = ref(FIREBASE_STORAGE, `user/${userId}/posts`);
      const posts = await listAll(postsImgRef);
      const imageRefs = posts.items;

      Promise.all(imageRefs.map((imageRef) => deleteObject(imageRef))).catch(
        (error) => {
          console.error("Error deleting image posts folder:", error);
        }
      );

      // Delete posts from Firebase Database
      const postsRef = collection(FIREBASE_DB, "posts");
      const postQuery = query(postsRef, where("userId", "==", userId));
      getDocs(postQuery)
        .then((snapshot) => {
          if (snapshot.size > 0) {
            // If posts exist, delete them
            Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)))
              .then(() => {
                console.log("Posts deleted successfully");
              })
              .catch((error) => {
                console.error("Error deleting posts:", error);
              });
          } else {
            // No posts exist, do nothing
            console.log("No posts to delete.");
          }
        })
        .catch((error) => {
          console.error("Error checking for posts:", error);
        });

      // Delete the bursts collection if it exists
      const burstsRef = collection(FIREBASE_DB, "users", userId, "bursts");
      if (burstsRef) {
        var deleteFn = httpsCallable(FIREBASE_FUNCS, "recursiveDelete");
        deleteFn({ path: "users/" + userId + "/bursts" })
          .then(function (result) {
            console.log("Delete success: " + JSON.stringify(result));
          })
          .catch(function (err) {
            console.log("Delete failed, see console,");
            console.warn(err);
          });
      } else {
        console.log("User bursts collection does not exist or is empty");
      }

      // Delete profile information from Firebase Database
      const docRef = doc(FIREBASE_DB, "users", userId);
      await deleteDoc(docRef);

      // Sign Out
      await FIREBASE_AUTH.signOut();

      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
    <SafeAreaView style={[styles.container, StyleSheet.absoluteFill]}>
      <ProfileHeader />
      <ShareButton shareLink={shareLink} shareTitle={shareTitle} />
      <ScrollView
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
            onChangeText={(text) => updateProfile({ phoneNumber: text })}
            value={profileData.phoneNumber}
            readOnly={true}
          />
        </View>
        <View style={styles.descriptorView}>
          <Text style={styles.descriptor}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              updateProfile({
                firstName: text,
                firstNameLower: text.toLowerCase(),
                fullNameLower:
                  text.toLowerCase() + " " + profileData.lastNameLower,
              })
            }
            value={profileData.firstName}
          />
        </View>
        <View style={styles.descriptorView}>
          <Text style={styles.descriptor}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              updateProfile({
                lastName: text,
                lastNameLower: text.toLowerCase(),
                fullNameLower:
                  profileData.firstNameLower + " " + text.toLowerCase(),
              })
            }
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
          <Text style={styles.descriptor}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProfile({ email: text })}
            value={profileData.email}
            placeholder="+ Add Email"
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
            placeholder="+ Add School"
          />
        </View>
        <View style={styles.descriptorView}>
          <Text style={styles.descriptor}>Link</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProfile({ linkTitle: text })}
            value={profileData.linkTitle}
            placeholder="+ Add Link Title"
          />
        </View>
        <View style={styles.descriptorView}>
          <Text style={styles.descriptor}></Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProfile({ linkURL: text })}
            value={profileData.linkURL}
            placeholder="+ Add Link URL"
          />
        </View>
        {showConfirmDelete ? (
          <View>
            <Text style={[styles.confirmMessageTitle]}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={[styles.confirmMessage]}>
              This action is permanent and will delete all account information,
              including photos.
            </Text>
            <View style={styles.twoButtons}>
              <Pressable
                style={[styles.tab, styles.deleteAccountButton]}
                onPress={deleteAccount}
              >
                <Text style={styles.buttonText}>Confirm Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.tab, styles.cancelButton]}
                onPress={cancelDeleteAccount}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.twoButtons}>
            <Pressable
              style={[styles.tab, styles.logoutButton]}
              onPress={() => FIREBASE_AUTH.signOut()}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, styles.deleteAccountButton]}
              onPress={() => confirmDeleteAccount()}
            >
              <Text style={styles.buttonText}>Delete Account</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <BackButton navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //paddingTop: 10,
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
    width: "65%",
    outlineWidth: 0,
    WebkitTapHighlightColor: "transparent",
    WebkitAppearance: "none",
    // ":focus": {
    //   outline: "none",
    // },
  },
  phoneDesc: {
    color: "rgba(0,0,0,0.43)",
  },
  phoneNumber: {
    color: "rgba(0,0,0,0.43)",
  },
  twoButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    paddingVertical: 48,
  },
  logoutButton: {
    backgroundColor: "#F6F6F6",
  },
  deleteAccountButton: {
    backgroundColor: "#00FFFF",
  },
  cancelButton: {
    backgroundColor: "#F6F6F6",
  },
  confirmMessageTitle: {
    paddingTop: 48,
    paddingHorizontal: 48,
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmMessage: {
    paddingHorizontal: 48,
    textAlign: "center",
  },
  tab: {
    paddingHorizontal: 16,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export { Settings };
