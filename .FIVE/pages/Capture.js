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
import { Bubble } from "../components/Bubble";
import zIndex from "@mui/material/styles/zIndex";

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
      const dateNow = moment.utc().format("YYYYMMDD_HHmmss");
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
    const userID = FIREBASE_AUTH.currentUser.uid;

    // Remove the post from Storage
    const postRef = ref(
      FIREBASE_STORAGE,
      "user/" + userID + "/posts/" + profileData.tempUploadTitle
    );
    if (postRef) {
      deleteObject(postRef);
    }

    // Remove the compressed versions as well
    const postRef150 = ref(
      FIREBASE_STORAGE,
      "user/" + userID + "/posts/" + profileData.tempUploadTitle + "_150x150"
    );
    if (postRef150) {
      deleteObject(postRef150);
    }
    const postRef720 = ref(
      FIREBASE_STORAGE,
      "user/" + userID + "/posts/" + profileData.tempUploadTitle + "_720x720"
    );
    if (postRef720) {
      deleteObject(postRef720);
    }
  };

  const handlePost = async () => {
    // TODO: Create some animation for when a user posts photo
    setPostLoaded(false);

    // Add post to post pool
    const userID = FIREBASE_AUTH.currentUser.uid;
    const postDir =
      "user/" + userID + "/posts/" + profileData.tempUploadTitle + "_720x720";
    const postRef = ref(FIREBASE_STORAGE, postDir);
    const postURL = await getDownloadURL(postRef);
    const postData = {
      userId: userID,
      postURL: postURL,
      postDir: postDir,
      datetime: profileData.tempUploadTitle,
    };

    // Create post reference in database
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
          style={[styles.uploadButton, styles.loading]}
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
              onTouchStart={() => setPressed(true)}
              onTouchEnd={() => setPressed(false)}
            >
              {/* <View style={[styles.innerCircle]}></View> */}
              <View
                style={[
                  styles.uploadButtonPlus,
                  styles.plusHorizontal,
                  pressed && styles.uploadButtonPlusPressed,
                ]}
              ></View>
              <View
                style={[
                  styles.uploadButtonPlus,
                  styles.plusVertical,
                  pressed && styles.uploadButtonPlusPressed,
                ]}
              ></View>
              <View
                style={[
                  styles.uploadButtonPlusBlur,
                  styles.plusHorizontal,
                  pressed && styles.uploadButtonPlusPressed,
                ]}
              ></View>
              <View
                style={[
                  styles.uploadButtonPlusBlur,
                  styles.plusVertical,
                  pressed && styles.uploadButtonPlusPressed,
                ]}
              ></View>
              <Bubble />
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

// TODO: Need to fix this for larger screen sizes, can't use window width for plus icon
const screenWidth = Dimensions.get("window").width;
const outerCircleDiameter = screenWidth - 26;
const innerCircleDiameter = screenWidth - 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 1,
  },
  uploadButton: {
    borderRadius: "50%",
    //border: "4px solid black",
    alignSelf: "center",
    justifyContent: "center",
    height: outerCircleDiameter,
    maxHeight: 474,
    width: outerCircleDiameter,
    maxWidth: 474,
    backgroundColor: "black",
  },
  uploadButtonPressed: {
    backgroundColor: "rgba(0,50,50,0.8)",
  },
  loading: {
    border: "none",
    backgroundColor: "#00FFFF",
  },
  innerCircle: {
    borderRadius: "50%",
    border: "4px dashed black",
    alignSelf: "center",
    justifyContent: "center",
    height: innerCircleDiameter,
    maxHeight: 474,
    width: innerCircleDiameter,
    maxWidth: 474,
    backgroundColor: "transparent",
    strokeLinecap: "round",
  },
  uploadButtonPlus: {
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,255,255,1)",
    borderRadius: 4,
    position: "absolute",
    zIndex: 5,
  },
  uploadButtonPlusBlur: {
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,255,255,1)",
    borderRadius: 4,
    position: "absolute",
  },
  uploadButtonPlusPressed: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  plusHorizontal: {
    height: 4,
    width: outerCircleDiameter * 0.4,
  },
  plusVertical: {
    height: outerCircleDiameter * 0.4,
    width: 4,
  },
  post: {
    borderRadius: "50%",
    alignSelf: "center",
    justifyContent: "center",
    height: outerCircleDiameter,
    maxHeight: 474,
    width: outerCircleDiameter,
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
