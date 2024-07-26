import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import moment from "moment";
import { useProfileData } from "../ProfileContext";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {
  FIREBASE_STORAGE,
  FIREBASE_DB,
  FIREBASE_AUTH,
} from "../FirebaseConfig";

const Capture = () => {
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const [loadingImage, setLoadingImage] = useState(false);
  const [postLoaded, setPostLoaded] = useState(false);
  const [pressed, setPressed] = useState(false);
  const navigation = useNavigation();

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
      const userID = FIREBASE_AUTH.currentUser.uid;
      const dateNow = moment().format("YYYYMMDD_HHmmss");
      const uploadFilename = `user/${userID}/posts/${dateNow}`;
      const postRef = ref(FIREBASE_STORAGE, uploadFilename);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      uploadBytes(postRef, blob, {
        metadata: {
          customMetadata: {
            author_uid: userID,
          },
        },
      })
        .then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
          await updateProfile({
            tempUploadURL: downloadURL,
            tempUploadTitle: dateNow,
          });
          setLoadingImage(false);
        })
        .then(() => {
          setPostLoaded(true);
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
          setLoadingImage(false);
        });
    }
  };

  const handleCancelPost = () => {
    setPostLoaded(false);
    // Remove the post from Storage
    const postRef = ref(FIREBASE_STORAGE, profileData.tempUploadTitle);
    deleteObject(postRef);
  };

  const handlePost = () => {
    // TODO: Create some animation for when a user posts photo
    setPostLoaded(false);

    // Add post to post pool
    const userID = FIREBASE_AUTH.currentUser.uid;
    const postData = {
      userId: userID,
      postURL: profileData.tempUploadURL,
      datetime: profileData.tempUploadTitle,
    };
    let docName = userID + "_" + profileData.tempUploadTitle;
    let postPoolRef = doc(FIREBASE_DB, "posts", docName);
    setDoc(postPoolRef, postData);

    // Finally navigate to Feed tab once posting is complete
    navigation.navigate("Feed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {loadingImage ? (
        <ActivityIndicator
          style={styles.uploadButton}
          size="large"
          color="white"
        />
      ) : (
        <View>
          {postLoaded ? (
            <View>
              <Image source={profileData.tempUploadURL} style={styles.post} />
              <View style={styles.twoButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={handleCancelPost}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.postButton} onPress={handlePost}>
                  <Text style={styles.buttonText}>Post</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={[
                styles.uploadButton,
                pressed && styles.uploadButtonPressed,
              ]}
              onPress={handleImagePicker}
              pressed={pressed}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
            >
              <Text
                style={[
                  styles.uploadButtonText,
                  pressed && styles.uploadButtonTextPressed,
                ]}
              >
                Capture Bubble
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width - 26;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  uploadButton: {
    borderRadius: "50%",
    alignSelf: "center",
    justifyContent: "center",
    height: screenWidth,
    maxHeight: 474,
    width: screenWidth,
    maxWidth: 474,
    backgroundColor: "#00FFFF",
  },
  uploadButtonPressed: {
    backgroundColor: "black",
  },
  uploadButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    color: "black",
  },
  uploadButtonTextPressed: {
    color: "white",
  },
  post: {
    borderRadius: "50%",
    alignSelf: "center",
    justifyContent: "center",
    height: screenWidth,
    maxHeight: 474,
    width: screenWidth,
    maxWidth: 474,
  },
  twoButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    paddingVertical: 48,
  },
  cancelButton: {
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
  },
  postButton: {
    backgroundColor: "#00FFFF",
    paddingHorizontal: 16,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export { Capture };
