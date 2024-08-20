import { StyleSheet, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useProfileData } from "../ProfileContext";
import { httpsCallable } from "firebase/functions";
import { FIREBASE_FUNCS } from "../FirebaseConfig";

const AddBud = ({ userId, buttonStyle }) => {
  const budId = userId;
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  // Pull if userId is in buds list and set added based on that
  const [added, setAdded] = useState(false);
  const addBudNotification = httpsCallable(
    FIREBASE_FUNCS,
    "addBudNotification"
  );
  const removeBudNotification = httpsCallable(
    FIREBASE_FUNCS,
    "removeBudNotification"
  );

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
      // Remove each other from bud lists
      const notification = {
        userId: profileData.userId,
        budId: budId,
      };
      removeBudNotification(notification).catch((error) => {
        console.log("Error: ", error);
      });
    } else {
      updateProfile({
        buds: [...profileData.buds, budId],
      });
      // Check if bud is already in users recentlyAdded list
      if (!profileData.recentlyAdded.includes(budId)) {
        // A firebase function to add profileData.userId to the recentlyAdded of budId
        // Create a new burst notification
        const notification = {
          userId: profileData.userId,
          budId: budId,
        };
        // Send the burst notification to the other user
        addBudNotification(notification).catch((error) => {
          console.log("Error: ", error);
        });
      } else {
        // remove bud from recently added (now mutuals)
        updateProfile({
          recentlyAdded: profileData.recentlyAdded.filter((id) => id !== budId),
        });
      }
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
