import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useProfileData } from "../ProfileContext";

const AddBud = ({ userId, buttonStyle }) => {
  const budId = userId;
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  // Pull if userId is in buds list and set added based on that
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (profileData.buds.includes(budId)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [profileData.buds, budId]);

  const handlePress = () => {
    // If added is true when the button is pushed, remove the bud
    if (added) {
      updateProfile({
        buds: profileData.buds.filter((id) => id !== budId),
      });
    } else {
      updateProfile({
        buds: [...profileData.buds, budId],
      });
    }
    setAdded(!added);
  };

  return (
    <Pressable style={buttonStyle} onPress={handlePress}>
      <Image
        style={styles.circle}
        source={
          added
            ? require("../assets/icons/remove-lblue.png")
            : require("../assets/icons/add-dblue.png")
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    //backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },
});

export { AddBud };
