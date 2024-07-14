import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useProfileData } from "../ProfileContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_STORAGE, FIREBASE_DB } from "../FirebaseConfig";

export default function ProfileHeader() {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [loadingImage, setLoadingImage] = useState(false);

  const handleImagePicker = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      setLoadingImage(true);
      const imageUri = result.assets[0].uri;
      const userID = getAuth().currentUser.uid;
      const storageRef = ref(FIREBASE_STORAGE, `user/${userID}/profileImage`);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      // TODO: Add a loader while image uploads
      uploadBytes(storageRef, blob, {
        metadata: {
          customMetadata: {
            author_uid: userID,
          },
        },
      })
        .then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
          await updateDoc(doc(FIREBASE_DB, "users", userID), {
            profileImage: downloadURL,
          });
          setProfileData({ ...profileData, profileImage: downloadURL });
          updateProfile({ profileImage: downloadURL });
        })
        .then(() => {
          setLoadingImage(false);
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
          setLoadingImage(false);
        });
    }
  };

  return (
    <div>
      <View style={styles.profileHeader}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Pressable onPress={handleImagePicker}>
            {loadingImage ? (
              <ActivityIndicator
                style={styles.profileImage}
                size="large"
                color="#00FFFF"
              />
            ) : (
              <Image
                style={styles.profileImage}
                source={profileData.profileImage}
              />
            )}
          </Pressable>

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
          <View style={[styles.tab, styles.schoolContainer]}>
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
    margin: 1,
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
  schoolContainer: {
    backgroundColor: "#F6F6F6",
  },
  school: {
    fontSize: 16,
    color: "black",
    alignSelf: "center",
  },
  link: {
    fontSize: 16,
    color: "#4200FF",
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
  },
});
