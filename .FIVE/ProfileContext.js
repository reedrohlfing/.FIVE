import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";

const ProfileContext = createContext();

export const useProfileData = () => useContext(ProfileContext);

const defaultData = {
  phoneNumber: "",
  phoneNumberNoCountry: "",
  firstName: "Name",
  firstNameLower: "",
  lastName: "",
  lastNameLower: "",
  title: "Title",
  location: "Location",
  age: "Age",
  email: "",
  birthday: "",
  school: "",
  linkTitle: "",
  linkURL: "",
  initialized: false,
  profileImage: require("./assets/icons/add-black-active.png"),
  profileImageLarge: require("./assets/icons/add-black-active.png"),
  profileImageRef: "",
  buds: [],
  iBursted: [],
};

const fetchProfileData = async (userId, setProfileData) => {
  try {
    const docRef = doc(FIREBASE_DB, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfileData({ ...defaultData, ...docSnap.data() });
    } else {
      console.log(
        "ERROR: Couldn't find user document from FireStore database. User is likely not initialized"
      );
    }
  } catch (error) {
    console.error("Error fetching profile data: ", error);
  }
};

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isProfileSetUp, setIsProfileSetUp] = useState(null);
  const [profileData, setProfileData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if (!user) {
        setIsProfileSetUp(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfileData(user.uid, setProfileData);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const docRef = doc(FIREBASE_DB, "users", user.uid);
      const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfileData((prev) => ({ ...prev, ...userData }));
          setIsProfileSetUp(userData.initialized);
        } else {
          setIsProfileSetUp(false);
        }
        setLoading(false);
      });

      return () => unsubscribeDoc();
    }
  }, [user]);

  const updateProfile = async (newData) => {
    setProfileData((prev) => ({ ...prev, ...newData }));
    if (user) {
      try {
        const docRef = doc(FIREBASE_DB, "users", user.uid);
        await updateDoc(docRef, newData);
      } catch (error) {
        console.log(
          "Cannot update profile because user document does not exist or update failed.",
          error
        );
      }
    } else {
      console.log("Error: Cannot update profile because user cannot be found.");
    }
  };

  const value = useMemo(
    () => ({
      user,
      isProfileSetUp,
      profileData,
      defaultData,
      setProfileData,
      updateProfile,
    }),
    [user, isProfileSetUp, profileData]
  );

  return (
    <ProfileContext.Provider value={value}>
      {!loading && children}
    </ProfileContext.Provider>
  );
};
