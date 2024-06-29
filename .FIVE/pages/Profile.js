import { StyleSheet, Image, ScrollView, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import ProfileHeader from "../components/ProfileHeader";

const useProfileData = () => {
  const user = FIREBASE_AUTH.currentUser;
  const defaultData = {
    firstName: "Name",
    lastName: "",
    phoneNumber: user.phoneNumber,
    email: "",
    age: "Age",
    location: "Location",
    birthday: "",
    title: "Title",
    school: "",
    links: [null],
    initialized: false,
  };
  const [profileData, setProfileData] = useState(defaultData);

  const updateProfile = async (newData) => {
    setProfileData((prevProfileData) => ({ ...prevProfileData, ...newData }));
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const docRef = doc(FIREBASE_DB, "users", user.uid);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        await updateDoc(docRef, newData);
      } else {
        console.log(
          "Cannot update profile because user document does not exist."
        );
      }
    } else {
      console.log("Error: Cannot update profile because user cannot be found.");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const docRef = doc(FIREBASE_DB, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfileData(userData);
        } else {
          console.log(
            "ERROR: Couldn't find user document from FireStore database. User is likely not initialized"
          );
        }
      } else {
        console.log("ERROR: Couldn't find user from FireStore database.");
      }
    };

    fetchProfileData();
  }, []);

  return { profileData, setProfileData, updateProfile };
};

const ImageComponent = ({ image, size }) => {
  return (
    <Image
      style={[styles.bubble, { height: size, width: size }]}
      source={image}
    />
  );
};

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <ScrollView
        style={styles.bubblesScroll}
        contentContainerStyle={styles.bubblesContainer}
      >
        <ImageComponent
          image={require("../fake-cdn/images/blacks.jpg")}
          size={75}
        />
        <ImageComponent
          image={require("../fake-cdn/images/croatia.jpg")}
          size={150}
        />
        <ImageComponent
          image={require("../fake-cdn/images/green.jpg")}
          size={200}
        />
        <ImageComponent
          image={require("../fake-cdn/images/f1.jpg")}
          size={300}
        />
        <ImageComponent
          image={require("../fake-cdn/images/tennis.jpg")}
          size={112}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bubblesScroll: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  bubblesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bubble: {
    maxHeight: 402,
    maxWidth: 402,
    borderRadius: 9000,
    margin: 6,
  },
});

export { Profile, useProfileData };
