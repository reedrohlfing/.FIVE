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

const Settings = () => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const confirmDeleteAccount = () => {
    setShowConfirmDelete(true);
  };

  const cancelDeleteAccount = () => {
    setShowConfirmDelete(false);
  };

  const deleteAccount = async () => {
    try {
      const userId = profileData.userId;

      // Delete photos from Firebase Storage
      const profileImageRef = ref(
        FIREBASE_STORAGE,
        `user/${userId}/profileImage`
      );
      getDownloadURL(profileImageRef)
        .then(() => {
          // File exists, delete it
          deleteObject(profileImageRef);
        })
        .catch((error) => {
          // File doesn't exist, handle the error or do nothing
          if (error.code === "storage/object-not-found") {
            // File doesn't exist, do nothing
            console.log("No profile image when deleting account.");
          }
        });
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

      // Delete profile information from Firebase Database
      const docRef = doc(FIREBASE_DB, "users", userId);
      await deleteDoc(docRef);

      // Delete user account
      // await user.delete();

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
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
