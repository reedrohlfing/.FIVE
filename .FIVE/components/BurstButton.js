import { useState, useEffect } from "react";
import { StyleSheet, Image, Pressable } from "react-native";
import { useProfileData } from "../ProfileContext";
import moment from "moment";
import { FIREBASE_FUNCS } from "../FirebaseConfig";
import { httpsCallable } from "firebase/functions";

const BurstButton = ({ budId }) => {
  const [pressed, setPressed] = useState(false);
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();
  const sendBurstNotification = httpsCallable(
    FIREBASE_FUNCS,
    "sendBurstNotification"
  );

  useEffect(() => {
    // Check if user has already been bursted
    if (profileData.iBursted.includes(budId)) {
      setPressed(true);
    }
  }, [profileData, budId]);

  const handleBurst = () => {
    setPressed(true);

    // Add user to buds list if not included already
    if (!profileData.buds.includes(budId)) {
      updateProfile({
        buds: [...profileData.buds, budId],
      });
    }

    // Only send a notification if bud hasn't already been bursted
    if (!profileData.iBursted.includes(budId)) {
      // Add burst notification to my burst list
      updateProfile({
        iBursted: [...profileData.iBursted, budId],
      });
      // Create a new burst notification
      const burstNotification = {
        senderId: profileData.userId,
        receiverId: budId,
        timestamp: moment.utc().format("YYYYMMDD_HHmmss"),
      };
      // Send the burst notification to the other user
      sendBurstNotification(burstNotification).catch((error) => {
        console.log("Error: ", error);
      });
    }
  };

  return (
    <Pressable style={styles.burstButton} onPress={() => handleBurst()}>
      <Image
        style={styles.burstButtonImg}
        source={
          pressed
            ? require("../assets/icons/burst2-black-active.png")
            : require("../assets/icons/burst2-black-inactive.png")
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  burstButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  burstButtonImg: {
    height: 34,
    width: 34,
  },
});

export { BurstButton };
